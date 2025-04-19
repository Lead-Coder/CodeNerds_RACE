import json
import subprocess
import pytesseract
from PIL import Image
from tika import parser
import spacy
import re
import pandas as pd
from gensim.models import Word2Vec
import os
import openai

# === Define directory paths ===
INPUT_DIR = "input"
JSON_DIR = "jsons"
OUTPUT_DIR = "output"
MODEL_PATH = "models\\skill2vec.model"

resume_file = os.path.join(INPUT_DIR, "resume.pdf")
extra_info_file = os.path.join(INPUT_DIR, "extra_info.json")

os.makedirs(JSON_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def parse_resume():
    nlp = spacy.load("en_core_web_sm")

    def is_image(file_path):
        return file_path.lower().endswith(('.png', '.jpg', '.jpeg'))

    def clean_text(text):
        mailto_matches = [m.start() for m in re.finditer(r'mailto:.*', text)]
        text = text[:mailto_matches[0]] if mailto_matches else text
        return text

    def extract_text(file_path):
        if is_image(file_path):
            print("[INFO] Using Tesseract OCR for image.")
            image = Image.open(file_path)
            return pytesseract.image_to_string(image)
        else:
            print("[INFO] Using Apache Tika for text-based file.")
            raw = parser.from_file(file_path)
            return clean_text(raw['content']) if raw['content'] else ""

    def extract_basic_info(text):
        doc = nlp(text)
        name = next((ent.text for ent in doc.ents if ent.label_ == "PERSON"), None)
        email = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,}\b", text)
        phone = re.search(r"(\+?\d{1,3})?[-.\s]?\(?\d{2,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}", text)
        return {
            "name": name,
            "email": email.group() if email else None,
            "phone": phone.group() if phone else None
        }

    def extract_sections(text):
        import difflib
        known_sections = [
            "contact", "personal details", "summary", "skills", "education",
            "experience", "projects", "certifications", "extracurricular activities",
            "languages", "publications", "references", "volunteering",
            "training", "declaration"
        ]
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        section_data = {}
        current_section = None
        buffer = []

        def get_closest_section(line):
            match = difflib.get_close_matches(line.lower(), known_sections, n=1, cutoff=0.6)
            return match[0] if match else None

        for line in lines:
            if line.isupper() or (line.istitle() and len(line.split()) <= 5):
                matched = get_closest_section(line)
                if matched:
                    if current_section and buffer:
                        section_data[current_section] = '\n'.join(buffer).strip()
                        buffer = []
                    current_section = matched
                    continue
            if current_section:
                buffer.append(line)

        if current_section and buffer:
            section_data[current_section] = '\n'.join(buffer).strip()

        return section_data

    def merge_into_schema(basic_info, section_data):
        base_schema = {
            "name": basic_info["name"],
            "email": basic_info["email"],
            "phone": basic_info["phone"],
            "skills": section_data.pop("skills", None),
            "education": section_data.pop("education", None),
            "experience": section_data.pop("experience", None),
        }
        base_schema.update(section_data)
        return base_schema

    def process_resume(file_path):
        text = extract_text(file_path)
        basic_info = extract_basic_info(text)
        section_data = extract_sections(text)
        full_data = merge_into_schema(basic_info, section_data)

        output_path = os.path.join(JSON_DIR, "resume.json")
        with open(output_path, "w") as f:
            json.dump(full_data, f, indent=4)
        print(f"[✓] Resume parsed and saved to: {output_path}")
        return full_data

    process_resume(resume_file)


def make_skill2vec_model():
    df = pd.read_csv('input\\skill2vec_50K.csv', header=None, low_memory=False)
    corpus = df.iloc[:, 1:].values.tolist()
    corpus = [[str(skill) for skill in row if pd.notnull(skill)] for row in corpus]

    model = Word2Vec(sentences=corpus, vector_size=100, window=5, min_count=1, workers=4)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save(MODEL_PATH)


def compare_jd_resume():
    model = Word2Vec.load(MODEL_PATH)

    def extract_skills_from_job(job_description):
        words = job_description.split()
        skills = []
        for word in words:
            try:
                if word in model.wv:
                    similar_skills = model.wv.most_similar(word, topn=3)
                    for skill, _ in similar_skills:
                        skills.append(skill)
            except KeyError:
                continue
        return skills

    def load_resume(filename):
        with open(filename, 'r') as file:
            return json.load(file)

    def compare_skills(extracted_skills, resume_skills):
        return [skill for skill in extracted_skills if skill not in resume_skills]

    def generate_requirements_json(job_description, resume_filename, output_filename):
        extracted_skills = extract_skills_from_job(job_description)
        resume_data = load_resume(resume_filename)
        resume_skills = resume_data.get('skills', [])
        missing_skills = compare_skills(extracted_skills, resume_skills)

        requirements = {
            "job_description": job_description,
            "required_skills": extracted_skills,
            "missing_skills": missing_skills
        }

        with open(output_filename, 'w') as outfile:
            json.dump(requirements, outfile, indent=4)
        print(f"[✓] Requirements saved to {output_filename}")
        return requirements

    job_description = """We are looking for a software engineer with experience in
    Python, machine learning, SQL, and data analytics. Familiarity with
    cloud technologies like AWS and Azure is a plus."""

    resume_filename = os.path.join(JSON_DIR, "resume.json")
    output_filename = os.path.join(JSON_DIR, "requirements.json")

    generate_requirements_json(job_description, resume_filename, output_filename)


def tailor_resume():
    def load_json(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)

    requirements = load_json(os.path.join(JSON_DIR, 'requirements.json'))
    resume = load_json(os.path.join(JSON_DIR, 'resume.json'))
    extra_info = load_json(extra_info_file)

    prompt = f"""
You are an expert resume writer.

Using the information below:
- Personal Information and Job Requirements: {json.dumps(requirements)}
- Existing Resume Data: {json.dumps(resume)}
- Extra Information: {json.dumps(extra_info)}

1. Tailor the resume exactly to the requirements.
2. Polish the resume with action verbs, quantification tips, and industry-aligned phrasing.
3. Make it highly impactful and clear.

Return ONLY the final polished resume. No extra explanations.

Let's begin.
    """

    command = ["ollama", "run", "deepseek-r1:8b"]
    result = subprocess.run(command, input=prompt, capture_output=True, text=True)
    output = result.stdout.strip().replace("<think>", "").replace("</think>", "").strip()

    output_path = os.path.join(OUTPUT_DIR, 'tailored_resume.txt')
    with open(output_path, 'w') as f:
        f.write(output)
    print(f"[✓] Tailored resume saved to {output_path}")



# === Main Flow ===
parse_resume()
print("resume parsed")
make_skill2vec_model()
print("model trained")
compare_jd_resume()
print("jd parsed")
tailor_resume()
print("parsed tailored")
