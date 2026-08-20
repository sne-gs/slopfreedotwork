import { jsxRenderer } from "hono/jsx-renderer";
import styleUrl from "./styles.css?url";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en" data-theme="cyberminimalism">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin />

        <link href={styleUrl} rel="stylesheet" />

        <script
          type="module"
          src="https://cdn.jsdelivr.net/gh/starfederation/datastar@v1.0.2/bundles/datastar.js"
        ></script>
      </head>
      <body class="min-h-screen bg-base-200 font-sans">{children}</body>
    </html>
  );
});
