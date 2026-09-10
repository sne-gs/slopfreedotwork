import { cx } from "./cx";

export type Gap = "xs" | "sm" | "md" | "lg" | "xl";

export const gapClasses: Record<Gap | "none", string | null> = {
	xs: cx("gap-2"),
	sm: cx("gap-3"),
	md: cx("gap-4"),
	lg: cx("gap-5"),
	xl: cx("gap-5"),
	none: null,
};
