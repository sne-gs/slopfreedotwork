import { type Context, Hono } from "hono";
import { css, cx } from "hono/css";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, Footer, Main, Nav } from "#gateway/shared";
import { type JobRow, JobsManager } from "#manager/jobs";

export const list = new Hono();

const listSectionClass = css`
        background-color: var(--color-base-100);
        padding: var(--space-10) var(--space-6);
        @media (min-width: 768px) {
                padding: var(--space-12);
        }
`;

const listHeaderClass = css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-8);
`;

const listHeadingClass = css`
        font-size: var(--text-5xl);
        font-weight: var(--weight-medium);
        letter-spacing: -0.06em;
        line-height: 0.9;
`;

const listMetaClass = css`
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-label);
        color: var(--color-content-faint);
`;

const jobListClass = css`
        border-top: var(--line-width-default) solid var(--color-base-300);
`;

const jobItemClass = css`
        display: grid;
        align-items: center;
        gap: var(--space-3);
        border-bottom: var(--line-width-default) solid var(--color-base-300);
        padding: var(--space-5) var(--space-2);
        @media (min-width: 768px) {
                grid-template-columns: 2fr auto 1.5fr auto auto;
                gap: var(--space-6);
        }
        &:hover {
                background-color: var(--color-base-200);
        }
`;

const jobTitleClass = css`
        font-size: var(--text-base);
        font-weight: var(--weight-semibold);
`;

const jobMetaClass = css`
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-label);
        color: var(--color-content-faint);
`;

const statusChipClass = css`
        display: inline-flex;
        width: max-content;
        align-items: center;
        border: var(--line-width-default) solid var(--color-base-content);
        padding-inline: var(--space-4);
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-tab);
`;

const statusChipDraftClass = css`
        border-style: dashed;
        color: var(--color-content-muted);
`;

const emptyClass = css`
        font-size: var(--text-sm);
        color: var(--color-content-faint);
        padding: var(--space-6) 0;
`;

const statusLabel = (status: JobRow["status"]): string =>
	status === "draft" ? "Draft" : status === "active" ? "Live" : "Closed";

const JobListItem = ({ job }: { readonly job: JobRow }) => (
	<li class={jobItemClass}>
		<span class={jobTitleClass}>{job.title.trim() || "Untitled draft"}</span>
		<span
			class={cx(
				statusChipClass,
				job.status === "draft" && statusChipDraftClass,
			)}
		>
			{statusLabel(job.status)}
		</span>
		<span class={jobMetaClass}>
			{[job.location, job.jobType].filter(Boolean).join(" // ") || "—"}
		</span>
		<span class={jobMetaClass}>
			{job.updatedAt ? `edited ${job.updatedAt.slice(0, 10)}` : ""}
		</span>
		{job.status === "draft" ? (
			<a class={jobMetaClass} href="/recruiter/jobs/add">
				Continue editing →
			</a>
		) : (
			<span />
		)}
	</li>
);

list.get("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	const jobs = company ? await mgr.listByCompanyId(company.id) : [];

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
						<a href="/recruiter/jobs/add">+ New job</a>
					</header>
					{company ? (
						jobs.length > 0 ? (
							<ul class={jobListClass}>
								{jobs.map((job) => (
									<JobListItem job={job} />
								))}
							</ul>
						) : (
							<p class={emptyClass}>
								Nothing posted yet. Start a draft — it autosaves as you type.
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
