# Readme.md

## Getting started

```sh
$ deno task dev
```

This will build all files inside the `src` folder into the `out` folder

## Previewing Changes

To preview the SVG components before committing to your README:

1. Start the build watcher (if not already running):
```sh
$ deno task dev
```

2. In a separate terminal, start the preview server:
```sh
$ deno task preview
```

3. Open your browser to: `http://localhost:8080/preview.html`

This will show you all SVG components in both light and dark modes with the new orange color scheme.

4. Make changes to HTML/SCSS files in the `src/` folder
5. The watcher will automatically regenerate SVGs
6. Refresh your browser to see updated preview

## File structure

To compile every svg file inside the `src` folder there must be an `html` file and a `scss` file inside the `src` folder and a corresponding object inside `main.ts`:

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

## Color Scheme

The README now uses an orange color scheme similar to your portfolio website:
- **Light Mode**: Cream/orange-tinted background with dark text
- **Dark Mode**: Dark blue-gray background with peach text
- **Accent**: Vibrant orange (#ff6b35) throughout

See `README-PREVIEW.md` for more detailed preview instructions.
