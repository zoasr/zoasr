import { compileStyles } from "./src/style.ts";

console.clear();

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
		height: "500px",
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
		height: "50px",
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
];
const watcher = Deno.watchFs("./src/", {
	recursive: false,
});

const compileFile = async (fileProps: fileProps) => {
	if (fileProps.sass && fileProps.html) {
		const htmlText = await Deno.readTextFile(fileProps.html);
		const indentedCss = compileStyles(fileProps.sass);
		const svgText = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${fileProps.width}" height="${fileProps.height}">
	<foreignObject width="100%" height="100%">
		<div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%">
			<style>
			${indentedCss}
			</style>
			${htmlText}
		</div>
	</foreignObject>
</svg>`;
		Deno.writeTextFile(fileProps.out, svgText);
	}
};

for await (const event of watcher) {
	if (event.kind == "modify") {
		const [_, __, fileName] = event.paths[0]
			.split("\\")
			.pop()
			?.split("/") as [string, "src", string];
		console.log(
			`%c[File change]: %c${fileName}%c changed`,
			`color: yellow; fontweight: bold`,
			`color: green;text-decoration: underline; fontweight: bold`,
			`color: #222; fontweight: bold`
		);
		const fileObj = files.find(
			(file) => file.name === fileName.split(".")[0]
		)!;
		compileFile(fileObj);
	}
}
