import type { Child } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import { cx } from "./cx";

const mainClass = cx(
	"bg-base-300",
	"flex",
	"flex-col",
	"gap-px",
	"overflow-x-hidden",
);

type MainType = (p: { children: Child }) => JSX.Element;

export const Main: MainType = ({ children }) => (
	<main class={mainClass}>{children}</main>
);
