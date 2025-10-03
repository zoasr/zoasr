import { compileStyles } from "./src/style.ts";

type fileProps = {
	name: string;
	html: string;
	out: string;
	sass: string;
	height: `${number}px`;
	width?: `${number}px` | `${number}%` | "100%";
};

const files: fileProps[] = [
	{
		name: "header",
		html: "./src/header.html",
		out: "./out/header.svg",
		sass: "./src/header.scss",
		height: "700px",
		width: "100%",
	},
	{
		name: "projects",
		html: "./src/projects.html",
		out: "./out/projects.svg",
		sass: "./src/projects.scss",
		height: "80px",
		width: "100%",
	},
	{
		name: "reach-me",
		html: "./src/reach-me.html",
		out: "./out/reach-me.svg",
		sass: "./src/reach-me.scss",
		height: "80px",
		width: "100%",
	},
	{
		name: "@lastfm-viewer",
		html: "./src/@lastfm-viewer.html",
		out: "./out/@lastfm-viewer.svg",
		sass: "./src/@lastfm-viewer.scss",
		height: "100px",
		width: "200px",
	},
	{
		name: "website",
		html: "./src/website.html",
		out: "./out/website.svg",
		sass: "./src/website.scss",
		height: "50px",
		width: "200px",
	},
	{
		name: "linkedin",
		html: "./src/linkedin.html",
		out: "./out/linkedin.svg",
		sass: "./src/linkedin.scss",
		height: "50px",
		width: "200px",
	},
	{
		name: "github",
		html: "./src/github.html",
		out: "./out/github.svg",
		sass: "./src/github.scss",
		height: "50px",
		width: "200px",
	},
	{
		name: "machlist",
		html: "./src/machlist.html",
		out: "./out/machlist.svg",
		sass: "./src/machlist.scss",
		height: "100px",
		width: "200px",
	},
	{
		name: "supa-shop",
		html: "./src/supa-shop.html",
		out: "./out/supa-shop.svg",
		sass: "./src/supa-shop.scss",
		height: "100px",
		width: "200px",
	},
	{
		name: "clinic-run",
		html: "./src/clinic-run.html",
		out: "./out/clinic-run.svg",
		sass: "./src/clinic-run.scss",
		height: "100px",
		width: "200px",
	},
];
const watcher = Deno.watchFs(["./src/", "./preflight/"], {
	recursive: false,
});

const returnSvg = (
	_strings: TemplateStringsArray,
	...values: [`${number}px` | `${number}%` | "100%" | undefined, ...string[]]
) => {
	return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${values[0]}" height="${values[1]}">
	<foreignObject width="100%" height="100%">
		<div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%">
			<style>
			${values[2]}
			${values[3]}
			</style>
			${values[4]}
		</div>
	</foreignObject>
</svg>`;
};

const compileFile = async (fileProps: fileProps) => {
	if (fileProps.sass && fileProps.html) {
		const htmlText = await Deno.readTextFile(fileProps.html);
		const { indentedCss, varsLight, varsDark } = compileStyles(
			fileProps.sass
		);
		const svgDark = returnSvg`
			${fileProps.width}
			${fileProps.height}
			${varsDark}
			${indentedCss}
			${htmlText}
		`;
		const svgLight = returnSvg`
			${fileProps.width}
			${fileProps.height}
			${varsLight}
			${indentedCss}
			${htmlText}
		`;
		Deno.writeTextFile(fileProps.out.replace(".svg", "-dark.svg"), svgDark);
		Deno.writeTextFile(
			fileProps.out.replace(".svg", "-light.svg"),
			svgLight
		);
	}
};

for await (const event of watcher) {
	if (event.kind == "modify") {
		const pathStrings = event.paths[0].split("\\")
		const [folder, fileName] = [pathStrings[pathStrings.length - 2], pathStrings[pathStrings.length - 1]]

		console.log(
			`%c[File change]: %c${fileName}%c changed`,
			`color: yellow; fontweight: bold`,
			`color: green;text-decoration: underline; fontweight: bold`,
			`color: #222; fontweight: bold`
		);
		if (folder == "src") {
			const fileObj = files.find(
				(file) => file.name === fileName.split(".")[0]
			)!;
			compileFile(fileObj);
		} else {
			for (const fileObj of files) {
				compileFile(fileObj);
			}
		}
	}
}
