import type { Child } from "hono/jsx";
import { cx } from "./cx";
import { type Gap, gapClasses } from "./gap";

const colClass = cx("auto-rows-auto", "grid", "grid-flow-row", "h-full");

export const Col = ({
	children,
	gap,
	template,
	classes,
}: {
	readonly children: Child;
	readonly gap?: Gap;
	readonly template?: string;
	readonly classes?: string;
}) => {
	const colClasses = cx(colClass, gapClasses[gap ?? "none"], classes);
	return (
		<div class={colClasses} style={{ gridAutoRows: template ?? "auto" }}>
			{children}
		</div>
	);
};
