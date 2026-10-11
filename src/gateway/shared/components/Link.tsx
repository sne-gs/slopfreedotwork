import type { Child } from "hono/jsx";
import { cx } from "./cx";

interface Props {
	readonly children: Child;
	readonly class?: never;
	readonly href: string;
	readonly size?: Size;
	readonly status?: Status;
	readonly variant?: Variant;
}

const baseClass = cx(
	"inline-flex",
	"items-center",
	"justify-center",
	"gap-2",
	"uppercase",
	"tracking-button",
	"cursor-pointer",
	"transition-colors",
	"duration-150 ease-out",
);

type Variant = "solid" | "bordered" | "body" | "nav";

type Status = "error" | "warning" | "success" | "info" | "neutral";

const classes: Record<Variant, Record<Status, string>> = {
	solid: {
		error: cx("bg-error text-white no-underline hover:bg-error/80"),
		warning: cx("bg-warning text-white no-underline hover:bg-warning/80"),
		success: cx("bg-success text-white no-underline hover:bg-success/80"),
		info: cx("bg-info text-white no-underline hover:bg-info/80"),
		neutral: cx("bg-neutral text-white no-underline hover:bg-neutral/80"),
	},
	bordered: {
		error: cx(
			"border border-error/60 text-error/60 no-underline hover:border-error hover:text-error",
		),
		warning: cx(
			"border border-warning/60 text-warning/60 no-underline hover:border-warning hover:text-warning",
		),
		success: cx(
			"border border-success/60 text-success/60 no-underline hover:border-success hover:text-success",
		),
		info: cx(
			"border border-info/60 text-info/60 no-underline hover:border-info hover:text-info",
		),
		neutral: cx(
			"border border-base-content/60 text-base-content/60 no-underline hover:border-base-content hover:text-base-content",
		),
	},
	nav: {
		error: cx(
			"text-error/60 decoration-transparent hover:text-error hover:decoration-error",
		),
		warning: cx(
			"text-warning/60 decoration-transparent hover:text-warning hover:decoration-warning",
		),
		success: cx(
			"text-success/60 decoration-transparent hover:text-success hover:decoration-success",
		),
		info: cx(
			"text-info/60 decoration-transparent hover:text-info hover:decoration-info",
		),
		neutral: cx(
			"text-base-content/60 decoration-transparent hover:text-base-content hover:decoration-base-content",
		),
	},
	body: {
		error: cx("text-error/60 hover:text-error"),
		warning: cx("text-warning/60 hover:text-warning"),
		success: cx("text-success/60 hover:text-success"),
		info: cx("text-info/60 hover:text-info"),
		neutral: cx("text-base-content/60 hover:text-base-content"),
	},
};

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
	sm: cx("h-8", "px-2", "text-xs"),
	md: cx("h-10", "px-6", "text-xs"),
	lg: cx("h-12", "px-12", "text-sm"),
};

export const Link = ({
	size = "md",
	variant = "body",
	status = "neutral",
	...props
}: Props) => {
	const linkClasses = cx(
		baseClass,
		sizeClasses[size],
		classes[variant][status],
	);
	return <a class={linkClasses} {...props} />;
};
