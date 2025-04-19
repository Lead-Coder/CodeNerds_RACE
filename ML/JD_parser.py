import pandas as pd
from gensim.models import Word2Vec
import json

# Load the pre-trained Skill2Vec model
model = Word2Vec.load("ML/models/skill2vec.model")

# Function to extract skills from the job description using Skill2Vec
def extract_skills_from_job(job_description):
    words = job_description.split()
    skills = []

    for word in words:
        try:
            # Check if the word is a recognized skill in the model
            if word in model.wv:
                similar_skills = model.wv.most_similar(word, topn=3)  # Get top 3 similar skills
                for skill, _ in similar_skills:
                    skills.append(skill)
        except KeyError:
            continue

    return skills

# Load resume data (example, assuming it's in a JSON file)
def load_resume(filename):
    with open(filename, 'r') as file:
        resume_data = json.load(file)
    return resume_data

# Compare extracted skills with resume skills
def compare_skills(extracted_skills, resume_skills):
    missing_skills = [skill for skill in extracted_skills if skill not in resume_skills]
    return missing_skills

# Function to create the requirements.json file
def generate_requirements_json(job_description, resume_filename, output_filename="requirements.json"):
    # Extract skills from job description
    extracted_skills = extract_skills_from_job(job_description)

    # Load the resume
    resume_data = load_resume(resume_filename)
    resume_skills = resume_data.get('skills', [])

    # Find missing skills
    missing_skills = compare_skills(extracted_skills, resume_skills)

    # Create the requirements dictionary
    requirements = {
        "job_description": job_description,
        "required_skills": extracted_skills,
        "missing_skills": missing_skills
    }

    # Save to requirements.json
    with open(output_filename, 'w') as outfile:
        json.dump(requirements, outfile, indent=4)

    print(f"Requirements have been saved to {output_filename}")
    return requirements

# Example: Usage of the function
job_description = """We are looking for a software engineer with experience in
Python, machine learning, SQL, and data analytics. Familiarity with
cloud technologies like AWS and Azure is a plus."""

resume_filename = "resume.json"  # Your resume file should have a "skills" field
output_filename = "requirements.json"

# Generate requirements.json
requirements = generate_requirements_json(job_description, resume_filename, output_filename)
print(requirements)