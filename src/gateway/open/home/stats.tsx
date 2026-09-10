import type { FC } from "hono/jsx";
import { cx } from "#gateway/shared";

export interface Stat {
	label: string;
	value: string;
}

interface StatsProps {
	stats: Stat[];
}

const statsSectionClass = cx(
	"bg-base-300",
	"gap-px",
	"grid",
	"grid-cols-2",
	"lg:grid-cols-4",
);

const statItemClass = cx("bg-white", "md:p-10", "md:px-12", "p-6");

const statLabelClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const statValueClass = cx(
	"font-medium",
	"md:text-5xl",
	"mt-4",
	"text-4xl",
	"tracking-tight",
);

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
