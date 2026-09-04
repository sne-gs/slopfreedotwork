import { css } from "hono/css";
import type { Child } from "hono/jsx";
import type { User } from "#utility/types";
import { Button } from "./Button";

const nav = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-base-100);
    padding: var(--space-4) var(--space-6);
`;

const logoLink = css`
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    color: var(--color-content-faint);
    text-decoration: none;
`;

const logoSpan = css`
    position: relative;
    display: inline-grid;
    place-items: center;
`;

const slopText = css`
    text-transform: uppercase;
    font-size: var(--text-lg);
    font-weight: var(--weight-extrabold);
    letter-spacing: -0.02em;
    color: var(--color-base-content);
`;

const lineSpan = css`
    position: absolute;
    inset-inline: calc(-1 * var(--space-2));
    top: 50%;
    height: 3px;
    transform: translateY(-50%) rotate(-6deg);
    background-color: var(--color-brand-accent);
`;

const desktopLinks = css`
    display: none;
    @media (min-width: 768px) {
        display: flex;
        align-items: center;
        gap: var(--space-8);
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-button);
        color: var(--color-content-muted);
    }
`;

const mobileDropdown = css`
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--color-base-100);
    border-bottom: var(--line-width-default) solid var(--color-base-300);
    padding: var(--space-6);
    gap: var(--space-4);
    z-index: var(--z-dropdown);

    details[open] > & {
        display: flex;
    }

    & a {
        width: 100%;
    }
`;

const hamburgerBox = css`
    width: var(--hb-width);
    height: calc(var(--hb-height) * 3 + var(--hb-spacing) * 2);
    display: inline-block;
    position: relative;
`;

const hamburgerInner = css`
    display: block;
    top: calc(var(--hb-height) / 2);
    width: var(--hb-width);
    height: var(--hb-height);
    background-color: var(--hb-color);
    border-radius: var(--hb-radius);
    position: absolute;
    transition-property: transform;
    transition-duration: var(--duration-spring);
    transition-timing-function: var(--ease-spring);

    &::before,
    &::after {
        content: "";
        display: block;
        width: var(--hb-width);
        height: var(--hb-height);
        background-color: var(--hb-color);
        border-radius: var(--hb-radius);
        position: absolute;
    }

    &::before {
        top: calc(var(--hb-height) + var(--hb-spacing));
        transition: opacity var(--duration-fastest) var(--duration-spring) ease;
    }

    &::after {
        top: calc((var(--hb-height) + var(--hb-spacing)) * 2);
        transition: transform var(--duration-spring) var(--ease-spring);
    }
`;

const hamburger = css`
    --hb-padding: 10px;
    --hb-width: 24px;
    --hb-height: 2px;
    --hb-spacing: 5px;
    --hb-color: var(--color-base-content);
    --hb-radius: 2px;
    --hb-hover-opacity: 0.7;
    --hb-delay: 75ms;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    & > summary {
        list-style: none;
        padding: var(--hb-padding);
        cursor: pointer;
        transition: opacity var(--duration-fast) var(--ease-linear);

        &:hover {
            opacity: var(--hb-hover-opacity);
        }
    }
    & > summary::-webkit-details-marker {
        display: none;
    }

    @media (min-width: 768px) {
        display: none;
    }

    &[open] ${hamburgerInner} {
        transform: translate3d(0, calc(var(--hb-height) + var(--hb-spacing)), 0) rotate(135deg);
        transition-delay: var(--hb-delay);

        &::before {
            transition-delay: 0s;
            opacity: 0;
        }

        &::after {
           transform: translate3d(0, calc((var(--hb-height) + var(--hb-spacing)) * -2), 0) rotate(-270deg);
            transition-delay: var(--hb-delay);
        }
    }
`;

const Hamburger = ({ children }: { children: Child }) => (
	<details class={hamburger}>
		<summary aria-label="Toggle navigation menu">
			<span class={hamburgerBox}>
				<span class={hamburgerInner} />
			</span>
		</summary>
		{children}
	</details>
);

type LinkSize = "small" | "medium" | "large";

const NavLink = ({
	href,
	size,
	children,
}: {
	href: string;
	size: LinkSize;
	children: string;
}) => (
	<Button href={href} variant="link" size={size}>
		{children}
	</Button>
);

export const Nav = ({ user }: { user: User | null }) => {
	const renderLinks = (linkSize: LinkSize, ctaSize: LinkSize) => (
		<>
			<NavLink href="/applicant/jobs" size={linkSize}>
				Jobs
			</NavLink>
			<NavLink href="/applicant/companies" size={linkSize}>
				Companies
			</NavLink>
			{user ? (
				<>
					<NavLink href={`/${user.role}/dashboard`} size={linkSize}>
						Dashboard
					</NavLink>
					<NavLink href="/logout" size={linkSize}>
						Sign Out
					</NavLink>
				</>
			) : (
				<>
					<NavLink href="/login" size={linkSize}>
						Sign In
					</NavLink>
					<Button href="/register" size={ctaSize}>
						Get Access
					</Button>
				</>
			)}
		</>
	);

	return (
		<nav class={nav} aria-label="Main">
			<a href="/" class={logoLink}>
				<span class={logoSpan}>
					<span class={slopText}>Slop</span>
					<span aria-hidden="true" class={lineSpan} />
				</span>
				.work
			</a>

			<div class={desktopLinks}>{renderLinks("small", "medium")}</div>

			<Hamburger>
				<div class={mobileDropdown}>{renderLinks("large", "large")}</div>
			</Hamburger>
		</nav>
	);
};
