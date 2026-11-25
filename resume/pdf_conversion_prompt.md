# Reusable Prompt: HTML Resume → Single-Page "Pageless" PDF

Copy the prompt below into any AI agent session, replacing the two variables in the **Inputs** section.

---

## Prompt

**Role:** You are a document-generation agent. Convert the HTML resume at `{{HTML_PATH}}` into a PDF at `{{OUTPUT_PDF}}` using **standard A4 paper width (210mm)** but with a **custom page height that matches the content** — a single continuous "pageless" page, with text at full size (no shrinking/zoom).

### Inputs
- `HTML_PATH` = `./index.html` (source resume)
- `OUTPUT_PDF` = `./resume.pdf` (destination)

### Hard requirements
1. Page width must be exactly **210mm (A4 width)**.
2. Page height must be **fitted to the content** so the entire resume lands on **exactly 1 page** — like Google Docs "pageless" mode.
3. Do **not** use `zoom` or scaling tricks to squeeze content onto a fixed A4-height page. Text stays at its natural size.
4. Preserve the original layout, colors, fonts, icons, and section order. Nothing clipped; backgrounds enabled.

### Recommended method
Use **headless Chrome** (CLI or Playwright/Puppeteer). The page uses Tailwind via CDN, Google Fonts, and Font Awesome, so static renderers won't style it correctly.

1. Inject a temporary print stylesheet into a copy of the HTML:

```css
@page { size: 210mm __HEIGHT__mm; margin: 0; }
```

Do **not** override the HTML's own margins/padding (`mb-8`, `mb-6`, etc.) — that destroys the section spacing. Only set the page size.

2. Find the content height by binary search: render with candidate heights (start ~50–800mm) and check that (a) the PDF has exactly 1 page and (b) the last piece of visible text from the HTML appears in the extracted PDF text. Use the smallest height that passes, then add ~4mm safety padding.
3. Generate with:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  --print-to-pdf="{{OUTPUT_PDF}}" "file://{{TEMP_HTML}}"
```

4. Verify with `pypdf`:

```bash
python3 -c "from pypdf import PdfReader; r=PdfReader('{{OUTPUT_PDF}}'); print(len(r.pages), r.pages[0].mediabox)"
```

Expected: `1` page, width ≈ 595pt (210mm), height = fitted content height.

### Final report
Return: output path, page count, page size in mm, file size, and confirm that no text was clipped.

---

## Quick one-line variant

> Convert `{{HTML_PATH}}` to a single "pageless" PDF at `{{OUTPUT_PDF}}` using headless Chrome: inject `@page { size: 210mm Hmm; margin: 0; }`, binary-search H until the PDF is exactly 1 page with all text present (normalize whitespace when comparing), add 4mm padding, render with `printBackground` enabled, and verify with `pypdf` that width is 210mm.
