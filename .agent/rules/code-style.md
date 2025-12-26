---
trigger: always_on
---

# Gemini Agent Rules - Static Portfolio Site

## Project Overview

This is a personal portfolio website built as a static site generator with the following stack:
- **Content**:  Markdown files in `/contents` folder
- **Styling**: Custom CSS or tailwind CSS if complex
- **Reactivity**: Alpine. js
- **Architecture**: Simple static site generation
- **Principles**: DRY (Don't Repeat Yourself), clear comments, easy-to-understand code

## Code Styling Guidelines

### General Principles

1. **DRY (Don't Repeat Yourself)**
   - Extract reusable components and functions
   - Use template partials for repeated HTML sections
   - Create utility functions for common operations
   - Avoid duplicating markdown parsing logic

2. **Comments & Documentation**
   - Add comments above functions explaining their purpose
   - Document complex logic inline
   - Use JSDoc format for JavaScript functions
   - Add TODO comments for future improvements

3. **Code Readability**
   - Use descriptive variable and function names
   - Keep functions small and focused (single responsibility)
   - Prefer explicit over clever code
   - Use consistent naming conventions

### File Structure

```
project-root/
├── contents/
│   ├── blog/
│   │   └── *.md           # Blog post markdown files
│   ├── experience/
│   │   └── *.md           # Experience entries
│   └── portfolio/
│       └── *. md           # Portfolio project descriptions
├── templates/
│   ├── layouts/
│   │   └── base.html      # Base HTML layout
│   ├── partials/
│   │   ├── header.html    # Reusable header component
│   │   ├── footer.html    # Reusable footer component
│   │   └── nav.html       # Navigation component
│   └── pages/
│       ├── index.html     # Home page template
│       ├── blog. html      # Blog listing template
│       └── post.html      # Single blog post template
├── public/
│   ├── css/
│   │   └── custom.css     # Custom styles (extends tailwind)
│   ├── js/
│   │   └── main.js        # Alpine.js components
│   └── assets/
│       └── images/        # Images and media
├── build/                 # Generated static files (gitignored)
└── generator. js           # Static site generator script
```

### Markdown File Format

Each markdown file should include frontmatter with metadata: 

```markdown
---
title: "Post Title"
date: "2025-12-26"
description:  "Brief description"
tags: ["tag1", "tag2"]
featured: false
---
# Content starts here

Your 
