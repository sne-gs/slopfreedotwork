import type { FC } from "hono/jsx";
import { cx } from "#gateway/shared";

export interface Role {
	title: string;
	company: string;
	location: string;
	salary: string;
	type: string;
	slug: string;
}

interface JobsProps {
	roles: Role[];
}

const jobsSectionClass = cx("bg-base-100", "md:p-12", "p-10", "px-6");

const jobsHeaderClass = cx("flex", "items-center", "justify-between", "mb-8");

const jobsHeaderTextClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const jobsHeaderLinkClass = cx(
	"duration-150",
	"ease-out",
	"flex",
	"font-semibold",
	"gap-2",
	"hover:text-base-content/60",
	"items-center",
	"text-label",
	"tracking-label",
	"transition-colors",
	"underline",
	"underline-offset-4",
	"uppercase",
);

const jobsListClass = cx("border-base-300", "border-t");

const jobItemLinkClass = cx(
	"border-b",
	"border-base-300",
	"duration-150",
	"ease-out",
	"gap-3",
	"grid",
	"hover:bg-base-200",
	"items-center",
	"md:gap-6",
	"md:grid-cols-[2.2fr_1.4fr_1.4fr_1.1fr_auto_2rem]",
	"md:p-5",
	"md:px-2",
	"p-5",
	"px-2",
	"transition-colors",
);

const jobTitleClass = cx("font-semibold", "md:text-base", "text-sm");

const jobDetailClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const jobSalaryClass = cx("font-semibold", "text-sm");

const jobTypeClass = cx(
	"border",
	"border-base-content",
	"h-8",
	"inline-flex",
	"items-center",
	"px-4",
	"text-label",
	"tracking-tab",
	"uppercase",
	"w-max",
);

const jobArrowClass = cx("hidden", "md:block", "text-right");

export const Jobs: FC<JobsProps> = ({ roles }) => (
	<section class={jobsSectionClass}>
		<div class={jobsHeaderClass}>
			<span class={jobsHeaderTextClass}>Network // Open Roles</span>
			<a href="/jobs" class={jobsHeaderLinkClass}>
				View all roles <span aria-hidden="true">→</span>
			</a>
		</div>
		<ul class={jobsListClass}>
			{roles.map((role) => (
				<li key={role.slug}>
					<a href={`/jobs/${role.slug}`} class={jobItemLinkClass}>
						<span class={jobTitleClass}>{role.title}</span>
						<span class={jobDetailClass}>{role.company}</span>
						<span class={jobDetailClass}>{role.location}</span>
						<span class={jobSalaryClass}>{role.salary}</span>
						<span class={jobTypeClass}>{role.type}</span>
						<span class={jobArrowClass} aria-hidden="true">
							→
						</span>
					</a>
				</li>
			))}
		</ul>
	</section>
);
