import sass from "https://deno.land/x/denosass@1.0.6/mod.ts";

const indent = (css: string) => {
	return css.replaceAll(/^(.+)$/gm, "				$1");
};
const varsLight = indent(`
:root {
	--color-1: #9fa3ec;
	--color-2: #9fa3ec;
	--color-3: #9fa3ec;
	--color-text: #000222;
}
`);

const varsDark = indent(`
:root {
	--color-1: #000222;
	--color-2: #000222;
	--color-3: #000222;
	--color-text: #9fa3ec;
}
`);

export const compileStyles = (sassFile: string) => {
	const compiler = sass(sassFile, {
		style: "compressed",
	});
	const css = compiler.to_string();

	const indentedCss = indent(css as string);

	return { indentedCss, varsLight, varsDark };
};
