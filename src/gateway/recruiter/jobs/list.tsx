import { type Context, Hono } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import {
	Badge,
	Button,
	Caption,
	cx,
	Footer,
	Header,
	Icon,
	Link,
	Main,
	Nav,
	type ReqUsrEnv,
	shortDate,
} from "#gateway/shared";
import { JobsManager } from "#manager/jobs";

export const Table = () => {};

export interface Job {
	readonly id: number;
	readonly title: string;
	readonly location: string | null;
	readonly jobType: string | null;
	readonly status: "draft" | "active" | "closed";
	readonly updatedAt: string | null;
}

const JobListItem = ({
	job,
	hasDraft,
}: {
	readonly job: Job;
	readonly hasDraft: boolean;
}) => {
	const title = job.title.trim();
	return (
		<>
			<div class="flex flex-col justify-center gap-1 border-t border-t-base-300 md:border-none">
				{title ? (
					<div class="font-semibold">{title}</div>
				) : (
					<div class="font-semibold text-base-content/60 italic">
						(Unnamed Job Posting #{job.id})
					</div>
				)}
				<Caption
					labels={
						job.location && job.jobType ? [job.location, job.jobType] : []
					}
					separator="/"
				/>
			</div>
			<div class="flex items-center justify-end gap-2 border-t border-t-base-300 md:border-none">
				<Badge
					status={job.status === "active" ? "success" : "neutral"}
					border={job.status === "draft" ? "dashed" : "solid"}
				>
					{job.status === "draft"
						? "Draft"
						: job.status === "active"
							? "Live"
							: "Closed"}
				</Badge>
				{hasDraft && (
					<Badge status="info" border="dashed">
						Draft
					</Badge>
				)}
			</div>
			<div class="flex items-center">
				<Caption
					labels={
						job.updatedAt
							? [`edited ${shortDate(job.updatedAt.slice(0, 10))}`]
							: []
					}
				/>
			</div>

			<div class="flex items-center justify-end">
				<Link
					href={`jobs/edit/${job.id}`}
					status="info"
					variant="nav"
					size="sm"
				>
					<Icon name="i-pixelarticons:edit-box" />
				</Link>
				<Button
					size="sm"
					variant="text"
					status="error"
					data-on:click={`confirm('Delete this job and all its applications?') && @post('/recruiter/jobs/delete/${job.id}')`}
				>
					<Icon name="i-pixelarticons:close" />
				</Button>
			</div>
		</>
	);
};

export const JobList = ({
	jobs,
	drafts,
}: {
	readonly jobs: readonly Job[];
	readonly drafts: Set<number>;
}) => {
	if (jobs.length === 0) {
		return (
			<p class="py-6 text-base-content/50 text-sm">
				Nothing posted yet. Click "New job" to start a draft.
			</p>
		);
	}
	const classes = cx(
		"grid",
		"grid-cols-[1fr_1fr]",
		"border-b",
		"border-b-base-300",
		"bg-base-300",
		"[&>div]-bg-base-100",
		"[&>div]-px-4",
		"[&>div]-py-2",
		"md:grid-cols-[1fr_auto_auto_auto]",
		"md:gap-row-px",
		"md:border-t",
		"md:border-t-base-300",
	);
	return (
		<div class={classes}>
			{jobs.map((job) => (
				<JobListItem job={job} hasDraft={drafts.has(job.id)} />
			))}
		</div>
	);
};

export const list = new Hono();

list.get("/", async (c: Context<ReqUsrEnv>) => {
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
				<Header
					heading="Job postings"
					labels={["Recruiter", "Jobs"]}
					action={
						<Link variant="bordered" href="/recruiter/jobs/add" size="lg">
							<Icon name="i-pixelarticons:plus" />
							New job
						</Link>
					}
				/>
				<section class="flex-1 bg-base-100 p-12">
					{company ? (
						<JobList jobs={jobs} drafts={draftParents} />
					) : (
						<p class="py-6 text-base-content/50 text-sm">
							No company linked to your account yet.
						</p>
					)}
				</section>
			</Main>
			<Footer />
		</Fragment>,
	);
});
