import type { Child, FC } from "hono/jsx";
import { cx } from "./cx";

type Variant = "base" | "contrast";

type Size = "sm" | "md" | "lg";

const baseClass = cx(
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"inline-flex",
	"items-center",
	"justify-center",
	"no-underline",
	"tracking-button",
	"transition-colors",
	"uppercase",
);

const disabledClass = cx("cursor-not-allowed opacity-25");

const variantClasses: Record<Variant, string> = {
	contrast: cx(
		"bg-neutral",
		"border-0",
		"hover:bg-neutral/85",
		"text-neutral-content",
	),
	base: cx(
		"bg-base-100",
		"border",
		"border-base-content",
		"hover:bg-base-200",
		"text-base-content",
	),
};

const sizeClasses: Record<Size, string> = {
	sm: cx("h-8 px-2 text-xs"),
	md: cx("h-10 px-6 text-xs"),
	lg: cx("h-12 px-12 text-sm"),
};

const fullWidthClass = cx("w-full");

export interface Props {
	readonly variant?: Variant;
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
	variant = "base",
	size = "md",
	full = false,
	children,
	...props
}) => {
	const classes = cx(
		baseClass,
		props.disabled && disabledClass,
		variantClasses[variant],
		sizeClasses[size],
		full && fullWidthClass,
	);

	return (
		<button class={classes} {...props}>
			{children}
		</button>
	);
};
