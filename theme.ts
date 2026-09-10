export default {
	colors: {
		base: {
			100: "oklch(99% 0 0)",
			200: "oklch(95% 0 0)",
			300: "oklch(82% 0.015 250)",
			content: "oklch(7% 0 0)",
		},
		neutral: { DEFAULT: "oklch(7% 0 0)", content: "oklch(99% 0 0)" },
		primary: { DEFAULT: "oklch(55% 0.17 255)", content: "oklch(99% 0 0)" },
		info: { DEFAULT: "oklch(62% 0.08 245)", content: "oklch(8% 0 0)" },
		success: { DEFAULT: "oklch(58% 0.12 145)", content: "oklch(99% 0 0)" },
		warning: { DEFAULT: "oklch(76% 0.13 85)", content: "oklch(8% 0 0)" },
		error: { DEFAULT: "oklch(58% 0.18 25)", content: "oklch(99% 0 0)" },
	},

	borderRadius: {
		none: "0",
		xs: "0",
		sm: "0",
		DEFAULT: "0",
		md: "0",
		lg: "0",
		xl: "0",
		"2xl": "0",
		"3xl": "0",
		full: "9999px",
	},

	fontSize: {
		display: ["clamp(4rem, 10vw, 9rem)", "0.76"],
		label: ["0.65rem", "1"],
		note: ["0.6rem", "1"],
	},

	letterSpacing: {
		display: "-0.08em",
		label: "0.28em",
		rule: "0.24em",
		tab: "0.2em",
		button: "0.25em",
		note: "0.22em",
	},

	boxShadow: {
		sphere: "0 24px 60px oklch(7% 0 0 / 0.18)",
	},
};
