#!/usr/bin/env python3
"""Render HTML to a single, pageless PDF: A4 width, height fitted to content.

Keeps text at full size (no zoom). Exploits Chrome's support for custom
@page sizes to make one continuous page exactly as tall as the content.
"""
import argparse
import html as html_lib
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
A4_WIDTH_MM = 210
SAFETY_MM = 4

PRINT_CSS = """
<style>
@page { size: 210mm __HEIGHT__mm; margin: 0; }
</style>
"""


def normalize(text: str) -> str:
    return re.sub(r"\s+", "", text)


def sentinel_from(source: str) -> str:
    text = re.sub(r"<(style|script)\b[^>]*>.*?</\1>", "", source, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_lib.unescape(text)
    return normalize(text)[-60:]


def render(src: str, height: float, workdir: Path, tag: str) -> Path:
    tmp_html = workdir / f"resume_{tag}.html"
    tmp_pdf = workdir / f"resume_{tag}.pdf"
    tmp_html.write_text(src.replace("</head>", PRINT_CSS.replace("__HEIGHT__", f"{height:.1f}") + "</head>"))
    subprocess.run(
        [
            CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
            "--virtual-time-budget=10000",
            f"--print-to-pdf={tmp_pdf}", tmp_html.as_uri(),
        ],
        check=True, capture_output=True, text=True,
    )
    return tmp_pdf


def complete(pdf: Path, sentinel: str) -> bool:
    from pypdf import PdfReader
    reader = PdfReader(str(pdf))
    if len(reader.pages) != 1:
        return False
    text = normalize(" ".join(p.extract_text() for p in reader.pages))
    return sentinel in text


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("html", nargs="?", default="index.html")
    ap.add_argument("out", nargs="?", default="resume.pdf")
    args = ap.parse_args()

    source = Path(args.html).resolve().read_text()
    out = Path(args.out).resolve()
    sentinel = sentinel_from(source)

    with tempfile.TemporaryDirectory() as td:
        workdir = Path(td)
        lo, hi = 50.0, 800.0
        best_height = None
        for i in range(8):
            mid = (lo + hi) / 2
            pdf = render(source, mid, workdir, f"try{i}")
            print(f"height={mid:6.1f}mm -> {'fits' if complete(pdf, sentinel) else 'overflow'}")
            if complete(pdf, sentinel):
                best_height = mid
                hi = mid
            else:
                lo = mid

        if best_height is None:
            raise SystemExit("Could not fit content on one page within 800mm.")

        final_height = best_height + SAFETY_MM
        final_pdf = render(source, final_height, workdir, "final")
        if not complete(final_pdf, sentinel):
            raise SystemExit("Final render failed verification.")

        shutil.copy(final_pdf, out)
        from pypdf import PdfReader
        box = PdfReader(str(out)).pages[0].mediabox
        print(f"Saved {out} ({out.stat().st_size:,} bytes)")
        print(f"Page size: {float(box.width):.0f}pt x {float(box.height):.0f}pt "
              f"({A4_WIDTH_MM}mm x {final_height:.1f}mm), 1 page")


if __name__ == "__main__":
    main()
