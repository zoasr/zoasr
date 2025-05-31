# Readme.md

## Getting started

```sh
$ deno task dev
```

This will build all files inside the `src` folder into the `out` folder

# File structure

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
