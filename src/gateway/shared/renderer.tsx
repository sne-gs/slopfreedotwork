import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html lang="en" data-theme="cyberminimalism">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/static/favicon/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/static/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/static/favicon/favicon-16x16.png"
				/>
				<link rel="manifest" href="/static/favicon/site.webmanifest" />
				<link
					rel="preload"
					href="/static/fonts/space-grotesk-latin-wght-normal.woff2"
					as="font"
					type="font/woff2"
					crossorigin="anonymous"
				/>

				<Style />
				<link href="/static/styles.css" rel="stylesheet" />

				<script type="module" src="/static/datastar.js"></script>
			</head>
			<body class="app-shell">{children}</body>
		</html>
	);
});
