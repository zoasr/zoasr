import sass from "https://deno.land/x/denosass@1.0.6/mod.ts";

export const compileStyles = (sassFile: string) => {
	const compiler = sass(sassFile, {
		style: "compressed",
	});
	const css = compiler.to_string();

	const indentedCss =
		typeof css == "string" ? css.replaceAll(/^(.+)$/gm, "    $1") : css;
	return indentedCss;
};
