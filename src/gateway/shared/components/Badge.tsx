import type { Child } from "hono/jsx";
import { cx } from "./cx";

const baseClass = cx(
	"inline-flex",
	"items-center",
	"px-4",
	"py-1",
	"text-label",
	"tracking-tab",
	"uppercase",
	"w-max",
);

type Status = "error" | "warning" | "success" | "info" | "neutral";

type Border = "solid" | "dashed" | "none";

const statusClasses: Record<Status, string> = {
	error: cx("text-error"),
	warning: cx("text-warning"),
	success: cx("text-success"),
	info: cx("text-info"),
	neutral: cx("text-base-content/60"),
};

const borderClasses: Record<Border, string> = {
	solid: cx("border border-base-content/60 border-solid"),
	dashed: cx("border border-base-content/60 border-dashed"),
	none: cx("border-none bg-base-200"),
};

export const Badge = ({
	status = "neutral",
	border = "solid",
	children,
}: {
	readonly status?: Status;
	readonly border?: Border;
	readonly children: Child;
}) => {
	const badgeClass = cx(
		baseClass,
		statusClasses[status],
		borderClasses[border],
	);
	return <span class={badgeClass}>{children}</span>;
};
