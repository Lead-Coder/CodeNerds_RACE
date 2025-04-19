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
import ats_score
import latex_creation

# # === Define directory paths ===
# PUBLIC_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), "../public"))

# INPUT_DIR = os.path.join(PUBLIC_FOLDER, "input")
# print(INPUT_DIR)
# JSON_DIR = os.path.join(PUBLIC_FOLDER, "jsons")
# OUTPUT_DIR = os.path.join(PUBLIC_FOLDER, "output")
# MODEL_PATH = os.path.join(PUBLIC_FOLDER, "models\\skill2vec.model")

# resume_file = os.path.join(INPUT_DIR, "resume.pdf")
# extra_info_file = os.path.join(INPUT_DIR, "extra_info.json")

# os.makedirs(JSON_DIR, exist_ok=True)
# os.makedirs(OUTPUT_DIR, exist_ok=True)

global_VARS = {
}

def parse_resume(resume_file):
    nlp = spacy.load("en_core_web_sm")

    def is_image(file_path):
        print("[INFO] Checking if file is an image.")
        return file_path.lower().endswith(('.png', '.jpg', '.jpeg'))

    def clean_text(text):
        print("[INFO] Cleaning text.")
        mailto_matches = [m.start() for m in re.finditer(r'mailto:.*', text)]
        text = text[:mailto_matches[0]] if mailto_matches else text
        return text

    def extract_text(file_path):
        if is_image(file_path):
            print("[INFO] Using Tesseract OCR for image.")
            image = Image.open(file_path)
            return pytesseract.image_to_string(image)
        else:
            try:

                raw = parser.from_file(file_path)
                content = raw.get('content', '')
                if content:
                    print("[✓] Tika successfully extracted content.")
                    return clean_text(content)
                else:
                    print("[✗] Tika returned empty content.")
                    return ""
            except Exception as e:
                print("[ERROR] Tika failed:", str(e))
                return ""

    def extract_basic_info(text):
        doc = nlp(text)
        name = next((ent.text for ent in doc.ents if ent.label_ == "PERSON"), None)
        email = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,}\b", text)
        phone = re.search(r"(\+?\d{1,3})?[-.\s]?\(?\d{2,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}", text)
        print("[INFO] Extracted basic information.")
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

        print("[INFO] Extracted sections from resume.")

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
        print('[INFO] Merging basic info with section data.')
        base_schema.update(section_data)
        return base_schema

    def process_resume(file_path):
        text = extract_text(file_path)
        basic_info = extract_basic_info(text)
        section_data = extract_sections(text)
        full_data = merge_into_schema(basic_info, section_data)
        print("[INFO] Resume processing complete.")

        output_path = os.path.join(global_VARS["JSON_DIR"], "resume.json")
        with open(output_path, "w") as f:
            json.dump(full_data, f, indent=4)
        print(f"[✓] Resume parsed and saved to: {output_path}")
        return full_data

    process_resume(resume_file)


def make_skill2vec_model():
    if os.path.exists(global_VARS["OUTPUT_DIR"]):
        return 
    df = pd.read_csv('input\\skill2vec_50K.csv', header=None, low_memory=False)
    corpus = df.iloc[:, 1:].values.tolist()
    corpus = [[str(skill) for skill in row if pd.notnull(skill)] for row in corpus]

    model = Word2Vec(sentences=corpus, vector_size=100, window=5, min_count=1, workers=4)
    os.makedirs(os.path.dirname(global_VARS["OUTPUT_DIR"]), exist_ok=True)
    model.save(global_VARS["OUTPUT_DIR"])


def compare_jd_resume():
    model = Word2Vec.load(global_VARS["OUTPUT_DIR"])

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

    resume_filename = os.path.join(global_VARS["JSON_DIR"], "resume.json")
    output_filename = os.path.join(global_VARS["JSON_DIR"], "requirements.json")

    generate_requirements_json(job_description, resume_filename, output_filename)


def generate_latex(template_path, resume_path, output_path):

    resume_text = ats_score.read_file(resume_path)
    template_text = ats_score.read_file(template_path)
    prompt = f"""
You are an expert resume writer and LaTeX template integrator.

Using the information below:
- Existing Resume Data (in plain text format): {json.dumps(resume_text)}
- Template Information (in LaTeX format): {json.dumps(template_text)}

1. Analyze the provided resume in plain text and extract key sections: Contact Information, Objective, Skills, Experience, Education, and any Additional Information.
2. Fit the extracted sections into the corresponding parts of the provided LaTeX template.
3. Ensure the LaTeX formatting is correct, including proper handling of bullet points, section titles, and paragraph formatting.
4. Polish the content with action verbs, quantification tips, and industry-aligned phrasing to make it impactful, concise, and professional.
5. Return ONLY the LaTeX code with the updated resume. No extra explanations or commentary.
6. Avoid making any assumptions or adding content that is not implied by the provided data.
7. Do not use emojis or any informal elements.
8. Use standard LaTeX packages that are widely available and professional.

Let's begin.

"""

    output = ats_score.query_deepseek(prompt)

    with open(output_path, 'w') as f:
        f.write(output)
    print(f"[✓] Tailored resume saved to {output_path}")


def generate_pdf(template_path, output_path):

    latex_creation.generate_latex(template_path, os.path.join(global_VARS["OUTPUT_DIR"], "tex.txt"))

    print("latex generateed")

    resume_path = latex_creation.generate_pdf(template_path, global_VARS["OUTPUT_DIR"])

    print("pdf generateed")

    return os.path.join(global_VARS["OUTPUT_DIR"], "tex.txt"), resume_path 
    


def tailor_resume():
    def load_json(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)

    requirements = load_json(os.path.join(global_VARS["JSON_DIR"], 'requirements.json'))
    resume = load_json(os.path.join(global_VARS["JSON_DIR"], 'resume.json'))
    extra_info = load_json(global_VARS["extra_files_info"])

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
    ats = 0
    resume_text_path = os.path.join(global_VARS["OUTPUT_DIR"], 'resume.txt')
    count = 0

    while count < 5  and ats < 85:
        create_txt_resume(prompt, resume_text_path)
        ats, remarks = ats_score.get_ats_and_remarks()
        prompt = f"""
You are an expert resume writer and ATS optimization specialist.

Using the following information:

    Job Requirements: {json.dumps(requirements)}

    Current Resume: {json.dumps(resume)}

    Additional Info: {json.dumps(extra_info)}

    ATS Feedback: {remarks}

Your tasks:

    Regenerate the resume to fix all issues noted in the ATS feedback (such as missing keywords, poor formatting, vague language, etc.).

    Ensure it still aligns perfectly with the job requirements.

    Use powerful action verbs, quantifiable results where applicable, and modern industry terminology.

    Keep the structure clear, professional, and ATS-friendly (avoid columns, graphics, or tables).

    Return only the final improved resume text — no explanations or extra commentary.

Make it polished, compelling, and fully optimized for both recruiters and applicant tracking systems.

"""
        count += 1

    template_path = "templates/template.txt"

    tex_file_path, resume_path = generate_pdf(template_path, resume_text_path)

    return tex_file_path, resume_path  


def create_txt_resume(prompt, output_path):
    output = ats_score.query_deepseek(prompt)


    with open(output_path, 'w') as f:
        f.write(output)
    print(f"[✓] Tailored resume saved to {output_path}")



import subprocess

def get_cover_letter_tex(prompt: str) -> str:
    """
    Query the local Ollama deepseek-r1:8b model via subprocess.
    """
    output = ats_score.query_deepseek(prompt)

    return output

# # === Load the generated cover letter ===
# with open("generated_cover_letter.txt", "r", encoding="utf-8") as f:
#     cover_letter = f.read()

# # === Prompt to convert cover letter to LaTeX ===
# prompt = f"""
# Convert the following professional cover letter into LaTeX code, suitable for a standalone document.
# Use standard documentclass like `article` or `letter`, include proper formatting, date, sender and recipient sections, and use professional fonts.

# Cover Letter:
# \"\"\"
# {cover_letter}
# \"\"\"
# """

# # === Generate the LaTeX code ===
# latex_code = get_cover_letter_tex(prompt)

# # === Save LaTeX code to a file ===
# with open("cover_letter.tex", "w", encoding="utf-8") as f:
#     f.write(latex_code)



# latex_path = "templates/template.txt"

# latex_creation.generate_pdf(latex_path, global_VARS["OUTPUT_DIR"])

# === Main Flow ===
def create_resume(resume_path, jd_path, extra_info_path):
    print("Parsing resume...")
    PUBLIC_FOLDER = "C:/GitHub/CodeNerds_RACE/public"
    global_VARS["PUBLIC_FOLDER"] = PUBLIC_FOLDER
    global_VARS["INPUT_DIR"] = os.path.join(PUBLIC_FOLDER, "input")
    global_VARS["JSON_DIR"] = os.path.join(PUBLIC_FOLDER, "jsons")
    global_VARS["OUTPUT_DIR"] = os.path.join(PUBLIC_FOLDER, "output")
    global_VARS["MODEL_PATH"] = "ML\\models\\skill2vec.model"
    resume_path_ = PUBLIC_FOLDER + resume_path
    global_VARS["extra_files_info"] = PUBLIC_FOLDER + extra_info_path
    global_VARS["Resume_file"] = resume_path_

    print(resume_path_)
    parse_resume(resume_path_)
    print("resume parsed")
    make_skill2vec_model()
    print("model trained")
    compare_jd_resume()
    print("jd parsed")
    tailor_resume()
    print("parsed tailored")


