import subprocess
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import create_tailored_resume
import os
# --- Hardcoded Inputs ---

RESUME_FILE = "output/resume.txt"
JD_FILE = "input/job_description.txt"

def read_file(file):
    with open(file) as f:
        return "\n".join(i for i in f.readlines())

# resume_text = read_file(RESUME_FILE)

# job_description = read_file(JD_FILE)



# --- Helper Functions ---
def compute_ats_score(jd: str, resume: str) -> float:
    """
    Compute ATS match score via TF-IDF cosine similarity.
    Returns percentage 0-100.
    """
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf = vectorizer.fit_transform([jd, resume])
    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    return round(score * 100, 2)


def query_deepseek(prompt: str) -> str:
    """
    Query the local Ollama deepseek-r1:8b model via subprocess.
    """
    command = ["ollama", "run", "deepseek-r1:8b"]
    result = subprocess.run(
        command,
        input=prompt.encode("utf-8"),
        capture_output=True,
        text=False  # important!
    )
    output = result.stdout.decode("utf-8", errors="replace")
    flag = False
    for i in output.splitlines():
        if ((not flag) and i.startswith("<think>")):
            output = output.replace(i, "")
            flag = True
        if(flag):
            output = output.replace(i, "")
        if(i.startswith("</think>") and flag):
            output = output.replace(i, "")
            flag = False
    output = output.strip()
    print(output)
    return output

# --- Main Execution ---
# if __name__ == "__main__":
# 1. Compute and display ATS score
def get_ats_and_remarks():
    print(os.getcwd())
    job_description = "../public/uploads/job_description.txt"
    resume = "../public/output/resume.txt"
    job_description_text = read_file(job_description)
    resume_text = read_file(resume)
    ats_score = compute_ats_score(job_description, resume_text)
    print(f"1. Job Description Match Score: {ats_score}%\n")

    
    # 2. Build prompt for deepseek analysis
    prompt = f"""
Resume Text:
{resume_text}

Job Description:
{job_description}

You are an automated resume evaluator.

Provide your output in **exactly this format** — plain text only, no markdown, no extra comments, no explanation, no symbols:

Line 1: Keyword match score (as a number only, e.g. 85)
Line 2: Skills match score (number only)
Line 3: Format score (number only)
Line 4–6: 3 matching skills (one per line, only the skill name)
Line 7–9: 3 missing skills (one per line, only the skill name)

Do not include any labels, punctuation, explanations, or extra characters. Output exactly 9 lines in total.
"""


    # 3. Query model and print result
    ai_output = query_deepseek(prompt).split("\n")
    output = []
    output.append(ai_output[:3])
    output.append(ai_output[3:6])
    output.append(ai_output[6:9])
    print("2. Analysis Result:\n")
    print(output)

    return output


