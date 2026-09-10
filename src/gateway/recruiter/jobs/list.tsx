import { type Context, Hono } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, cx, Footer, Link, Main, Nav, Row } from "#gateway/shared";
import { type JobRow, JobsManager } from "#manager/jobs";

export const list = new Hono();

const listSectionClass = cx("bg-base-100", "h-full", "md:p-12", "p-10", "px-6");

const listHeaderClass = cx("flex", "items-start", "justify-between", "mb-8");

const listHeadingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"text-5xl",
	"tracking-[-0.06em]",
);

const listMetaClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const jobListClass = cx("border-base-300", "border-t");

const jobItemClass = cx(
	"border-b",
	"border-base-300",
	"gap-3",
	"grid",
	"hover:bg-base-200",
	"items-center",
	"md:gap-6",
	"md:grid-cols-[2fr_auto_1.5fr_auto_auto]",
	"p-5",
	"px-2",
);

const jobTitleClass = cx("font-semibold", "text-base");

const jobTitlePlaceholderClass = cx(
	"font-semibold",
	"italic",
	"text-base",
	"text-base-content/50",
);

const statusCellClass = cx("flex", "gap-2", "items-center");

const statusChipClass = cx(
	"border",
	"border-base-content",
	"inline-flex",
	"items-center",
	"px-4",
	"py-1",
	"text-label",
	"tracking-tab",
	"uppercase",
	"w-max",
);

const statusChipDraftClass = cx("border-dashed", "text-base-content/60");

const statusChipDraftInProgressClass = cx(
	"border-dashed",
	"border-info",
	"text-info",
);

const jobMetaClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const emptyClass = cx("py-6", "text-base-content/50", "text-sm");

const statusLabel = (status: JobRow["status"]): string =>
	status === "draft" ? "Draft" : status === "active" ? "Live" : "Closed";

const intl = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

const JobListItem = ({
	job,
	hasDraft,
}: {
	readonly job: JobRow;
	readonly hasDraft: boolean;
}) => {
	const title = job.title.trim();
	return (
		<li class={jobItemClass}>
			{title ? (
				<span class={jobTitleClass}>{title}</span>
			) : (
				<span class={jobTitlePlaceholderClass}>
					(Unnamed Job Posting #{job.id})
				</span>
			)}
			<div class={statusCellClass}>
				<span
					class={cx(
						statusChipClass,
						job.status === "draft" && statusChipDraftClass,
					)}
				>
					{statusLabel(job.status)}
				</span>
				{hasDraft && (
					<span class={cx(statusChipClass, statusChipDraftInProgressClass)}>
						Draft in progress
					</span>
				)}
			</div>
			<span class={jobMetaClass}>
				{[job.location, job.jobType].filter(Boolean).join(" // ") || "—"}
			</span>
			<span class={jobMetaClass}>
				{job.updatedAt
					? `edited ${intl.format(new Date(job.updatedAt.slice(0, 10)))}`
					: ""}
			</span>
			<Row>
				<a
					href={`jobs/edit/${job.id}`}
					class="px-2 text-info/80 hover:text-info"
				>
					<div class="i-pixelarticons:edit-box text-2xl" />
				</a>
				<button
					type="button"
					class="cursor-pointer border-0 bg-transparent px-2 text-error/80 hover:text-error"
					data-on:click={`confirm('Delete this job and all its applications?') && @post('/recruiter/jobs/delete/${job.id}')`}
				>
					<div class="i-pixelarticons:close text-2xl" />
				</button>
			</Row>
		</li>
	);
};

list.get("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	const jobs = company ? await mgr.listByCompanyId(company.id) : [];
	const draftParents = company
		? await mgr.draftParentIdsByCompany(company.id)
		: new Set<number>();

	return c.render(
		<Fragment>
			<Nav user={user} />
			<Main>
				<section class={listSectionClass}>
					<header class={listHeaderClass}>
						<div>
							<p class={listMetaClass}>Recruiter // Jobs</p>
							<h1 class={listHeadingClass}>Your jobs</h1>
						</div>
						<Link variant="buttonBase" href="/recruiter/jobs/add" size="lg">
							<div class="i-pixelarticons:plus mr-2 text-2xl text-success" />
							New job
						</Link>
					</header>
					{company ? (
						jobs.length > 0 ? (
							<ul class={jobListClass}>
								{jobs.map((job) => (
									<JobListItem job={job} hasDraft={draftParents.has(job.id)} />
								))}
							</ul>
						) : (
							<p class={emptyClass}>
								Nothing posted yet. Click "New job" to start a draft — it
								autosaves as you type.
							</p>
						)
					) : (
						<p class={emptyClass}>No company linked to your account yet.</p>
					)}
				</section>
			</Main>
			<Footer />
		</Fragment>,
	);
});
