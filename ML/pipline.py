import os
import pytesseract
from PIL import Image
from tika import parser
import spacy
import re
import json

nlp = spacy.load("en_core_web_sm")

def is_image(file_path):
    return file_path.lower().endswith(('.png', '.jpg', '.jpeg'))

def clean_text(text):
    # text = re.sub(r'mailto:.*', '', text)
    mailto_matches = [m.start() for m in re.finditer(r'mailto:.*', text)]

    text = text[:mailto_matches[0]]
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

    # Predefined semantic section names (for grouping)
    known_sections = [
    # Contact/Personal Info
    "contact", "contact information", "personal information", "personal details",
    "address", "phone", "email", "linkedin", "github", "portfolio",

    # Career Summary
    "summary", "professional summary", "career summary", "objective", "career objective",
    "about me", "profile",

    # Skills
    "skills", "technical skills", "core competencies", "key skills", "tools and technologies",
    "programming languages", "technologies", "software proficiency",

    # Education
    "education", "academic background", "educational qualifications",
    "education background", "academic history", "academics", "qualifications",

    # Experience
    "experience", "professional experience", "work experience", "employment history",
    "internships", "internship experience", "work history", "career history",
    "job history", "professional background", "project experience",

    # Projects
    "projects", "personal projects", "academic projects", "major projects", "minor projects",

    # Certifications & Achievements
    "certifications", "licenses", "accomplishments", "achievements", "awards",
    "honors", "recognitions",

    # Extra Curricular
    "extracurricular activities", "co-curricular activities", "hobbies", "interests",

    # Languages
    "languages", "language proficiency", "spoken languages",

    # Publications & Research
    "publications", "research", "research papers", "conferences", "journals",

    # References
    "references", "referees", "recommendations",

    # Volunteering & Leadership
    "volunteer experience", "volunteering", "leadership experience", "community service",

    # Training & Workshops
    "training", "workshops", "seminars", "conferences attended",

    # Extraneous but occasionally present
    "declaration", "personal strengths", "personal statement", "objective statement"
    ]


    # Clean and split text
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    section_data = {}
    current_section = None
    buffer = []

    def get_closest_section(line):
        match = difflib.get_close_matches(line.lower(), known_sections, n=1, cutoff=0.6)
        return match[0] if match else None

    for i, line in enumerate(lines):
        # Heading heuristics
        if (
            line.isupper() or 
            (line.istitle() and len(line.split()) <= 5) or 
            re.match(r'^[A-Za-z\s]{3,30}[:\-]$', line)
        ):
            matched = get_closest_section(line)
            if matched:
                # Save previous buffer
                if current_section and buffer:
                    section_data[current_section] = '\n'.join(buffer).strip()
                    buffer = []
                current_section = matched
                continue

        if current_section:
            buffer.append(line)

    # Add last section
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
    base_schema.update(section_data)  # add any extra detected fields
    return base_schema

def process_resume(file_path):
    text = extract_text(file_path)
    basic_info = extract_basic_info(text)
    section_data = extract_sections(text)
    full_data = merge_into_schema(basic_info, section_data)

    # output_path = os.path.splitext(file_path)[0] + "_parsed.json"
    output_path = "resume.json"
    with open(output_path, "w") as f:
        json.dump(full_data, f, indent=4)
    print(f"[✓] Resume parsed and saved to: {output_path}")
    return full_data

# === Example usage ===

FILE = "ML/resume.pdf"
process_resume(FILE)
