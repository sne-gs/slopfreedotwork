import { Fragment } from "hono/jsx/jsx-runtime";
import { Col, cx, Link, Row, renderMarkdown } from "#gateway/shared";
import type { JobWithCompanyRow } from "#manager/jobs";

const viewClass = cx("bg-base-100", "h-full", "p-9");

const jobTitleClass = cx(
	"font-normal",
	"leading-tight",
	"m-0",
	"p-3",
	"text-5xl",
);

const jobContainerClass = cx("flex", "items-center", "px-4");

const jobMetaLabelClass = cx("font-bold", "p-3", "whitespace-nowrap");

const jobMetaValueClass = cx("p-3", "text-base");

const postedByClass = cx(
	"flex",
	"items-center",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const proseClass = cx(
	"[overflow-wrap:anywhere]",
	"border-b",
	"border-base-300",
	"border-t",
	"leading-normal",
	"markdown-prose",
	"p-4",
	"text-base",
);

const appliedChipClass = cx(
	"border",
	"border-base-content",
	"inline-flex",
	"items-center",
	"px-4",
	"py-1",
	"text-label",
	"text-success",
	"tracking-tab",
	"uppercase",
);

export interface JobViewProps {
	readonly job: JobWithCompanyRow;
	readonly applied: boolean;
}

export const JobView = ({ job, applied }: JobViewProps) => {
	const bodyHtml = renderMarkdown(job.description);

	return (
		<Fragment>
			<div class={viewClass}>
				<Col template="auto auto 1fr auto auto" gap="md">
					<div class={jobContainerClass}>
						<h1 class={jobTitleClass}>{job.title}</h1>
					</div>
					<Row gap="md">
						<div class={jobContainerClass}>
							<span class={jobMetaLabelClass}>Location</span>
							<span class={jobMetaValueClass}>{job.location ?? "—"}</span>
						</div>
						<div class={jobContainerClass}>
							<span class={jobMetaLabelClass}>Job Type</span>
							<span class={jobMetaValueClass}>{job.jobType ?? "—"}</span>
						</div>
					</Row>
					{bodyHtml ? (
						<div
							class={proseClass}
							dangerouslySetInnerHTML={{ __html: bodyHtml }}
						/>
					) : null}
					<Row template="1fr auto auto" gap="sm">
						<span class={postedByClass}>Posted by {job.companyName}</span>
						<Link variant="buttonBase" href="/applicant/jobs">
							Back
						</Link>
						{applied ? (
							<span class={appliedChipClass}>Applied</span>
						) : (
							<Link
								variant="buttonContrast"
								href={`/applicant/jobs/${job.id}/apply`}
							>
								Apply
							</Link>
						)}
					</Row>
				</Col>
			</div>
		</Fragment>
	);
};
