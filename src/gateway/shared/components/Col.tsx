import { css, cx } from "hono/css";
import type { Child } from "hono/jsx";
import { type Gap, gapClasses } from "./gap";

const colClass = css`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: auto;
	height: 100%;
`;

export const Col = ({
	children,
	gap,
	template,
	classes,
}: {
	readonly children: Child;
	readonly gap?: Gap;
	readonly template?: string;
	readonly classes?: Promise<string>;
}) => {
	const colClasses = cx(
		colClass,
		gapClasses[gap ?? "none"],
		css`grid-auto-rows: ${template ?? "auto"}`,
		classes,
	);
	return <div class={colClasses}>{children}</div>;
};
