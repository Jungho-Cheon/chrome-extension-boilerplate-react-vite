import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
	manifest_version: 3,
	name: packageJson.name,
	version: packageJson.version,
	description: packageJson.description,
	options_page: "src/pages/options/index.html",
	permissions: ["contextMenus"],
	background: {
		service_worker: "src/pages/background/index.js",
		type: "module",
	},
	action: {
		default_popup: "src/pages/popup/index.html",
		default_icon: "favicon.png",
	},
	chrome_url_overrides: {
		newtab: "src/pages/newtab/index.html",
	},
	icons: {
		"128": "favicon.png",
	},
	content_scripts: [
		{
			matches: ["http://*/*", "https://*/*", "<all_urls>"],
			js: ["src/pages/content/index.js"],
			// KEY for cache invalidation
			css: ["assets/css/contentStyle<KEY>.chunk.css"],
		},
	],
	devtools_page: "src/pages/devtools/index.html",
	web_accessible_resources: [
		{
			resources: ["assets/js/*.js", "assets/css/*.css", "favicon.png"],
			matches: ["*://*/*"],
		},
	],
};

export default manifest;
