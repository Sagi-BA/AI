# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for an AI lecture/workshop ("להבין את הבינה תכל'ס - AI בגובה העיניים") by Sagi Bar-On. The site is a single-page Hebrew (RTL) landing page promoting AI educational lectures for organizations.

## Development Commands

```bash
# Run local development server
npx http-server -p 8080
```

## Project Structure

- `To_understand_the_AI.html` - Main landing page (Hebrew, RTL layout)
- `sagi.webp` - Speaker profile image
- `README.md` - Publishing instructions and links

## Publishing Workflow

1. Make changes to the HTML file
2. Push to GitHub
3. Preview using: https://htmlpreview.github.io/?https://github.com/Sagi-BA/AI/blob/main/To_understand_the_AI.html

## Architecture Notes

- Self-contained HTML with embedded CSS (no external stylesheets or build process)
- Uses Google Fonts (Alef) for Hebrew typography
- CSS variables defined in `:root` for theming
- Responsive design with mobile breakpoints at 768px and 380px
- WhatsApp contact links for call-to-action buttons
