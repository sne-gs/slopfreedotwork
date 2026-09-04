import { css, cx } from "hono/css";
import type { FC } from "hono/jsx";
import { Button } from "#gateway/shared";

const labelClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
`;

const heroClass = css`
    position: relative;
    overflow: hidden;
    padding: var(--space-10) var(--space-6) var(--space-16);
    @media (min-width: 768px) {
        padding: var(--space-14) var(--space-12) var(--space-20);
    }
`;

const heroTopClass = css`
    ${labelClass}
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-8);
    color: var(--color-content-faint);
`;

const heroCountClass = css`
    background-color: var(--color-base-200);
    padding: 0 var(--space-2);
`;

const heroLogoClass = css`
    margin-left: -3vw;
    width: 58%;
`;

const heroSphereClass = css`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    width: 10rem;
    height: 10rem;
    border-radius: var(--radius-full);
    pointer-events: none;
    @media (min-width: 640px) { width: 15rem; height: 15rem; }
    @media (min-width: 768px) { width: 20rem; height: 20rem; }
    @media (min-width: 1024px) { width: 30rem; height: 30rem; }
    @media (min-width: 1280px) { width: 45rem; height: 45rem; }
`;

const heroTaglineClass = css`
    margin-top: var(--space-8);
    max-width: 28rem;
    font-size: var(--text-lg);
    font-weight: var(--weight-thin);
    line-height: var(--leading-relaxed);
    color: var(--color-content-faint);
`;

const heroActionsClass = css`
    margin-top: var(--space-8);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-4);
`;

const brHiddenMdBlockClass = css`
    display: none;
    @media (min-width: 768px) {
        display: block;
    }
`;

const relativeWrapClass = css`
    position: relative;
`;

export const Header: FC = () => (
	<header class={cx("bg-dot-fade", heroClass)}>
		<div class={heroTopClass}>
			<span>System {"//"} Slop Free Talent Network</span>
			<span class={heroCountClass}>90 / 106</span>
		</div>
		<div class={relativeWrapClass}>
			<img
				class={heroLogoClass}
				src="/static/prompts.svg"
				alt="Make no mistakes."
			/>
			<div
				aria-hidden="true"
				class={cx("bg-sphere shadow-sphere", heroSphereClass)}
			></div>
		</div>
		<p class={heroTaglineClass}>
			A place for real humans looking
			<br class={brHiddenMdBlockClass} /> for real jobs.
		</p>
		<div class={heroActionsClass}>
			<Button href="/register">Add your company</Button>
			<Button href="/jobs" variant="secondary" size="medium">
				Find a job
			</Button>
		</div>
	</header>
);
