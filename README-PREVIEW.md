# README Preview Instructions

This document explains how to preview the SVG components before committing them to your README.

## Prerequisites

Make sure you have Deno installed and available at `/home/engine/.deno/bin/deno`

## Previewing Changes

### 1. Start the Build Process

Run the Deno build watcher in one terminal:

```bash
cd /home/engine/project
/home/engine/.deno/bin/deno task dev
```

This will watch for changes in the `src/` and `preflight/` directories and automatically regenerate the SVG files in the `out/` directory.

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
- How they look with the new orange color scheme
- A theme toggle button to see both light and dark mode versions

### 4. Making Changes

1. Edit any HTML files in `/home/engine/project/src/`
2. Edit any SCSS files in `/home/engine/project/src/` or `/home/engine/project/preflight/`
3. The watcher will automatically detect changes and regenerate SVGs
4. Refresh your browser to see the updated preview

## Color Scheme

The README now uses an orange color scheme similar to your portfolio:

### Light Mode
- Background: `#fff5ed` (cream/orange-tinted)
- Text: `#1a1a2e` (dark blue-gray)
- Accent: `#ff6b35` (vibrant orange)
- Accent Light: `#ff8c5a` (lighter orange)
- Accent Dark: `#e55a2b` (darker orange)

### Dark Mode
- Background: `#1a1a2e` (dark blue-gray)
- Text: `#ffd6b3` (peach/light orange)
- Accent colors remain the same for consistency

## Workflow

1. Make changes to source files (HTML/SCSS)
2. Wait for SVGs to regenerate (watch for "File change" messages)
3. Refresh preview page to see results
4. Repeat until satisfied with design
5. Commit changes when ready

## Troubleshooting

If SVGs don't update:
- Check that the Deno watcher is still running
- Ensure the file was saved properly
- Try manually touching a file: `touch src/header.scss`
- Check the terminal for any error messages

If preview page doesn't load:
- Ensure the preview server is running
- Check that port 8080 is not in use by another process
- Verify you're accessing `http://localhost:8080/preview.html`
