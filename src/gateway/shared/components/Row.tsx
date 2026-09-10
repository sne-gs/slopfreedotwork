import type { Child } from "hono/jsx";
import { cx } from "./cx";
import { type Gap, gapClasses } from "./gap";

const rowClass = cx("grid", "grid-flow-col", "w-full");

const justifyClasses = {
	start: cx("justify-start"),
	end: cx("justify-end"),
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
	readonly classes?: string;
}) => {
	const rowClasses = cx(
		rowClass,
		gapClasses[gap ?? "none"],
		justifyClasses[justify ?? "none"],
		classes,
	);
	return (
		<div class={rowClasses} style={{ gridAutoColumns: template ?? "1fr" }}>
			{children}
		</div>
	);
};
