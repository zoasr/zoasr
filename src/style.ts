import sass from "https://deno.land/x/denosass@1.0.6/mod.ts";

const indent = (css: string) => {
    return css.replaceAll(/^(.+)$/gm, "                $1");
};
const varsLight = indent(`
:root {
    --color-1: #fff5ed;
    --color-2: #ffe8d6;
    --color-3: #ffd6b3;
    --color-text: #1a1a2e;
    --color-accent: #ff6b35;
    --color-accent-light: #ff8c5a;
    --color-accent-dark: #e55a2b;
}
`);

const varsDark = indent(`
:root {
    --color-1: #1a1a2e;
    --color-2: #16213e;
    --color-3: #0f3460;
    --color-text: #ffd6b3;
    --color-accent: #ff6b35;
    --color-accent-light: #ff8c5a;
    --color-accent-dark: #e55a2b;
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
