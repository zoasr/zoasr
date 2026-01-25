# README Preview Instructions

This document explains how to preview SVG components before committing them to your README.

## Prerequisites

Make sure you have Deno installed and available at `/home/engine/.deno/bin/deno`

## Previewing Changes

### 1. Start the Build Process

Run Deno build watcher in one terminal:

```bash
cd /home/engine/project
/home/engine/.deno/bin/deno task dev
```

This will watch for changes in `src/` and `preflight/` directories and automatically regenerate SVG files in `out/` directory.

### 2. Start the Preview Server

In another terminal, start the preview server:

```bash
cd /home/engine/project
./start-preview.sh
```

Or using Python directly:

```bash
cd /home/engine/project
python3 -m http.server 8080
```

### 3. Open in Browser

Navigate to: `http://localhost:8080/preview.html`

This will show you:
- All SVG components (light and dark variants)
- How they look with 8-bit/16-bit pixel art brutalist aesthetic
- A theme toggle button to see both light and dark mode versions

### 4. Making Changes

1. Edit any HTML files in `/home/engine/project/src/`
2. Edit any SCSS files in `/home/engine/project/src/` or `/home/engine/project/preflight/`
3. The watcher will automatically detect changes and regenerate SVGs
4. Refresh your browser to see the updated preview

## Design System

The README now uses an 8-bit/16-bit pixel art brutalist aesthetic:

### Visual Style
- **Pixel Art**: Visible pixels with pixelated rendering
- **Brutalist Design**: Raw, exposed structure with harsh borders
- **High Contrast**: Black and white with neon green (#00ff00) and hot pink (#ff00ff) accents
- **Typography**: Uppercase, monospace-style fonts with wide letter-spacing
- **Borders**: 2-4px solid strokes using high-contrast colors
- **No Interactivity**: Static presentation only (no hover effects in SVGs)

### Color Palette

#### Light Mode
- Background: `#ffffff` (white)
- Surface: `#e8e8e8` (light gray)
- Text: `#000000` (black)
- Accent: `#00ff00` (neon green)
- Secondary: `#ff00ff` (hot pink)
- Border: `#000000` (black)

#### Dark Mode
- Background: `#000000` (black)
- Surface: `#0a0a0a` (dark gray)
- Text: `#ffffff` (white)
- Accent: `#00ff00` (neon green)
- Secondary: `#ff00ff` (hot pink)
- Border: `#ffffff` (white)

### Animated Elements
- **Pixel Grid**: Subtle grid pattern with slow movement
- **Floating Pixels**: Animated geometric squares in background
- **Step Animations**: Steps-based timing for pixel-like motion
- **No Hover Effects**: All animations are automatic and non-interactive

## Workflow

1. Make changes to source files (HTML/SCSS)
2. Wait for SVGs to regenerate (watch for "File change" messages)
3. Refresh the preview page to see results
4. Toggle theme to see both light and dark mode versions
5. Repeat until satisfied with the design
6. Commit changes when ready

## Troubleshooting

If SVGs don't update:
- Check that Deno watcher is still running
- Ensure that the file was saved properly
- Try manually touching a file: `touch src/header.scss`
- Check the terminal for any error messages

If the preview page doesn't load:
- Ensure that the preview server is running
- Check that port 8080 is not in use by another process
- Verify that you're accessing `http://localhost:8080/preview.html`
