import sass from "https://deno.land/x/denosass@1.0.6/mod.ts";

const indent = (css: string) => {
    return css.replaceAll(/^(.+)$/gm, "                $1");
};
const varsLight = indent(`
:root {
    --color-1: #ffffff;
    --color-2: #e8e8e8;
    --color-3: #d4d4d4;
    --color-text: #000000;
    --color-accent: #00ff00;
    --color-accent-light: #00ff88;
    --color-accent-dark: #00cc00;
    --color-border: #000000;
    --color-secondary: #ff00ff;
}
`);

const varsDark = indent(`
:root {
    --color-1: #000000;
    --color-2: #0a0a0a;
    --color-3: #141414;
    --color-text: #ffffff;
    --color-accent: #00ff00;
    --color-accent-light: #00ff88;
    --color-accent-dark: #00cc00;
    --color-border: #ffffff;
    --color-secondary: #ff00ff;
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
