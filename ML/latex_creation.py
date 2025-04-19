import subprocess
import tempfile
import os
import sys

def render_with_tectonic(latex_code: str,
                         output_dir: str = ".",
                         keep_tex: bool = False) -> str:
    fd, tex_path = tempfile.mkstemp(suffix=".tex", text=True)
    os.close(fd)
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(latex_code)

    base = os.path.splitext(os.path.basename(tex_path))[0]
    try:
        result = subprocess.run(
            [
                "C:\\Tectonic\\tectonic.exe", tex_path,
                "--outdir", output_dir,
                "--keep-logs",
                "--keep-intermediates" if keep_tex else "--print"
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print(result.stdout.decode())

    except subprocess.CalledProcessError as e:
        print(" Tectonic failed:")
        print(e.stderr.decode())
        log_path = os.path.join(output_dir, base + ".log")
        if os.path.exists(log_path):
            print(f"\n Check the log file at: {log_path}")
        raise

    pdf_path = os.path.join(output_dir, base + ".pdf")
    if not keep_tex:
        for ext in [".tex", ".aux", ".fls", ".fdb_latexmk"]:
            try:
                os.remove(os.path.join(output_dir, base + ext))
            except OSError:
                pass

    return pdf_path


def read_file(file):
    with open(file) as f:
        return "\n".join(i for i in f.readlines())


def generate_pdf(latex_path, output_path):    
    latex_code = read_file(latex_path)
    out_pdf = render_with_tectonic(latex_code, output_path)
    print(f"Generated PDF: {out_pdf}")
    return out_pdf
   

if __name__ == "__main__":
    # Example usage: you can also read raw LaTeX from a file or stdin
    sample = r"""
\documentclass{article}
\usepackage{amsmath}
\usepackage{graphicx}

\title{A Sample Document Rendered with Tectonic}
\author{Shivsharan Sanjawad}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}
This is a sample document to test Tectonic rendering. It contains a variety of LaTeX elements such as sections, equations, tables, and images. You can use this document to test Tectonic’s ability to compile documents with complex structures.

\section{Mathematics}
This section contains an equation rendered with the \texttt{amsmath} package. Here’s the quadratic formula:

\begin{equation}
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\end{equation}

This equation is commonly used to solve quadratic equations of the form \(ax^2 + bx + c = 0\).

\section{Tables}
Now let’s look at a table. The table below is a simple example of how LaTeX can format data in tabular form.

\begin{table}[h]
\centering
\begin{tabular}{|c|c|c|}
\hline
\textbf{Year} & \textbf{Product A} & \textbf{Product B} \\
\hline
2019 & 500 & 300 \\
2020 & 600 & 400 \\
2021 & 700 & 450 \\
\hline
\end{tabular}
\caption{Sales data for Product A and Product B.}
\end{table}

\section{Images}
LaTeX allows you to include images in your document. The \texttt{graphicx} package is used for this purpose. Below is an example of including an image:

\begin{figure}[h]
\centering
\includegraphics[width=0.5\textwidth]{example-image}
\caption{Sample image included in the document.}
\end{figure}

\section{Conclusion}
This document demonstrated a few basic LaTeX features such as equations, tables, and images. Use this template as a starting point for your own LaTeX documents.

\end{document}


"""
    out_pdf = render_with_tectonic(sample, output_dir=".")
    print(f"Generated PDF: {out_pdf}")

