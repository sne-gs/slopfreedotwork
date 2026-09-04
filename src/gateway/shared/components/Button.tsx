import { css, cx } from "hono/css";
import type { Child, FC } from "hono/jsx";

type Variant = "primary" | "secondary" | "link";
type Size = "small" | "medium" | "large";

const baseClass = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    text-decoration: none;
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
` satisfies Promise<string>;

const variantClasses = {
	primary: css`
        border: 0;
        background-color: var(--color-neutral);
        color: var(--color-neutral-content);
        &:hover {
            background-color: color-mix(in oklab, var(--color-neutral) 85%, transparent);
        }
    `,
	secondary: css`
        border: var(--line-width-default) solid var(--color-base-content);
        background-color: var(--color-base-100);
        &:hover {
            background-color: var(--color-base-200);
        }
    `,
	link: css`
        border: 0;
        background: none;
        color: currentColor;
        text-decoration: underline;
        text-underline-offset: 2px;
        &:hover {
            text-decoration: none;
        }
    `,
} satisfies Record<Variant, Promise<string>>;

const sizeClasses = {
	small: css`
        height: var(--control-height-sm);
        padding-inline: var(--control-pad-sm);
        font-size: var(--text-xs);
    `,
	medium: css`
        height: var(--control-height-md);
        padding-inline: var(--control-pad-md);
        font-size: var(--text-xs);
    `,
	large: css`
        height: var(--control-height-lg);
        padding-inline: var(--control-pad-lg);
        font-size: var(--text-sm);
    `,
} satisfies Record<Size, Promise<string>>;

const fullWidthClass = css`
    width: 100%;
`;

export interface Props {
	variant?: Variant;
	size?: Size;
	href?: string;
	type?: "button" | "submit" | "reset";
	fullWidth?: boolean;
	/** disallowed */
	class?: never;
	children: Child;
}

export const Button: FC<Props> = ({
	variant = "primary",
	size = "medium",
	fullWidth = false,
	href,
	children,
	...props
}) => {
	const classes = cx(
		baseClass,
		variantClasses[variant],
		sizeClasses[size],
		fullWidth ? fullWidthClass : "",
	);

	if (href) {
		return (
			<a href={href} class={classes} {...props}>
				{children}
			</a>
		);
	}
	return (
		<button type="button" class={classes} {...props}>
			{children}
		</button>
	);
};
