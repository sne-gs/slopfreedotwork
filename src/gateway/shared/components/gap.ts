import { css } from "hono/css";

export type Gap = "xs" | "sm" | "md" | "lg" | "xl";

export const gapClasses: Record<Gap | "none", Promise<string> | null> = {
	xs: css`
		gap: var(--spacing-xs);
	`,
	sm: css`
		gap: var(--spacing-sm);
	`,
	md: css`
		gap: var(--spacing-default);
	`,
	lg: css`
		gap: var(--spacing-4xl);
	`,
	xl: css`
		gap: var(--spacing-8xl);
	`,
	none: null,
};
