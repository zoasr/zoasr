# Readme.md

## Getting started

```sh
$ deno task dev
```

This will build all files inside the `src` folder into the `out` folder

## Previewing Changes

To preview SVG components before committing to your README:

1. Start the build watcher (if not already running):
```sh
$ deno task dev
```

2. In a separate terminal, start the preview server:
```sh
$ deno task preview
```

3. Open your browser to: `http://localhost:8080/preview.html`

This will show you all SVG components in both light and dark modes with the 8-bit/16-bit pixel art brutalist aesthetic.

4. Make changes to HTML/SCSS files in the `src/` folder
5. The watcher will automatically regenerate SVGs
6. Refresh your browser to see the updated preview

## File structure

To compile every SVG file inside the `src` folder there must be an `html` file and a `scss` file inside the `src` folder and a corresponding object inside `main.ts`:

```ts
const files: fileProps[] = [
    {
        name: "example",
        html: "./src/example.html",
        out: "./out/example.svg",
        sass: "./src/example.scss",
        height: "500px",
        width: "100%",
    },
    // ...
];
```

## Design System

The README now uses an 8-bit/16-bit pixel art brutalist aesthetic:
- **Visual Style**: Pixelated rendering with harsh, high-contrast borders
- **Colors**: Black/white with neon green (#00ff00) and hot pink (#ff00ff) accents
- **Typography**: Uppercase, monospace-style fonts with wide letter-spacing
- **Static Only**: No interactive elements (hover effects, click states)
- **Animations**: Subtle pixel art movements (grid, floating squares, step-based reveals)

See `README-PREVIEW.md` for more detailed preview instructions and the full color palette.
