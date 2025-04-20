import subprocess
import re

def query_deepseek(prompt: str) -> str:
    prompt = re.sub(r'[^\x00-\x7F]+', '', prompt) 
    cmd = ["ollama", "run", "deepseek-r1:1.5b"]
    result = subprocess.run(cmd, input=prompt, capture_output=True, text=True)
    output = result.stdout.strip()
    return output.replace("<think>", "").replace("</think>", "")

company_name = "OpenAI"
job_description = """
We are looking for a Machine Learning Engineer with experience in:
- Deep learning frameworks like PyTorch or TensorFlow
- Working with Large Language Models (LLMs)
- Deploying models on cloud platforms such as AWS or GCP
- Using Docker and Kubernetes for containerization and orchestration
- Building REST APIs and working with microservices architecture
"""

resume_text = """
Experienced Python developer with 5 years in backend development. Proficient in Flask, Django, pandas, and NumPy. 
Worked with Docker to containerize web applications. Experience with scikit-learn for traditional ML. 
Built and deployed several REST APIs.
"""

prompt = f"""
Compare the following job description and resume. Return only the missing skills or qualifications from the resume that are required in the job description as a plain comma-separated list. No extra text.

Job Description:
{job_description}

Resume:
{resume_text}
"""

response = query_deepseek(prompt)
missing_skills = [skill.strip() for skill in response.split(',') if skill.strip()]

for skill in missing_skills:
    print(skill)
