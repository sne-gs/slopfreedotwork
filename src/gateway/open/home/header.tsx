import type { FC } from "hono/jsx";
import { cx, Link } from "#gateway/shared";

const heroClass = cx(
	"md:pb-20",
	"md:pt-14",
	"md:px-12",
	"overflow-hidden",
	"pb-16",
	"pt-10",
	"px-6",
	"relative",
);

const heroTopClass = cx(
	"flex",
	"items-center",
	"justify-between",
	"mb-8",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const heroCountClass = cx("bg-base-200", "px-2");

const heroLogoClass = cx("ml-[-3vw]", "w-[58%]");

const heroSphereClass = cx(
	"absolute",
	"h-40",
	"lg:h-120",
	"lg:w-120",
	"md:h-80",
	"md:w-80",
	"pointer-events-none",
	"right-0",
	"rounded-full",
	"sm:h-60",
	"sm:w-60",
	"top-0",
	"w-40",
	"xl:h-180",
	"xl:w-180",
	"z-10",
);

const heroTaglineClass = cx(
	"font-thin",
	"leading-relaxed",
	"max-w-[28rem]",
	"mt-8",
	"text-base-content/50",
	"text-lg",
);

const heroActionsClass = cx(
	"flex",
	"flex-wrap",
	"gap-4",
	"items-center",
	"mt-8",
);

const relativeWrapClass = cx("relative");

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
			<br class="hidden md:block" /> for real jobs.
		</p>
		<div class={heroActionsClass}>
			<Link variant="buttonBase" href="/register">
				Add your company
			</Link>
			<Link variant="buttonContrast" href="/jobs">
				Find a job
			</Link>
		</div>
	</header>
);
