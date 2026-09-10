import type { FC } from "hono/jsx";
import { cx } from "#gateway/shared";

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

const stepsSectionClass = cx("gap-px", "grid", "lg:grid-cols-[1fr_2fr]");

const stepsHeaderClass = cx("bg-base-100", "md:p-12", "p-10", "px-6");

const stepsHeaderTextClass = cx(
	"block",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const stepsHeadingClass = cx(
	"font-medium",
	"md:text-6xl",
	"mt-8",
	"text-5xl",
	"tracking-tighter",
);

const stepsGridClass = cx("bg-base-300", "gap-px", "grid", "md:grid-cols-3");

const stepItemClass = cx("bg-base-100", "md:p-8", "md:px-12", "p-6");

const stepIndexClass = cx(
	"text-base-content/40",
	"text-label",
	"tracking-label",
	"uppercase",
);

const stepTitleClass = cx(
	"font-semibold",
	"mt-8",
	"text-sm",
	"tracking-tab",
	"uppercase",
);

const stepBodyClass = cx(
	"leading-relaxed",
	"max-w-[14rem]",
	"mt-4",
	"text-base-content/50",
	"text-xs",
);

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
