from flask import Flask, request, jsonify, send_file
import create_tailored_resume
import os
import ats_score
import latex_creation
from flask_cors import CORS
import numpy as np

PUBLIC_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), "../public"))
INPUT_DIR = os.path.join(PUBLIC_FOLDER, "input")
JSON_DIR = os.path.join(PUBLIC_FOLDER, "jsons")
OUTPUT_DIR = os.path.join(PUBLIC_FOLDER, "output")
MODEL_PATH = os.path.join(PUBLIC_FOLDER, "models\\skill2vec.model")

resume_file = os.path.join(INPUT_DIR, "resume.pdf")
extra_info_file = os.path.join(INPUT_DIR, "extra_info.json")
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True, methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

@app.route('/generate-resume', methods=['POST', 'OPTIONS'])
def generate_resume():
    if request.method == 'OPTIONS':
        return '', 204
    content = request.json
    resume_path = content.get("resumeUrl")
    jd_path = content.get("jobDescription")
    company_name = content.get("companyName")
    extra_info_path = content.get("resumeText")
    if not resume_path or not jd_path:
        return jsonify({"error": "Missing resume_path or jd_path in request"}), 400

    try:
        print("resume_path", resume_path)
        print("jd_path", jd_path)   
        data = create_tailored_resume.create_resume(resume_path, jd_path, extra_info_path)

        return jsonify(data)
    except Exception as e:
        print("error", e)
        return jsonify({"error": str(e)}), 500


@app.route('/ats_score_remarks', methods=['POST'])
def get_ats_score_remarks():
    try:
        # tex_file_path, resume_path  
        remarks = ats_score.get_ats_and_remarks()
        data = {
            "a": remarks[0],
            "b": remarks[1],
            "c": remarks[2],
        }
        cleaned_data = []

        for idx, group in enumerate(data):
            if idx == 0:
                # First array (scores): replace "" or None with "80"
                cleaned_group = [item if item and item.strip() else "80" for item in group]
            else:
                # Second and third arrays (skills): remove "" or None
                cleaned_group = [item for item in group if item and item.strip()]
            cleaned_data.extend(cleaned_group)
            return jsonify(data)
    except Exception as e:
        print("error", e)
        return jsonify({"error": str(e)}), 500

@app.route('/tex_to_pdf', methods=['POST'])
def tex_to_pdf():
    try:
        data = latex_creation.generate_pdf("../public/output/tex.tex", OUTPUT_DIR)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/compare_jd_resume', methods=['POST'])
def compare_jd_resume():
    requirements = create_tailored_resume.compare_jd_resume()
    return jsonify(requirements)

@app.route('/tailor_resume', methods=['POST'])
def tailor_resume():
    ats, file_path = create_tailored_resume.tailor_resume()
    return jsonify({"ats_score": ats, "file": file_path})

@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    template = "../public/templates/template.txt"
    output ="../public/outputs/tex.txt"
    create_tailored_resume.generate_pdf(template, output)
    return jsonify({"message": "PDF generated."})

@app.route('/generate_cover_letter', methods=['POST'])
def generate_cover_letter():
    if request.method == 'OPTIONS':
        return '', 204
    content = request.json
    resume_path = content.get("resumeUrl")
    jd_path = content.get("jobDescription")
    company_name = content.get("companyName")
    extra_info_path = content.get("resumeText")
    create_tailored_resume.generate_cover_letter()
    with open("cover_letter.tex", "r") as f:
        latex = f.read()
    return jsonify({"latex": latex})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
