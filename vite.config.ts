import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import makeManifest from "./utils/plugins/make-manifest";
import customDynamicImport from "./utils/plugins/custom-dynamic-import";
import addHmr from "./utils/plugins/add-hmr";
import watchRebuild from "./utils/plugins/watch-rebuild";
import manifest from "./manifest";

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(rootDir, "src");
const pagesDir = path.resolve(srcDir, "pages");
const assetsDir = path.resolve(srcDir, "assets");
const outDir = path.resolve(rootDir, "dist");
const publicDir = path.resolve(rootDir, "public");

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = true;

export default defineConfig({
	resolve: {
		alias: {
			"@/src": srcDir,
			"@/assets": assetsDir,
			"@/pages": pagesDir,
		},
	},
	plugins: [
		react(),
		makeManifest(manifest, {
			isDev,
			contentScriptCssKey: regenerateCacheInvalidationKey(),
		}),
		customDynamicImport(),
		addHmr({ background: enableHmrInBackgroundScript, view: true }),
		watchRebuild(),
	],
	publicDir,
	build: {
		outDir,
		/** Can slowDown build speed. */
		// sourcemap: isDev,
		minify: isProduction,
		reportCompressedSize: isProduction,
		rollupOptions: {
			input: {
				devtools: path.resolve(pagesDir, "devtools", "index.html"),
				panel: path.resolve(pagesDir, "panel", "index.html"),
				content: path.resolve(pagesDir, "content", "index.ts"),
				background: path.resolve(pagesDir, "background", "index.ts"),
				contentStyle: path.resolve(pagesDir, "content", "style.scss"),
				popup: path.resolve(pagesDir, "popup", "index.html"),
				newtab: path.resolve(pagesDir, "newtab", "index.html"),
				options: path.resolve(pagesDir, "options", "index.html"),
			},
			output: {
				entryFileNames: "src/pages/[name]/index.js",
				chunkFileNames: isDev
					? "assets/js/[name].js"
					: "assets/js/[name].[hash].js",
				assetFileNames: (assetInfo) => {
					const { dir, name: _name } = path.parse(assetInfo.name);
					const assetFolder = dir.split("/").at(-1);
					const name = assetFolder + firstUpperCase(_name);
					if (name === "contentStyle") {
						return `assets/css/contentStyle${cacheInvalidationKey}.chunk.css`;
					}
					return `assets/[ext]/${name}.chunk.[ext]`;
				},
			},
		},
	},
});

function firstUpperCase(str: string) {
	const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
	return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}

let cacheInvalidationKey: string = generateKey();
function regenerateCacheInvalidationKey() {
	cacheInvalidationKey = generateKey();
	return cacheInvalidationKey;
}

function generateKey(): string {
	return `${(Date.now() / 100).toFixed()}`;
}
