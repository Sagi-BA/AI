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

## Skills (project-local)

- **`/new-landing-page`** — generates a new Hebrew RTL landing page following the project's design system (GA, OG meta, WhatsApp float, contact section, reveal-on-scroll, prefers-reduced-motion). Auto-adds the new page to the portfolio gallery in `index.html` (unless the page contains pricing). See [.claude/skills/new-landing-page/SKILL.md](.claude/skills/new-landing-page/SKILL.md).
- **`/new-reichman-summary`** — generates a new Reichman University workshop summary page based on the canonical template. The Reichman summaries are near-clones — only the audience/ministry name and Google Doc URL change. Auto-adds to the gallery under `workshops`. See [.claude/skills/new-reichman-summary/SKILL.md](.claude/skills/new-reichman-summary/SKILL.md).
- **`/optimize-images`** — converts PNG/JPG images to WebP, resizes oversized images (max 1600px content, 1200px OG), and updates HTML references to point to the new files. Originals are kept until manually deleted. Requires Pillow (`pip install Pillow`). See [.claude/skills/optimize-images/SKILL.md](.claude/skills/optimize-images/SKILL.md).

## Reference templates (manual-copy starting points)

When a task doesn't have a dedicated skill, copy from these canonical references:

- **New landing page** — use `/new-landing-page` skill instead of manual copy.
- **Meeting / lecture summary (non-Reichman)** — copy [meeting-summary/ariel-university.html](meeting-summary/ariel-university.html) as the canonical layout (institution header, hero with date+audience, value cards, topic cards, CTA buttons). For Reichman summaries use the `/new-reichman-summary` skill instead.
- **Price quote / proposal** — copy [forms/Price-quotes/Hashomer-Hadash-v2.html](forms/Price-quotes/Hashomer-Hadash-v2.html). A dedicated `/new-price-quote` skill is planned but on hold pending volume assessment.
- **Game / Kahoot-style quiz** — copy [games/data-driven-management-kahot-game.html](games/data-driven-management-kahot-game.html).
