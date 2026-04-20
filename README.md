# Alif Akbar - Personal Portfolio

A premium, high-performance personal portfolio website built with a modern static site generation stack.

## 🚀 Tech Stack

- **SSG**: [11ty (Eleventy)](https://www.11ty.dev/)
- **Templating**: Nunjucks
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Interactivity**: [Alpine.js](https://alpinejs.dev/)
- **Syntax Highlighting**: [Prism.js](https://prismjs.com/)
- **Content**: Markdown-based blog posts and experience entries

## ✨ Features

- **LinkedIn-style Experience Timeline**: Detailed project sub-cards with achievements.
- **Technical Blog**: Markdown-driven blog with syntax highlighting for multiple languages.
- **Premium Design**: Glassmorphism, modern typography, and smooth transitions.
- **Mobile Responsive**: Fully optimized for all screen sizes.

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alifgiant/alifgiant.github.io.git
   cd alifgiant.github.io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🏃 Usage

### Development Mode
Runs a local development server with live reload at `http://localhost:8080`.
```bash
npm run dev
```

### Build for Production
Generates the static site in the `_site/` directory.
```bash
npm run build
```

## 📂 Project Structure

- `contents/`: Markdown files for blog posts and experience history.
- `src/`: Nunjucks templates, partials, and layouts.
- `assets/`: Static assets like images and fonts.
- `.eleventy.js`: Configuration for the static site generator.

## 🧭 Tools List Maintenance

When adding or editing tools in `src/_data/site.json` (`pages.tools.list`), keep these rules:

1. Favorite tools must stay at the top of the list.
2. Non-favorite tools must be sorted alphabetically by `title` (A to Z).
3. For multi-tag tools, keep the primary visual category in `tag` (e.g. `Utilities` or `Converter`) and put extra tags (like `Favorite`) in `tags`.
4. Keep filter categories in sync with any new tag under `pages.tools.categories`.

---
© 2025 Muhammad Alif Akbar.