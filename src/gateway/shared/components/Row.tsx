import { css, cx } from "hono/css";
import type { Child } from "hono/jsx";
import { type Gap, gapClasses } from "./gap";

const rowClass = css`
	display: grid;
	grid-auto-flow: column;
	width: 100%;
`;

const justifyClasses = {
	start: css`justify-content: start`,
	end: css`justify-content: end`,
	none: null,
};

export const Row = ({
	children,
	gap,
	classes,
	justify,
	template,
}: {
	readonly children: Child;
	readonly gap?: Gap;
	readonly justify?: "start" | "end";
	readonly template?: string;
	readonly classes?: Promise<string>;
}) => {
	const rowClasses = cx(
		rowClass,
		gapClasses[gap ?? "none"],
		justifyClasses[justify ?? "none"],
		css`grid-auto-columns: ${template ?? "1fr"}`,
		classes,
	);
	return <div class={rowClasses}>{children}</div>;
};
