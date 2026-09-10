import type { FC } from "hono/jsx";
import { cx } from "#gateway/shared";

const registerSectionClass = cx(
	"bg-base-200",
	"grid",
	"md:p-12",
	"p-10",
	"place-items-center",
	"px-6",
);

const registerContainerClass = cx(
	"bg-base-100",
	"border",
	"border-base-content",
	"grid",
	"lg:grid-cols-[1.25fr_0.75fr]",
	"max-w-5xl",
	"w-full",
);

const registerHeaderClass = cx(
	"border-b",
	"border-base-content",
	"flex",
	"flex-col",
	"justify-between",
	"lg:border-b-0",
	"lg:border-r",
	"md:p-12",
	"min-h-96",
	"overflow-hidden",
	"p-6",
	"relative",
);

const registerSphereClass = cx(
	"absolute",
	"h-32",
	"right-[14%]",
	"rounded-full",
	"top-[24%]",
	"w-32",
);

const registerHeaderTopClass = cx(
	"flex",
	"items-center",
	"justify-between",
	"text-label",
	"tracking-label",
	"uppercase",
);

const registerHeadingWrapClass = cx("relative", "z-10");

const registerHeadingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"text-[clamp(3rem,6vw,5rem)]",
	"tracking-tighter",
);

const registerSubTextClass = cx("mt-8", "text-base-content/50", "text-sm");

const registerFooterClass = cx(
	"gap-4",
	"grid",
	"grid-cols-[auto_1fr_auto]",
	"items-center",
	"text-label",
	"tracking-rule",
	"uppercase",
);

const registerDividerClass = cx("bg-base-content/25", "h-px");

const registerFormClass = cx(
	"content-center",
	"gap-8",
	"grid",
	"md:p-12",
	"p-6",
);

const registerTabsClass = cx(
	"border",
	"border-base-content",
	"grid",
	"grid-cols-2",
	"text-center",
	"text-label",
	"tracking-tab",
	"uppercase",
);

const registerTabActiveClass = cx("border-base-content", "border-r", "p-3");

const registerTabClass = cx("p-3");

const registerFieldClass = cx("gap-4", "grid");

const registerLabelClass = cx(
	"text-base-content/60",
	"text-label",
	"tracking-label",
	"uppercase",
);

const registerInputClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"h-14",
	"p-0",
	"placeholder:text-base-content/50",
	"text-sm",
	"w-full",
);

const registerButtonClass = cx(
	"bg-neutral",
	"border-0",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"h-14",
	"hover:bg-neutral/85",
	"text-neutral-content",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
	"w-full",
);

const registerNoteClass = cx(
	"text-base-content/35",
	"text-note",
	"tracking-note",
	"uppercase",
);

export const Register: FC = () => (
	<section class={registerSectionClass}>
		<div class={registerContainerClass}>
			<header class={registerHeaderClass}>
				<div
					aria-hidden="true"
					class={cx("bg-sphere shadow-sphere", registerSphereClass)}
				></div>
				<div class={registerHeaderTopClass}>
					<span>System // Account</span>
					<span>90 / 106</span>
				</div>
				<div class={registerHeadingWrapClass}>
					<h2 class={registerHeadingClass}>
						Ready to
						<br />
						work?
					</h2>
					<p class={registerSubTextClass}>Join the talent network</p>
				</div>
				<div class={registerFooterClass}>
					<span>Slop Free</span>
					<span class={registerDividerClass}></span>
					<span>Talent Network</span>
				</div>
			</header>
			<form class={registerFormClass}>
				<div class={registerTabsClass}>
					<span class={registerTabActiveClass}>Account</span>
					<span class={registerTabClass}>Secure</span>
				</div>
				<div class={registerFieldClass}>
					<label class={registerLabelClass} for="cta-email">
						Email
					</label>
					<input
						class={registerInputClass}
						id="cta-email"
						name="email"
						type="email"
						placeholder="you@example.com"
						autocomplete="email"
						required
					/>
				</div>
				<button class={registerButtonClass} type="submit">
					Continue
				</button>
				<p class={registerNoteClass}>Applicant / Recruiter</p>
			</form>
		</div>
	</section>
);
