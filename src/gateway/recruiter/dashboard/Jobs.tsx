import { JobList } from "#gateway/recruiter/jobs";
import { Caption, Link } from "#gateway/shared";
import type { Job } from "#manager/analysis";

export const Jobs = ({ jobs }: { readonly jobs: readonly Job[] }) => {
	return (
		<section class="flex-1 bg-base-100 p-6">
			<div class="mb-8 flex items-start justify-between gap-6">
				<Caption labels={["Jobs", "Recent postings"]} />
				<Link variant="bordered" href="/recruiter/jobs" size="sm">
					<span>View all</span>
					<span class="i-pixelarticons:arrow-right ml-1" />
				</Link>
			</div>
			<JobList jobs={jobs} drafts={new Set()} />
		</section>
	);
};
