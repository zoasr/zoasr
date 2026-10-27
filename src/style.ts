import sass from "https://deno.land/x/denosass@1.0.6/mod.ts";

const indent = (css: string) => {
	return css.replaceAll(/^(.+)$/gm, "\t\t\t\t$1");
};

/*
Hallmark · v2.0.0 · theme: custom · idea: "The profile read as a file: a quiet header, one sentence, and a year of commits as the only picture." · vibe: quiet ember file view · paper: GitHub ground, transparent · display: system sans · accent: ember · genre: technical · posture: restrained · job: hire, links in the hero · shape: file view, top bar, right-set intro, full-bleed contribution grid, type-only work index · signature: the real 2,846-contribution year drawn as ember cells, plus the 502 npm figure · imagery: none, the contribution data is the picture · motion: one staggered settle, a 53-column dot cascade, a six-beat caret, one breathing index, by request
Hallmark pre-emit critique: P5 H5 E4 S4 R4 V4 · weakest: E, ember on near-black is the reference's own posture; the real contribution count and the two verified npm figures keep it a record rather than a mood
Hallmark · waive 1 · 27 names the three loops; Alive is the user's chosen motion, reduced-motion removes every one
Hallmark · waive 2 · 46a is cleared: 2,846 is the viewer's last-12-month total and 502 is the sum of the three @lastfm-viewer packages, both fetched at build, not invented
*/

const varsLight = indent(`
/* Hallmark · v2.0.0 · Ember file view · light: warm ink on GitHub paper, burnt-orange signal · the contribution grid carries the colour */
:root {
	--color-ink: oklch(23.5% 0.015 48.1);
	--color-ink-2: oklch(36.9% 0.023 48.1);
	--color-muted: oklch(48.4% 0.025 51.2);
	--color-accent: oklch(51.8% 0.163 36.9);
	--color-focus: oklch(51.8% 0.163 36.9);
	--color-dot-0: oklch(94% 0.009 62.6);
	--color-dot-1: oklch(88.8% 0.048 51.6);
	--color-dot-2: oklch(77.1% 0.103 52.4);
	--color-dot-3: oklch(63.5% 0.154 45.9);
	--color-dot-4: oklch(51.8% 0.163 36.9);
	--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
	--text-meta: 12px;
	--text-body: 14px;
	--text-name: 18px;
	--text-intro: 22px;
	--space-2xs: 4px;
	--space-xs: 8px;
	--space-sm: 12px;
	--space-md: 16px;
	--space-lg: 28px;
	--space-xl: 56px;
	--radius-dot: 2px;
	--dur-settle: 700ms;
	--dur-column: 900ms;
	--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
	--stagger-settle: 90ms;
	--stagger-column: 18ms;
}
`);

const varsDark = indent(`
/* Hallmark · v2.0.0 · Ember file view · dark: warm oat ink on GitHub charcoal, ember signal · the contribution grid carries the colour */
:root {
	--color-ink: oklch(94.3% 0.014 53.3);
	--color-ink-2: oklch(84.3% 0.022 51.5);
	--color-muted: oklch(64.7% 0.022 53.1);
	--color-accent: oklch(75.3% 0.155 41.6);
	--color-focus: oklch(75.3% 0.155 41.6);
	--color-dot-0: oklch(20.6% 0.011 48.1);
	--color-dot-1: oklch(28.8% 0.046 42.8);
	--color-dot-2: oklch(38.8% 0.096 39.8);
	--color-dot-3: oklch(56.5% 0.164 39.2);
	--color-dot-4: oklch(72.7% 0.176 41.2);
	--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
	--text-meta: 12px;
	--text-body: 14px;
	--text-name: 18px;
	--text-intro: 22px;
	--space-2xs: 4px;
	--space-xs: 8px;
	--space-sm: 12px;
	--space-md: 16px;
	--space-lg: 28px;
	--space-xl: 56px;
	--radius-dot: 2px;
	--dur-settle: 700ms;
	--dur-column: 900ms;
	--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
	--stagger-settle: 90ms;
	--stagger-column: 18ms;
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
