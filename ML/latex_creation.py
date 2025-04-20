import subprocess
import tempfile
import os

def render_with_tectonic_file(tex_path: str,
                               output_dir: str = ".",
                               keep_tex: bool = False) -> str:
    base = os.path.splitext(os.path.basename(tex_path))[0]

    cmd = [
        "C:\\Tectonic\\tectonic.exe",
        tex_path,
        "--outdir", output_dir
    ]

    if keep_tex:
        cmd.append("--keep-intermediates")
        cmd.append("--keep-logs")
    else:
        cmd.append("--print")  # keeps things clean

    try:
        result = subprocess.run(
            cmd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print(result.stdout.decode())
    except subprocess.CalledProcessError as e:
        print("Tectonic failed:")
        print(e.stderr.decode())
        raise

    return os.path.join(output_dir, base + ".pdf")


def generate_pdf_from_file(tex_path, output_path="."):
    out_pdf = render_with_tectonic_file(tex_path, output_path)
    print(f"✅ Generated PDF: {out_pdf}")
    return out_pdf

