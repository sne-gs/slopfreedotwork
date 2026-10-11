import { cx } from "hono/css";
import type { Child } from "hono/jsx";

const fieldClass = cx("bg-base-100", "px-8", "py-6");

const labelClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
	"text-wrap",
);

export const Field = ({
	label,
	children,
}: {
	readonly label: string;
	readonly children: Child;
}) => (
	<div class={fieldClass}>
		<div class={labelClass}>{label}</div>
		<p>{children}</p>
	</div>
);
