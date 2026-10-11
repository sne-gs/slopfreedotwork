import type { Child, FC } from "hono/jsx";
import { cx } from "./cx";

type Size = "sm" | "md" | "lg";

const baseClass = cx(
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"inline-flex",
	"items-center",
	"justify-center",
	"tracking-button",
	"transition-colors",
	"uppercase",
	"gap-2",
);

const disabledClass = cx("cursor-not-allowed opacity-25");

type Variant = "solid" | "bordered" | "text";

type Status = "error" | "warning" | "success" | "info" | "neutral";

const classes: Record<Variant, Record<Status, string>> = {
	solid: {
		error: cx("bg-error text-white hover:bg-error/80"),
		warning: cx("bg-warning text-white hover:bg-warning/80"),
		success: cx("bg-success text-white hover:bg-success/80"),
		info: cx("bg-info text-white hover:bg-info/80"),
		neutral: cx("bg-neutral text-white hover:bg-neutral/80"),
	},
	bordered: {
		error: cx(
			"border border-error/60 bg-base-100 text-error/60 hover:border-error hover:text-error",
		),
		warning: cx(
			"border border-warning/60 bg-base-100 text-warning/60 hover:border-warning hover:text-warning",
		),
		success: cx(
			"border border-success/60 bg-base-100 text-success/60 hover:border-success hover:text-success",
		),
		info: cx(
			"border border-info/60 bg-base-100 text-info/60 hover:border-info hover:text-info",
		),
		neutral: cx(
			"border border-base-content/60 bg-base-100 text-base-content/60 hover:border-base-content hover:text-base-content",
		),
	},
	text: {
		error: cx("bg-transparent text-error/60 hover:text-error"),
		warning: cx("bg-transparent text-warning/60 hover:text-warning"),
		success: cx("bg-transparent text-success/60 hover:text-success"),
		info: cx("bg-transparent text-info/60 hover:text-info"),
		neutral: cx("bg-transparent text-base-content/60 hover:text-base-content"),
	},
};

const sizeClasses: Record<Size, string> = {
	sm: cx("h-8 px-2 text-xs"),
	md: cx("h-10 px-6 text-xs"),
	lg: cx("h-12 px-12 text-sm"),
};

const fullWidthClass = cx("w-full");

export interface Props {
	readonly variant?: Variant;
	readonly status?: Status;
	readonly size?: Size;
	readonly name?: string;
	readonly type?: "button" | "submit" | "reset";
	readonly value?: string;
	readonly disabled?: boolean;
	readonly full?: boolean;
	readonly class?: never;
	readonly children: Child;
}

export const Button: FC<Props> = ({
	variant = "bordered",
	status = "neutral",
	size = "md",
	full = false,
	children,
	...props
}: Props) => {
	const buttonClasses = cx(
		baseClass,
		props.disabled && disabledClass,
		classes[variant][status],
		sizeClasses[size],
		full && fullWidthClass,
	);
	return (
		<button class={buttonClasses} {...props}>
			{children}
		</button>
	);
};
