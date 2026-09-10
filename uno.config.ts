import { defineConfig, presetIcons, presetMini } from "unocss";
import type { Theme } from "unocss/preset-mini";
import { cxExtractor } from "./extractor";
import cyberminimalism from "./theme";

export default defineConfig({
	autocomplete: {
		extractors: [cxExtractor],
	},
	presets: [presetMini(), presetIcons()],
	rules: [
		["uppercase", { "text-transform": "uppercase" }],
		["lowercase", { "text-transform": "lowercase" }],
		["capitalize", { "text-transform": "capitalize" }],
		[
			"sr-only",
			{
				position: "absolute",
				width: "1px",
				height: "1px",
				padding: "0",
				margin: "-1px",
				overflow: "hidden",
				"clip-path": "inset(50%)",
				"white-space": "nowrap",
				"border-width": "0",
			},
		],
		[
			/^accent-([a-z-]+)$/,
			([, name], { theme }) => {
				const colors = (theme as { colors: unknown }).colors as
					| Record<string, string | { DEFAULT?: string }>
					| undefined;
				const value = colors?.[name];
				const color = typeof value === "string" ? value : value?.DEFAULT;
				return color ? { "accent-color": color } : undefined;
			},
		],
	],
	theme: {
		colors: cyberminimalism.colors,
		borderRadius: cyberminimalism.borderRadius,
		fontSize: cyberminimalism.fontSize as unknown as Theme["fontSize"],
		lineHeight: {
			label: "1",
			note: "1",
		},
		letterSpacing: cyberminimalism.letterSpacing,
		boxShadow: cyberminimalism.boxShadow,
		fontFamily: {
			sans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
			mono: '"Google Sans Code", ui-monospace, monospace',
			brand: '"Micro 5", sans-serif',
			serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
		},
	},
});
