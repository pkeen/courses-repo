import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import preserveDirectives from "rollup-preserve-directives";
import postcss from "rollup-plugin-postcss";
import sass from "sass";
import tailwindcssPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
// import esbuild from "rollup-plugin-esbuild";

/* --- inline PostCSS plugin ------------------------------------ */
const stripTailwindLayers = () => ({
	postcssPlugin: "strip-tailwind-layers",
	AtRule(atRule) {
		if (atRule.name === "layer") {
			/* keep the inner rules, drop the wrapper */
			atRule.replaceWith(atRule.nodes);
		}
	},
});
stripTailwindLayers.postcss = true;
/* --------------------------------------------------------------- */

export default defineConfig({
	// input: ["src/index.ts", "src/client/index.ts"],
	input: "src/index.ts",
	output: {
		dir: "dist",
		format: "esm",
		preserveModules: true,
		preserveModulesRoot: "src",
		entryFileNames: "[name].mjs",
	},
	external: [
		"react",
		"react-dom",
		"next",
		"react-hook-form",
		"@dnd-kit/core",
		"@dnd-kit/sortable",
		"@dnd-kit/utilities",
		"@hookform/resolvers",
		"@radix-ui/react-slot",
		"classnames",
		"clsx",
		"lucide-react",
		"rollup-preserve-directives",
		// "tailwind-merge",
		// "tailwindcss-animate",
		"typescript",
		"zod",
		"react/jsx-runtime",
	],
	plugins: [
		preserveDirectives(),
		resolve({
			// Prevent bundling node_modules
			preferBuiltins: true,
			// Only bundle source files
			moduleDirectories: ["src"],
		}),
		commonjs(),
		postcss({
			use: sass,
			modules: true,
			extract: true,

			modules: {
				// treat anything that matches the regex as *global* CSS
				globalModulePaths: [/lib\/globals\.css$/],
			},

			plugins: [
				tailwindcssPostcss(),
				autoprefixer(),
				stripTailwindLayers(),
			],
		}),
		typescript({
			tsconfig: "./tsconfig.json",
			declaration: true,
			rootDir: "src",
			outDir: "dist",
			jsx: "react-jsx",
		}),
		// esbuild({
		// 	minify: false,
		// 	target: "es2019",
		// 	jsx: "automatic",
		// 	sourceMap: true,
		// }),
	],
});
