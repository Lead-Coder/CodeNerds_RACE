#!/usr/bin/env python3
# -- coding: utf-8 --
"""
Robust Resume to LaTeX Converter - With AI-assisted formatting fixes
"""
import sys
import re
import subprocess

def clean_text(text):
    """Remove problematic characters and normalize text"""
    if not text:
        return ""
    # Replace special quotes and dashes with ASCII equivalents
    replacements = [
        ('\u2013', '-'),  # en dash
        ('\u2014', '-'),  # em dash
        ('\u2018', "'"),  # left single quote
        ('\u2019', "'"),  # right single quote
        ('\u201c', '"'),  # left double quote
        ('\u201d', '"'),  # right double quote
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text

def escape_latex(text):
    """Escape special LaTeX characters in cleaned text"""
    text = clean_text(text)
    replacements = [
        ('\\', r'\textbackslash'),
        ('&', r'\&'),
        ('%', r'\%'),
        ('$', r'\$'),
        ('#', r'\#'),
        
        ('{', r'\{'),
        ('}', r'\}'),
        ('~', r'\textasciitilde'),
        ('^', r'\textasciicircum'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text

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
    
    # Clean up <think> tags
    flag = False
    cleaned_lines = []
    for line in output.splitlines():
        if (not flag) and line.startswith("<think>"):
            flag = True
            continue
        if flag and line.startswith("</think>"):
            flag = False
            continue
        if not flag:
            cleaned_lines.append(line)
    
    output = "\n".join(cleaned_lines).strip()
    
    # Remove code fences that deepseek might add
    output = re.sub(r'^latex\s*', '', output)
    output = re.sub(r'^\s*', '', output)
    output = re.sub(r'\s*$', '', output)
    
    print("Cleaned output from deepseek:")
    print(output[:200] + "..." if len(output) > 200 else output)
    
    return output

def parse_resume(text):
    """Parse resume text into structured data with proper date handling"""
    sections = {
        'NAME': '',
        'LOCATION': '',
        'EMAIL': '',
        'PHONE': '',
        'OBJECTIVE': [],
        'EDUCATION': [],
        'EXPERIENCE': [],
        'PROJECTS': [],
        'SKILLS': [],
        'VOLUNTEERING': [],
        'ADDITIONAL': []
    }
    
    current_section = None
    
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        
        if not line or line.startswith('---'):
            continue
            
        # Section headers
        if line.upper() in ['OBJECTIVE', 'EDUCATION', 'EXPERIENCE', 
                          'PROJECTS', 'SKILLS', 'VOLUNTEERING', 'ADDITIONAL']:
            current_section = line.upper()
            continue
            
        # Heading info
        if current_section is None:
            if not sections['NAME']:
                sections['NAME'] = escape_latex(line)
            elif '@' in line and not sections['EMAIL']:
                parts = [p.strip() for p in line.split('|')]
                if parts:
                    sections['EMAIL'] = escape_latex(parts[0])
                if len(parts) > 1:
                    sections['PHONE'] = escape_latex(parts[1])
            elif not sections['LOCATION']:
                sections['LOCATION'] = escape_latex(line)
        else:
            # For longer entries that might span multiple lines
            if current_section in ['EDUCATION', 'EXPERIENCE', 'PROJECTS'] and line:
                entry = line
                # Look ahead for bullet points or continuation
                while i < len(lines) and lines[i].strip() and not lines[i].strip().upper() in sections:
                    if not lines[i].strip().startswith('-') and not lines[i].strip().startswith('•'):
                        entry += " " + lines[i].strip()
                    else:
                        break
                    i += 1
                
                sections[current_section].append(escape_latex(entry))
            else:
                sections[current_section].append(escape_latex(line))
    
    return sections

def extract_dates(text):
    """Extract dates from text using common patterns, ensuring they remain on the same line"""
    date_patterns = [
        r'(\w{3}\.? \d{4} - \w{3}\.? \d{4})',  # Month Year - Month Year
        r'(\w{3}\.? \d{4} - Present)',         # Month Year - Present
        r'(\d{4} - \d{4})',                     # Year - Year
        r'(\d{4} - Present)',                   # Year - Present
        r'(\w{3}\.? \d{4})',                    # Just Month Year
        r'(\d{4})',                             # Just Year
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            dates = match.group(1)
            remaining_text = text.replace(dates, '').strip(' -|')
            return dates, remaining_text
    return "", text

def format_section(title, items):
    """Format a resume section with proper date alignment - ensuring dates are on the same line"""
    if not items:
        return ""
    
    latex = [f"\\section{{{title}}}"]
    
    if title in ['EDUCATION', 'EXPERIENCE', 'PROJECTS', 'VOLUNTEERING']:
        latex.append("\\resumeSubHeadingListStart")
        
        for item in items:
            dates, text = extract_dates(item)
            
            if title == 'EDUCATION':
                # Split education into institution and degree
                parts = [p.strip() for p in text.split('|') if p.strip()]
                if len(parts) >= 2:
                    institution = parts[0]
                    degree = parts[1]
                    latex.append(f"\\resumeSubheading{{{institution}}}{{{dates}}}{{{degree}}}{{}}")
                else:
                    # If no split character found, use the entire text as institution
                    latex.append(f"\\resumeSubheading{{{text}}}{{{dates}}}{{}}{{}}")
            
            elif title in ['EXPERIENCE', 'VOLUNTEERING']:
                # Split experience into role and company
                parts = [p.strip() for p in text.split('|') if p.strip()]
                if len(parts) >= 2:
                    company = parts[0]
                    position = parts[1]
                    latex.append(f"\\resumeSubheading{{{position}}}{{{dates}}}{{{company}}}{{}}")
                    
                    # Check for bullet points and add them
                    bullet_points = []
                    for j in range(2, len(parts)):
                        if parts[j].startswith('-') or parts[j].startswith('•'):
                            bullet_points.append(parts[j].lstrip('-•').strip())
                    
                    if bullet_points:
                        latex.append("\\resumeItemListStart")
                        for point in bullet_points:
                            latex.append(f"\\resumeItem{{{point}}}")
                        latex.append("\\resumeItemListEnd")
                else:
                    latex.append(f"\\resumeSubheading{{{text}}}{{{dates}}}{{}}{{}}")
            
            elif title == 'PROJECTS':
                # Handle projects with possible bullet points
                parts = [p.strip() for p in text.split('|') if p.strip()]
                project_name = parts[0] if parts else text
                
                latex.append(f"\\resumeProjectHeading{{{project_name}}}{{{dates}}}")
                
                # Add project description and bullet points if available
                if len(parts) > 1:
                    latex.append("\\resumeItemListStart")
                    for i in range(1, len(parts)):
                        point = parts[i]
                        if point.startswith('-') or point.startswith('•'):
                            latex.append(f"\\resumeItem{{{point.lstrip('-•').strip()}}}")
                        else:
                            latex.append(f"\\resumeItem{{{point}}}")
                    latex.append("\\resumeItemListEnd")
            
        latex.append("\\resumeSubHeadingListEnd")
    
    elif title == 'SKILLS':
        latex.append("\\begin{itemize}[leftmargin=0.15in, label={}]")
        for item in items:
            if ':' in item:
                skill, details = item.split(':', 1)
                latex.append(f"\\item {skill.strip()}: {details.strip()}")
            else:
                latex.append(f"\\item {item}")
        latex.append("\\end{itemize}")
    
    elif title in ['OBJECTIVE', 'ADDITIONAL']:
        if title == 'OBJECTIVE':
            # For objective, use paragraph instead of list
            objective_text = " ".join(items).strip()
            if objective_text:
                latex.append(objective_text)
        else:
            latex.append("\\begin{itemize}[leftmargin=0.15in, label={}]")
            for item in items:
                if item.strip():  # Only add non-empty items
                    latex.append(f"\\item {item}")
            latex.append("\\end{itemize}")
    
    return '\n'.join(latex)



import re

def convert_resume_format(text):
    lines = []
    for line in text.splitlines():
        if(line.startswith("###")):
           line = line[7:]
           list = [] 
           for i in range(len(line)):
               if(line[i]=='*'):
                   list.append(i)
           line = line[list[1]:list[-2]]
           line = line.upper()
        elif line.contains("**"):
            list = []
            for i in range(len(line)):
               if(line[i]=='*'):
                   list.append(i)
            line = line[list[1]:list[-2]]
            line = line.upper()
        lines.append(line)
    return lines

# Example usage
# if __name__ == "__main__":
#     with open("resume_input.txt", "r", encoding="utf-8") as f:
#         resume_text = f.read()

#     converted = convert_resume_format(resume_text)

#     with open("resume_converted.txt", "w", encoding="utf-8") as f:
#         f.write(converted)

#     print("✅ Resume format converted and saved to 'resume_converted.txt'")

def main():
    print(sys.argv)
    if len(sys.argv) != 3:
        print("Usage: python resume2latex.py input.txt output.tex")
        sys.exit(1)
    
    try:
        # print(convert_resume_format(sys.argv[1]))
       # resume_text = convert_resume_format(sys.argv[1])
        resume_text = ""
        with open(r"C:\GitHub\CodeNerds_RACE\public\output\resume_2.txt", "r", encoding="utf-8") as f:
            resume_text = f.read()
        # with open(sys.argv[1], "w", encoding="utf-8") as f:
            # f.write(resume_text)

        # with open(sys.argv[1], 'r', encoding='utf-8', errors='replace') as f:
            # resume_text = f.read()
        
        data = parse_resume(resume_text)
        print(data)
        
        # Generate initial LaTeX template
        template_prompt = r"""
        Create a modern, clean LaTeX template for a professional resume with the following requirements:
        - Use a clean, professional font (preferably sans-serif)
        - Proper section formatting with subtle dividers
        - Align dates to the right side consistently
        - Ensure proper spacing between sections
        - Make bullet points look nice but not too prominent
        - Bold only section titles and names (no excessive bold)
        
        Return ONLY the LaTeX template code with placeholders for [NAME], [LOCATION], [EMAIL], [PHONE] 
        and section placeholders [OBJECTIVE], [EDUCATION], [EXPERIENCE], [PROJECTS], [SKILLS], [VOLUNTEERING], [ADDITIONAL].
        
        Your response should start with \documentclass and not include any extra info before that.
        Do not include code fence markers like latex or .
        """
        
        default_template = r"""\documentclass[letterpaper,11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

% Set font
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Section formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Custom commands with proper date alignment
\newcommand{\resumeItem}[1]{
  \item\small{#1}
}

\newcommand{\resumeSubheading}[4]{
  \item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small#4} \\
    \end{tabular*}\vspace{-5pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\newcommand{\resumeProjectHeading}[2]{
  \item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \small\textbf{#1} & \small{#2} \\
    \end{tabular*}\vspace{-5pt}
}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=0.25in, label=\textbullet]}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

% Prevent overfull hbox warnings
\sloppy

\begin{document}

%----------HEADING----------
\begin{center}
    \textbf{\Huge \scshape [NAME]} \\ \vspace{1pt}
    \small [LOCATION] \\ \vspace{2pt}
    \small \href{mailto:[EMAIL]}{\underline{[EMAIL]}} $|$ 
    \href{tel:[PHONE]}{\underline{[PHONE]}}
\end{center}

[OBJECTIVE]

[EDUCATION]

[EXPERIENCE]

[PROJECTS]

[SKILLS]

[VOLUNTEERING]

[ADDITIONAL]

\end{document}
"""
        
        try:
            template = query_deepseek(template_prompt)
            # Validate the template
            if not (template.strip().startswith("\\documentclass") and 
                   "\\begin{document}" in template and 
                   "\\end{document}" in template):
                print("AI response doesn't contain proper LaTeX structure. Using default template.")
                template = default_template
        except Exception as e:
            print(f"Error using AI for template: {str(e)}")
            template = default_template
        
        # Generate LaTeX content for sections
        latex = template
        for key in data:
            if key in ['NAME', 'LOCATION', 'EMAIL', 'PHONE']:
                latex = latex.replace(f'[{key}]', data[key])
            else:
                section_content = format_section(key, data[key])
                latex = latex.replace(f'[{key}]', section_content)
        
        # Ensure all placeholders are replaced
        for key in ['OBJECTIVE', 'EDUCATION', 'EXPERIENCE', 'PROJECTS', 
                   'SKILLS', 'VOLUNTEERING', 'ADDITIONAL']:
            if f'[{key}]' in latex:
                latex = latex.replace(f'[{key}]', '')  # Remove empty sections
        
        # Use AI to fix any formatting issues
        fix_prompt = fr"""
        Fix any formatting issues in the following LaTeX resume code. Focus on:
        1. Proper date alignment (dates should be on the same line as their headings)
        2. Remove excessive bold formatting
        3. Fix spacing between sections
        4. Ensure proper indentation for lists
        5. Make sure fonts are consistent
        
        Return ONLY the corrected LaTeX code with no explanations.
        Your response should start with \documentclass and not include any extra info before that.
        Do not include code fence markers like latex or ```.
        
        Here's the LaTeX code:
        
        {latex}
        """
        
        try:
            fixed_latex = query_deepseek(fix_prompt)
            # Verify the AI response contains key LaTeX elements and starts correctly
            if (fixed_latex.strip().startswith("\\documentclass") and 
                "\\begin{document}" in fixed_latex and 
                "\\end{document}" in fixed_latex):
                latex = fixed_latex
            else:
                print("AI formatting response invalid, using original formatting")
        except Exception as e:
            print(f"Error using AI for formatting fixes: {str(e)}")
        
        with open(sys.argv[2], 'w', encoding='utf-8') as f:
            f.write(latex)
        
        print(f"Successfully generated LaTeX resume: {sys.argv[2]}")
        print("Compile with: pdflatex", sys.argv[2])
    
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
	