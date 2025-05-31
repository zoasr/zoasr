import { compileStyles } from "./src/style.ts";

const sassFile = "./src/style.scss";
const htmlFile = "./src/input.html";

const outFileName = "src/out.svg";
const watcher = Deno.watchFs("./src/", {
	recursive: false,
});

//  Check if files exist
try {
	await Deno.stat(sassFile);
	await Deno.stat(htmlFile);
} catch (error) {
	if (error instanceof Deno.errors.NotFound) console.error(error.stack);
	watcher.close();
	Deno.exit(0);
}

const compileFile = async () => {
	if (sassFile && htmlFile) {
		const sassFileText = await Deno.readTextFile(sassFile);
		const htmlText = await Deno.readTextFile(htmlFile);
		const indentedCss = compileStyles(sassFileText);
		const svgText = `<svg xmlns="http://www.w3.org/2000/svg" fill="none">
	<foreignObject width="100%" height="100%">
		<div xmlns="http://www.w3.org/1999/xhtml">
			<style>
			${indentedCss}
			</style>
			${htmlText}
		</div>
	</foreignObject>
</svg>`;
		Deno.writeTextFile(outFileName, svgText);
	}
};
compileFile();

for await (const event of watcher) {
	if (
		event.kind == "modify" &&
		(event.paths.includes(`${Deno.cwd()}\\${sassFile}`) ||
			event.paths.includes(`${Deno.cwd()}\\${htmlFile}`))
	) {
		console.log(
			`%c[File change]: %c${event.paths[0].split("\\").pop()}%c changed`,
			`color: yellow; fontweight: bold`,
			`color: green;text-decoration: underline; fontweight: bold`,
			`color: #222; fontweight: bold`
		);
		compileFile();
	}
}
