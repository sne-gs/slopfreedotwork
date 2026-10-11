import { cx } from "hono/css";

const captionClass = cx(
	"text-base-content/60",
	"text-label",
	"tracking-label",
	"uppercase",
	"font-normal",
);

export const Caption = ({
	labels,
	separator = "//",
}: {
	readonly labels: readonly string[];
	readonly separator?: string;
}) => {
	return <div class={captionClass}>{labels.join(` ${separator} `)}</div>;
};
