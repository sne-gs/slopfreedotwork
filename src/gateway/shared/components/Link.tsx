import type { Child } from "hono/jsx";
import { cx } from "./cx";

type Variant = "base" | "buttonBase" | "buttonContrast";

type Size = "sm" | "md" | "lg";

interface Props {
	readonly children: Child;
	readonly class?: never;
	readonly href: string;
	readonly size?: Size;
	readonly variant?: Variant;
}

const baseClass = cx(
	"inline-flex",
	"items-center",
	"justify-center",
	"uppercase",
	"tracking-button",
	"no-underline",
	"cursor-pointer",
	"transition-colors",
	"duration-150 ease-out",
);

const variantClasses: Record<Variant, string> = {
	base: cx("hover:text-base-content"),
	buttonBase: cx(
		"bg-base-100",
		"border",
		"border-base-content",
		"hover:bg-base-200",
		"text-base-content",
	),
	buttonContrast: cx("bg-base-content", "hover:bg-neutral/85", "text-white"),
};

const sizeClasses: Record<Size, string> = {
	sm: cx("h-8", "px-2", "text-xs"),
	md: cx("h-10", "px-6", "text-xs"),
	lg: cx("h-12", "px-12", "text-sm"),
};

export const Link = ({ size = "md", variant = "base", ...props }: Props) => {
	const linkClasses = cx(baseClass, sizeClasses[size], variantClasses[variant]);
	return <a class={linkClasses} {...props} />;
};
