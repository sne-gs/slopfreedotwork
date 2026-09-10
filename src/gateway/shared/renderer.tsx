import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html lang="en" data-theme="cyberminimalism">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					rel="preload"
					href="/static/fonts/space-grotesk-latin-wght-normal.woff2"
					as="font"
					type="font/woff2"
					crossorigin="anonymous"
				/>
				<link rel="icon" href="/static/favicon.ico" type="image/x-icon" />

				<link href="/static/styles.css" rel="stylesheet" />
				<link href="/static/uno.css" rel="stylesheet" />

				<script type="module" src="/static/datastar.js"></script>
			</head>
			<body class="app-shell">{children}</body>
		</html>
	);
});
