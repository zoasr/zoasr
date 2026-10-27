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
		name: "topbar",
		html: "./src/topbar.html",
		out: "./out/topbar.svg",
		sass: "./src/topbar.scss",
		height: "24px",
		width: "100%",
	},
	{
		name: "website",
		html: "./src/website.html",
		out: "./out/website.svg",
		sass: "./src/website.scss",
		height: "26px",
		width: "100%",
	},
	{
		name: "github",
		html: "./src/github.html",
		out: "./out/github.svg",
		sass: "./src/github.scss",
		height: "26px",
		width: "100%",
	},
	{
		name: "linkedin",
		html: "./src/linkedin.html",
		out: "./out/linkedin.svg",
		sass: "./src/linkedin.scss",
		height: "26px",
		width: "100%",
	},
	{
		name: "header",
		html: "./src/header.html",
		out: "./out/header.svg",
		sass: "./src/header.scss",
		height: "520px",
		width: "100%",
	},
	{
		name: "work",
		html: "./src/work.html",
		out: "./out/work.svg",
		sass: "./src/section.scss",
		height: "40px",
		width: "100%",
	},
	{
		name: "@lastfm-viewer",
		html: "./src/@lastfm-viewer.html",
		out: "./out/@lastfm-viewer.svg",
		sass: "./src/rows.scss",
		height: "76px",
		width: "100%",
	},
	{
		name: "oversec-stego",
		html: "./src/oversec-stego.html",
		out: "./out/oversec-stego.svg",
		sass: "./src/rows.scss",
		height: "76px",
		width: "100%",
	},
	{
		name: "clinic-run",
		html: "./src/clinic-run.html",
		out: "./out/clinic-run.svg",
		sass: "./src/rows.scss",
		height: "76px",
		width: "100%",
	},
	{
		name: "supa-shop",
		html: "./src/supa-shop.html",
		out: "./out/supa-shop.svg",
		sass: "./src/rows.scss",
		height: "76px",
		width: "100%",
	},
	{
		name: "fav-tv",
		html: "./src/fav-tv.html",
		out: "./out/fav-tv.svg",
		sass: "./src/rows.scss",
		height: "76px",
		width: "100%",
	},
	{
		name: "machlist",
		html: "./src/machlist.html",
		out: "./out/machlist.svg",
		sass: "./src/rows.scss",
		height: "76px",
		width: "100%",
	},
	{
		name: "also",
		html: "./src/also.html",
		out: "./out/also.svg",
		sass: "./src/section.scss",
		height: "40px",
		width: "100%",
	},
	{
		name: "lastfm-ts-api",
		html: "./src/lastfm-ts-api.html",
		out: "./out/lastfm-ts-api.svg",
		sass: "./src/rows.scss",
		height: "60px",
		width: "100%",
	},
	{
		name: "task-manager-expo",
		html: "./src/task-manager-expo.html",
		out: "./out/task-manager-expo.svg",
		sass: "./src/rows.scss",
		height: "60px",
		width: "100%",
	},
	{
		name: "p5-sketches",
		html: "./src/p5-sketches.html",
		out: "./out/p5-sketches.svg",
		sass: "./src/rows.scss",
		height: "60px",
		width: "100%",
	},
	{
		name: "processing-sketches",
		html: "./src/processing-sketches.html",
		out: "./out/processing-sketches.svg",
		sass: "./src/rows.scss",
		height: "60px",
		width: "100%",
	},
	{
		name: "libmatrix",
		html: "./src/libmatrix.html",
		out: "./out/libmatrix.svg",
		sass: "./src/rows.scss",
		height: "60px",
		width: "100%",
	},
	{
		name: "cryptofix-landing",
		html: "./src/cryptofix-landing.html",
		out: "./out/cryptofix-landing.svg",
		sass: "./src/rows.scss",
		height: "60px",
		width: "100%",
	},
];

const level = (count: number) => {
	if (count <= 0) return 0;
	if (count <= 2) return 1;
	if (count <= 5) return 2;
	if (count <= 10) return 3;
	return 4;
};

type ContributionDay = {
	count: number;
	month: number;
};

const loadContributions = async () => {
	const raw = JSON.parse(await Deno.readTextFile("./src/contributions.json"));
	const total = Number(raw.total);
	if (!Number.isFinite(total) || total <= 0) {
		throw new Error("contributions.json: total must be a positive number");
	}
	if (!Array.isArray(raw.weeks) || raw.weeks.length !== 53) {
		throw new Error("contributions.json: expected 53 weeks");
	}
	const start = Date.parse(`${raw.start}T00:00:00Z`);
	const end = Date.parse(`${raw.end}T00:00:00Z`);
	if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
		throw new Error("contributions.json: invalid start/end dates");
	}
	const span = Math.round((end - start) / 86_400_000) + 1;
	const flat = raw.weeks.flat().map((count: number) => Number(count) || 0);
	if (flat.length < span) {
		throw new Error(
			`contributions.json: ${flat.length} cells cannot cover ${span} days`,
		);
	}
	const days: ContributionDay[] = Array.from({ length: span }, (_, index) => {
		const date = new Date(start + index * 86_400_000);
		return { count: flat[index], month: date.getUTCMonth() };
	});
	const sum = days.reduce((acc, day) => acc + day.count, 0);
	if (sum !== total) {
		throw new Error(
			`contributions.json: day sum ${sum} does not match total ${total}`,
		);
	}
	if (flat.slice(span).some((count) => count !== 0)) {
		throw new Error("contributions.json: cells after the end date carry counts");
	}
	return { days, total, start: raw.start, end: raw.end };
};

/* a year coiled three times: one tick per day, a small gap where the month
   turns over, tick length and ember weight set by that day's count */
const spiralMarkup = (days: ContributionDay[]) => {
	const size = 440;
	const center = size / 2;
	const turns = 3;
	const monthGap = 1.6;
	const inner = 96;
	const outer = 196;
	let units = 0;
	const placed = days.map((day, index) => {
		if (index > 0 && day.month !== days[index - 1].month) units += monthGap;
		const at = units;
		units += 1;
		return { ...day, at };
	});
	const coil: string[] = [];
	const ticks = placed
		.map((day, index) => {
			const t = day.at / units;
			const angle = -Math.PI / 2 + t * turns * Math.PI * 2;
			const radius = inner + (outer - inner) * t;
			const step = level(day.count);
			const length = 2 + step * 3;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);
			const x1 = (center + cos * (radius - 1)).toFixed(1);
			const y1 = (center + sin * (radius - 1)).toFixed(1);
			const x2 = (center + cos * (radius + length)).toFixed(1);
			const y2 = (center + sin * (radius + length)).toFixed(1);
			const delay = 520 + Math.round(index * 1.55);
			coil.push(`${index === 0 ? "M" : "L"}${x1} ${y1}`);
			return `<line class="day day--${step}" style="--d:${delay}ms" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
		})
		.join("");
	return `<svg class="spiral" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" aria-hidden="true"><path class="coil" d="${coil.join(" ")}"/>${ticks}</svg>`;
};

const toBase64 = (bytes: Uint8Array) => {
	let binary = "";
	for (let index = 0; index < bytes.length; index += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
	}
	return btoa(binary);
};

const iconCache = new Map<string, string>();

const iconMarkup = async (name: string) => {
	if (!iconCache.has(name)) {
		const candidates = [
			[`./src/icons/${name}.svg`, "image/svg+xml"],
			[`./src/icons/${name}.png`, "image/png"],
		] as const;
		let uri: string | undefined;
		for (const [path, mime] of candidates) {
			try {
				const bytes = await Deno.readFile(path);
				uri = `data:${mime};base64,${toBase64(bytes)}`;
				break;
			} catch {
				// try the next format
			}
		}
		if (!uri) throw new Error(`icons: missing ${name}.svg or ${name}.png`);
		iconCache.set(
			name,
			`<img class="mark" src="${uri}" width="18" height="18" alt="" />`,
		);
	}
	return iconCache.get(name)!;
};

const chrome = new Set([
	"topbar",
	"website",
	"github",
	"linkedin",
	"header",
	"work",
	"also",
]);

const prepareHtml = async (
	name: string,
	html: string,
	countLabel: string,
	rangeLabel: string,
	spiral: string,
) => {
	if (name === "header") {
		for (const slot of ["<!--SPIRAL-->", "<!--COUNT-->", "<!--RANGE-->"]) {
			if (!html.includes(slot)) {
				throw new Error(`header.html: missing ${slot} slot`);
			}
		}
		return html
			.replace("<!--SPIRAL-->", spiral)
			.replace("<!--COUNT-->", countLabel)
			.replace("<!--RANGE-->", rangeLabel);
	}
	if (!chrome.has(name)) {
		if (!html.includes("<!--ICON-->")) {
			throw new Error(`${name}.html: missing <!--ICON--> slot`);
		}
		return html.replace("<!--ICON-->", await iconMarkup(name));
	}
	return html;
};

const styleCache = new Map<string, ReturnType<typeof compileStyles>>();

const stylesFor = (sassFile: string) => {
	if (!styleCache.has(sassFile)) {
		styleCache.set(sassFile, compileStyles(sassFile));
	}
	return styleCache.get(sassFile)!;
};

const returnSvg = (
	width: string,
	height: string,
	vars: string,
	css: string,
	html: string,
) => {
	return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${width}" height="${height}">
	<foreignObject width="100%" height="100%">
		<div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%">
			<style>
			${vars}
			${css}
			</style>
			${html}
		</div>
	</foreignObject>
</svg>`;
};

const build = async () => {
	const { days, total, start, end } = await loadContributions();
	const countLabel = new Intl.NumberFormat("en-US").format(total);
	const dateFormat = new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});
	const rangeLabel = `${dateFormat.format(new Date(start))} → ${
		dateFormat.format(new Date(end))
	}`;
	const spiral = spiralMarkup(days);
	const ticks = spiral.match(/<line class="day/g)?.length ?? 0;
	if (ticks !== days.length) {
		throw new Error(`spiral: expected ${days.length} days, rendered ${ticks}`);
	}

	for (const file of files) {
		const rawHtml = await Deno.readTextFile(file.html);
		const html = await prepareHtml(
			file.name,
			rawHtml,
			countLabel,
			rangeLabel,
			spiral,
		);
		const { indentedCss, varsLight, varsDark } = stylesFor(file.sass);
		const width = file.width ?? "100%";
		const dark = returnSvg(width, file.height, varsDark, indentedCss, html);
		const light = returnSvg(width, file.height, varsLight, indentedCss, html);
		await Deno.writeTextFile(
			file.out.replace(".svg", "-dark.svg"),
			dark,
		);
		await Deno.writeTextFile(
			file.out.replace(".svg", "-light.svg"),
			light,
		);
	}

	console.log(
		`built ${files.length} banners · ${countLabel} contributions · ${days.length} ticks`,
	);
};

if (Deno.args.includes("--build")) {
	await build();
	Deno.exit(0);
}

if (Deno.args.includes("--check")) {
	const { total, days } = await loadContributions();
	const spiral = spiralMarkup(days);
	const rendered = spiral.match(/<line class="day/g)?.length ?? 0;
	if (rendered !== days.length) throw new Error("spiral tick count mismatch");
	console.log(
		`contributions ${total} · ${days.length} days · ${rendered} ticks · ok`,
	);
	Deno.exit(0);
}

let timer: number | undefined;
const watcher = Deno.watchFs(["./src", "./preflight"], { recursive: false });

for await (const event of watcher) {
	if (event.kind === "access") continue;
	clearTimeout(timer);
	timer = setTimeout(() => {
		build().catch((error) => console.error(error.message));
	}, 120);
}

