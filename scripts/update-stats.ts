import { build } from "../main.ts";

const GITHUB_USERNAME = "zoasr";

const LASTFM_VIEWER_PACKAGES = [
	"@lastfm-viewer/svelte",
	"@lastfm-viewer/react",
	"@lastfm-viewer/solid",
	"@lastfm-viewer/ui",
	"@lastfm-viewer/tailwind-config",
	"@lastfm-viewer/utils",
];

const LASTFM_TS_API_PACKAGE = "lastfm-ts-api";

const formatNumber = (num: number): string => {
	return new Intl.NumberFormat("en-US").format(num);
};

// 1. Fetch GitHub contributions
async function updateGitHubContributions() {
	const token = Deno.env.get("GH_TOKEN") || Deno.env.get("GITHUB_TOKEN");
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"User-Agent": "zoasr-stats-updater",
	};
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else {
		console.warn("⚠️ No GH_TOKEN or GITHUB_TOKEN found; GraphQL request may fail if unauthenticated.");
	}

	const query = `query ($login: String!) {
		user(login: $login) {
			contributionsCollection {
				contributionCalendar {
					totalContributions
					weeks {
						contributionDays {
							contributionCount
							date
						}
					}
				}
			}
		}
	}`;

	const res = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers,
		body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
	});

	if (!res.ok) {
		throw new Error(`GitHub GraphQL API failed: ${res.status} ${res.statusText}`);
	}

	const data = await res.json();
	if (data.errors) {
		throw new Error(`GitHub GraphQL errors: ${JSON.stringify(data.errors)}`);
	}

	const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
	if (!calendar || !Array.isArray(calendar.weeks)) {
		throw new Error("Invalid GitHub contributions response shape");
	}

	const weeks: number[][] = calendar.weeks.map(
		(w: { contributionDays: { contributionCount: number }[] }) =>
			w.contributionDays.map((d) => Number(d.contributionCount) || 0)
	);

	const firstWeek = calendar.weeks[0]?.contributionDays;
	const lastWeek = calendar.weeks[calendar.weeks.length - 1]?.contributionDays;
	const start = firstWeek?.[0]?.date;
	const end = lastWeek?.[lastWeek.length - 1]?.date;

	const sum = weeks.flat().reduce((acc: number, c: number) => acc + c, 0);
	const total = sum; // Must match sum of days for main.ts loadContributions

	const contributionsData = {
		total,
		start,
		end,
		weeks,
	};

	await Deno.writeTextFile(
		"./src/contributions.json",
		JSON.stringify(contributionsData),
	);

	console.log(`✓ Updated contributions.json: ${total} contributions (${start} → ${end})`);
	return { total, formatted: formatNumber(total) };
}

// 2. Fetch NPM downloads
async function fetchNpmDownloads(pkg: string): Promise<number> {
	try {
		const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg}`);
		if (!res.ok) {
			console.warn(`Failed to fetch downloads for ${pkg}: ${res.status}`);
			return 0;
		}
		const data = await res.json();
		return Number(data.downloads) || 0;
	} catch (err) {
		console.warn(`Error fetching downloads for ${pkg}:`, err);
		return 0;
	}
}

async function updateNpmStats() {
	let lastfmViewerTotal = 0;
	for (const pkg of LASTFM_VIEWER_PACKAGES) {
		const count = await fetchNpmDownloads(pkg);
		lastfmViewerTotal += count;
	}

	const lastfmTsApiTotal = await fetchNpmDownloads(LASTFM_TS_API_PACKAGE);

	console.log(
		`✓ Fetched npm downloads: @lastfm-viewer = ${lastfmViewerTotal}, lastfm-ts-api = ${lastfmTsApiTotal}`,
	);

	// Update src/@lastfm-viewer.html
	const lfmViewerHtmlPath = "./src/@lastfm-viewer.html";
	let lfmViewerHtml = await Deno.readTextFile(lfmViewerHtmlPath);
	lfmViewerHtml = lfmViewerHtml.replace(
		/<b>[\d,]+<\/b>(\s*npm downloads \/ month)/,
		`<b>${formatNumber(lastfmViewerTotal)}</b>$1`,
	);
	await Deno.writeTextFile(lfmViewerHtmlPath, lfmViewerHtml);

	// Update src/lastfm-ts-api.html
	const lfmTsApiHtmlPath = "./src/lastfm-ts-api.html";
	let lfmTsApiHtml = await Deno.readTextFile(lfmTsApiHtmlPath);
	lfmTsApiHtml = lfmTsApiHtml.replace(
		/<b>[\d,]+<\/b>(\s*downloads \/ month)/,
		`<b>${formatNumber(lastfmTsApiTotal)}</b>$1`,
	);
	await Deno.writeTextFile(lfmTsApiHtmlPath, lfmTsApiHtml);

	return {
		lastfmViewer: { total: lastfmViewerTotal, formatted: formatNumber(lastfmViewerTotal) },
		lastfmTsApi: { total: lastfmTsApiTotal, formatted: formatNumber(lastfmTsApiTotal) },
	};
}

// 3. Update README.md
async function updateReadme(contribFormatted: string, lfmViewerFormatted: string, lfmTsApiFormatted: string) {
	let readme = await Deno.readTextFile("./README.md");

	// Update topbar alt text
	readme = readme.replace(
		/alt="zoasr \/ readme\.md, [\d,]+ contributions"/,
		`alt="zoasr / readme.md, ${contribFormatted} contributions"`,
	);

	// Update header alt text
	readme = readme.replace(
		/([\d,]+) contributions in the last 12 months, drawn in ember\./,
		`${contribFormatted} contributions in the last 12 months, drawn in ember.`,
	);

	// Update @lastfm-viewer alt text
	readme = readme.replace(
		/(@lastfm-viewer: [^"]*?)([\d,]+)( npm downloads per month\.)/,
		`$1${lfmViewerFormatted}$3`,
	);

	// Update lastfm-ts-api alt text
	readme = readme.replace(
		/(lastfm-ts-api: [^"]*?)([\d,]+)( downloads per month\.)/,
		`$1${lfmTsApiFormatted}$3`,
	);

	await Deno.writeTextFile("./README.md", readme);
	console.log("✓ Updated README.md dynamic labels & alt text");
}

async function main() {
	console.log("🚀 Updating dynamic stats...");
	const contrib = await updateGitHubContributions();
	const npm = await updateNpmStats();
	await updateReadme(contrib.formatted, npm.lastfmViewer.formatted, npm.lastfmTsApi.formatted);
	console.log("🎨 Building banners...");
	await build();
	console.log("✨ All dynamic stats and banners successfully updated!");
}

if (import.meta.main) {
	await main();
}
