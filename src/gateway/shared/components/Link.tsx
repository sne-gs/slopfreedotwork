import { css, cx } from "hono/css";
import type { Child } from "hono/jsx";

type Variant = "base" | "buttonBase" | "buttonContrast";

type Size = "sm" | "md" | "lg";

interface Props {
	readonly children: Child;
	/** disallowed **/
	readonly class?: never;
	readonly href: string;
	readonly size?: Size;
	readonly variant?: Variant;
}

const baseClass = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: var(--tracking-button);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);
`;

const variantClasses: Record<Variant, ReturnType<typeof css>> = {
	base: css`
		&:hover {
			color: var(--color-base-content);
		}
	`,
	buttonBase: css`
		border: var(--line-width-default) solid var(--color-base-content);
		background-color: var(--color-base-100);
		&:hover {
			background-color: var(--color-base-200);
		}
	`,
	buttonContrast: css`
		color: var(--color-white);
		background-color: var(--color-base-content);
		&:hover {
      background-color: color-mix(in oklab, var(--color-neutral) 85%, transparent);
		}
	`,
};

const sizeClasses: Record<Size, ReturnType<typeof css>> = {
	sm: css`
    height: var(--control-height-sm);
    padding: var(--control-pad-sm);
    font-size: var(--text-sm);
  `,
	md: css`
    height: var(--control-height-md);
    padding-inline: var(--control-pad-md);
    font-size: var(--text-md);
	`,
	lg: css`
    height: var(--control-height-lg);
    padding-inline: var(--control-pad-lg);
    font-size: var(--text-lg);
  `,
};

export const Link = ({ size = "md", variant = "base", ...props }: Props) => {
	const linkClasses = cx(baseClass, sizeClasses[size], variantClasses[variant]);
	return <a class={linkClasses} {...props} />;
};
