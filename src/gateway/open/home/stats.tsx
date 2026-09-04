import { css } from "hono/css";
import type { FC } from "hono/jsx";

export interface Stat {
	label: string;
	value: string;
}

interface StatsProps {
	stats: Stat[];
}

const statsSectionClass = css`
    background-color: var(--color-base-300);
    display: grid;
    gap: var(--line-width-default);
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const statItemClass = css`
    background-color: var(--color-white);
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-10) var(--space-12);
    }
`;

const statLabelClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-faint);
`;

const statValueClass = css`
    margin-top: var(--space-4);
    font-size: var(--text-4xl);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-tight);
    @media (min-width: 768px) {
        font-size: var(--text-5xl);
    }
`;

export const Stats: FC<StatsProps> = ({ stats }) => (
	<section class={statsSectionClass}>
		{stats.map((stat) => (
			<div key={stat.label} class={statItemClass}>
				<span class={statLabelClass}>{stat.label}</span>
				<p class={statValueClass}>{stat.value}</p>
			</div>
		))}
	</section>
);
