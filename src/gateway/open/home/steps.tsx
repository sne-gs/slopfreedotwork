import { css } from "hono/css";
import type { FC } from "hono/jsx";

const steps = [
	{
		index: "01",
		title: "Initialize",
		body: "Create a profile, upload your resume.",
	},
	{
		index: "02",
		title: "Match",
		body: "Search for jobs, subscribe to companies.",
	},
	{
		index: "03",
		title: "Execute",
		body: "Get an offer, stop being poor.",
	},
];

const stepsSectionClass = css`
    display: grid;
    gap: var(--line-width-default);
    @media (min-width: 1024px) {
        grid-template-columns: 1fr 2fr;
    }
`;

const stepsHeaderClass = css`
    padding: var(--space-10) var(--space-6);
    background-color: var(--color-base-100);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
`;

const stepsHeaderTextClass = css`
    display: block;
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-faint);
`;

const stepsHeadingClass = css`
    margin-top: var(--space-8);
    font-size: var(--text-5xl);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-tighter);
    @media (min-width: 768px) {
        font-size: var(--text-6xl);
    }
`;

const stepsGridClass = css`
    background-color: var(--color-base-300);
    display: grid;
    gap: var(--line-width-default);
    @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const stepItemClass = css`
    background-color: var(--color-base-100);
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-8) var(--space-12);
    }
`;

const stepIndexClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
`;

const stepTitleClass = css`
    margin-top: var(--space-8);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tab);
`;

const stepBodyClass = css`
    margin-top: var(--space-4);
    max-width: 14rem;
    font-size: var(--text-xs);
    line-height: var(--leading-relaxed);
    color: var(--color-content-faint);
`;

export const Steps: FC = () => (
	<section class={stepsSectionClass}>
		<div class={stepsHeaderClass}>
			<span class={stepsHeaderTextClass}>System // Protocol</span>
			<h2 class={stepsHeadingClass}>Three steps.</h2>
		</div>
		<div class={stepsGridClass}>
			{steps.map((step) => (
				<div key={step.index} class={stepItemClass}>
					<span class={stepIndexClass}>{step.index}</span>
					<h3 class={stepTitleClass}>{step.title}</h3>
					<p class={stepBodyClass}>{step.body}</p>
				</div>
			))}
		</div>
	</section>
);
