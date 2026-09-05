import { css, cx } from "hono/css";
import type { Child, FC } from "hono/jsx";

type Variant = "base" | "contrast";

type Size = "sm" | "md" | "lg";

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
	contrast: css`
    border: 0;
    background-color: var(--color-neutral);
    color: var(--color-neutral-content);
    &:hover {
      background-color: color-mix(in oklab, var(--color-neutral) 85%, transparent);
    }
  `,
	base: css`
    border: var(--line-width-default) solid var(--color-base-content);
    background-color: var(--color-base-100);
    &:hover {
      background-color: var(--color-base-200);
    }
  `,
};

const sizeClasses: Record<Size, ReturnType<typeof css>> = {
	sm: css`
    height: var(--control-height-sm);
    padding-inline: var(--control-pad-sm);
    font-size: var(--text-xs);
  `,
	md: css`
    height: var(--control-height-md);
    padding-inline: var(--control-pad-md);
    font-size: var(--text-xs);
	`,
	lg: css`
    height: var(--control-height-lg);
    padding-inline: var(--control-pad-lg);
    font-size: var(--text-sm);
  `,
};

const fullWidthClass = css`
  width: 100%;
`;

export interface Props {
	readonly variant?: Variant;
	readonly size?: Size;
	readonly name?: string;
	readonly type?: "button" | "submit" | "reset";
	readonly value?: string;
	readonly disabled?: boolean;
	readonly full?: boolean;
	/** disallowed **/
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
		variantClasses[variant],
		sizeClasses[size],
		full ? fullWidthClass : "",
	);

	return (
		<button class={classes} {...props}>
			{children}
		</button>
	);
};
