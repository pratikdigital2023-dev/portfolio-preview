# Pratik Sengupta · Portfolio · Deploy

Static site. No build step. Upload the contents of this folder to any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages, or plain S3/nginx).

## Structure

```
dist/
├── index.html                  Main portfolio (landing)
├── case-trigon-7.html          Case study · Trigon 7 at Dewans
├── case-house-cafe.html        Case study · House Café
├── case-innstar.html           Case study · InnStar Brand System
├── work-in-preparation.html    Holding page (linked from anything pending)
└── assets/
    ├── case-study.css          Shared stylesheet for all case study pages
    └── img/                    Portrait, montage, signature imagery
```

## Cloudflare Pages

1. Connect the repository.
2. Build command: *(none)*
3. Build output directory: `project/dist` (or wherever this folder lives).

That is all. No framework, no node_modules, no environment variables.

## Local preview

```
cd dist
python3 -m http.server 8000
# open http://localhost:8000
```

Or any static file server.

## When real imagery arrives

Case study placeholders use a diagonal-hatch CSS pattern with the caption
`Image forthcoming · June 2026`. To wire in real images, replace the
`<div class="ph ph-...">` blocks in each case study with plain `<img>`
tags pointing at new files dropped into `assets/img/`. Aspect ratios to
preserve: 16:9 for hero, 4:3 for figures, 1:1 for pairs, 2:3 for portraits.

Main portfolio imagery (hero portrait, signature bands, montage strip)
already resolves to `assets/img/*.jpg` — drop new files with the same
names to swap.

## Colophon

Design: Claude Design · Implementation: claude-sonnet-4-6 · Bison Monk · MMXXVI
