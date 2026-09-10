import { type Context, Hono } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, cx, Footer, Main, Nav } from "#gateway/shared";
import { ApplicationsManager } from "#manager/applications";
import { JobsManager } from "#manager/jobs";
import { questionsFromSchema } from "#utility/questions";
import type { ApplicationAnswers } from "#utility/types";
import { JobApply, questionFieldName } from "./JobApply";
import { JobView } from "./JobView";

export const jobs = new Hono();

const perPage = 5;

const labelClass = cx("text-label", "tracking-label", "uppercase");

const jobsHeaderClass = cx("md:p-14", "md:px-12", "p-10", "px-6");

const jobsMetaRowClass = cx(
	labelClass,
	"mb-8 flex items-center justify-between text-base-content/50",
);

const jobsCountClass = cx("bg-base-200", "px-2");

const jobsHeadingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"md:text-[6rem]",
	"text-5xl",
	"tracking-[-0.06em]",
);

const jobsFilterSectionClass = cx("bg-base-100", "md:px-12", "p-6");

const jobsFilterRowClass = cx(
	"flex",
	"flex-col",
	"gap-4",
	"md:flex-row",
	"md:items-center",
	"md:justify-between",
);

const jobsSearchFormClass = cx("flex", "flex-1", "gap-4", "items-center");

const jobsSearchWrapClass = cx("flex-1", "max-w-xl", "relative");

const jobsSearchInputClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"h-12",
	"p-0",
	"placeholder:text-base-content/50",
	"text-sm",
	"w-full",
);

const jobsClearClass = cx(
	"-translate-y-1/2",
	"absolute",
	"hover:text-base-content",
	"right-0",
	"text-base-content/40",
	"text-xs",
	"top-1/2",
);

const jobsSearchButtonClass = cx(
	"bg-neutral",
	"border-0",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"h-12",
	"hover:bg-neutral/85",
	"px-6",
	"text-neutral-content",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
);

const jobsFilterButtonClass = cx(
	"bg-base-100",
	"border",
	"border-base-content",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"h-12",
	"hover:bg-base-200",
	"px-6",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
);

const jobsListSectionClass = cx(
	"bg-base-100",
	"flex-1",
	"md:px-12",
	"p-10",
	"px-6",
);

const jobsListClass = cx("border-base-300", "border-t");

const jobsEmptyClass = cx(
	"border-b",
	"border-base-300",
	"py-12",
	"text-base-content/50",
	"text-center",
	"text-sm",
);

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
	"md:px-2",
	"py-5",
	"transition-colors",
);

const jobTitleClass = cx("font-semibold", "md:text-base", "text-sm");

const jobDetailClass = cx(labelClass, "text-base-content/50");

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

const jobsPagerClass = cx("flex", "items-center", "justify-between", "mt-10");

const pagerLabelClass = cx(labelClass, "text-base-content/50");

const pagerNavClass = cx("flex", "gap-2", "items-center");

const pagerButtonClass = cx(
	"border",
	"border-base-content",
	"duration-150",
	"ease-out",
	"h-10",
	"hover:bg-base-200",
	"inline-flex",
	"items-center",
	"px-5",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
);

const pagerDisabledClass = cx(
	"border",
	"border-base-300",
	"h-10",
	"inline-flex",
	"items-center",
	"px-5",
	"text-base-content/30",
	"text-xs",
	"tracking-button",
	"uppercase",
);

const pagerPageClass = cx(
	"border",
	"border-base-content",
	"duration-150",
	"ease-out",
	"h-10",
	"hover:bg-base-200",
	"inline-flex",
	"items-center",
	"justify-center",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
	"w-10",
);

const pagerCurrentClass = cx(
	"bg-neutral",
	"border-0",
	"h-10",
	"inline-flex",
	"items-center",
	"justify-center",
	"text-neutral-content",
	"text-xs",
	"tracking-button",
	"uppercase",
	"w-10",
);

const filtersDialogClass = cx(
	"backdrop:bg-base-content/40",
	"bg-base-100",
	"border",
	"border-base-content",
	"max-w-2xl",
	"p-0",
	"w-[90vw]",
);

const filtersFormClass = cx("grid");

const filtersHeaderClass = cx(
	"border-b",
	"border-base-300",
	"flex",
	"items-center",
	"justify-between",
	"px-8",
	"py-5",
);

const filtersCloseClass = cx(
	"cursor-pointer",
	"hover:text-base-content",
	"text-base-content/50",
	"text-sm",
);

const filtersBodyClass = cx("gap-8", "grid", "md:grid-cols-2", "p-8");

const filtersFieldClass = cx("gap-2", "grid");

const filtersLabelClass = cx(labelClass, "text-base-content/60");

const filtersSelectClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"cursor-pointer",
	"focus:outline-none",
	"h-12",
	"p-0",
	"text-sm",
	"w-full",
);

const filtersInputClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"h-12",
	"p-0",
	"placeholder:text-base-content/50",
	"text-sm",
	"w-full",
);

const filtersModeFieldClass = cx("gap-2", "grid", "md:col-span-2");

const filtersModeGridClass = cx(
	labelClass,
	"grid grid-cols-3 border border-base-content text-center tracking-tab",
);

const filtersModeOptionClass = cx(
	"border-base-content",
	"border-r",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"hover:bg-base-200",
	"last:border-r-0",
	"p-3",
	"transition-colors",
);

const filtersModeCheckClass = cx("mr-2");

const filtersFooterClass = cx(
	"border-base-300",
	"border-t",
	"flex",
	"items-center",
	"justify-between",
	"px-8",
	"py-5",
);

const filtersClearClass = cx(
	"cursor-pointer",
	"hover:text-base-content",
	"text-base-content/50",
	"text-xs",
	"tracking-button",
	"uppercase",
);

const filtersApplyClass = cx(
	"bg-neutral",
	"border-0",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"h-12",
	"hover:bg-neutral/85",
	"px-10",
	"text-neutral-content",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
);

jobs.get("/", async (c: Context<AppEnv>) => {
	const page = Number(c.req.query("page") || "1");
	const query = (c.req.query("q") || "").trim();
	const search = `%${query}%`;

	const countStmt = c.env.db.prepare(`
    SELECT COUNT(*) as total 
    FROM jobs j 
    JOIN companies c ON j.company_id = c.id 
    WHERE j.status = 'active' 
    AND (j.title LIKE ?1 OR c.name LIKE ?1 OR j.location LIKE ?1)
  `);
	const countRes = await countStmt.bind(search).first<{ total: number }>();
	const total = countRes?.total || 0;

	const totalPages = Math.max(1, Math.ceil(total / perPage));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const offset = (currentPage - 1) * perPage;

	const jobsStmt = c.env.db.prepare(`
    SELECT j.id, j.title, c.name as company, j.location, j.salary_range as salary, j.job_type as type, j.slug, c.slug as company_slug 
    FROM jobs j 
    JOIN companies c ON j.company_id = c.id 
    WHERE j.status = 'active' 
    AND (j.title LIKE ?1 OR c.name LIKE ?1 OR j.location LIKE ?1)
    ORDER BY j.created_at DESC 
    LIMIT ?2 OFFSET ?3
  `);
	const jobsRes = await jobsStmt.bind(search, perPage, offset).all();
	const pageRoles = jobsRes.results || [];

	const qs = (k: string, v: string | number) => {
		const params = new URLSearchParams(c.req.query());
		params.set(k, String(v));
		return `?${params.toString()}`;
	};

	return c.render(
		<Fragment>
			<Nav user={c.get("user")} />
			<Main>
				<header class={cx("bg-dot-fade", jobsHeaderClass)}>
					<div class={jobsMetaRowClass}>
						<span>Network {"//"} Open Roles</span>
						<span class={jobsCountClass}>{total} results</span>
					</div>
					<h1 class={jobsHeadingClass}>
						Browse
						<br />
						open roles.
					</h1>
				</header>

				<section class={jobsFilterSectionClass}>
					<div class={jobsFilterRowClass}>
						<form action="/jobs" method="get" class={jobsSearchFormClass}>
							<div class={jobsSearchWrapClass}>
								<input
									name="q"
									type="text"
									placeholder="Search roles, companies, locations..."
									class={jobsSearchInputClass}
									value={query}
								/>
								{query && (
									<a href="/jobs" class={jobsClearClass}>
										✕
									</a>
								)}
							</div>
							<button type="submit" class={jobsSearchButtonClass}>
								Search
							</button>
						</form>
						<button
							type="button"
							onclick="document.getElementById('filters-modal').showModal()"
							class={jobsFilterButtonClass}
						>
							Custom Filters
						</button>
					</div>
				</section>

				<section class={jobsListSectionClass}>
					<ul class={jobsListClass}>
						{pageRoles.length === 0 ? (
							<li class={jobsEmptyClass}>No roles match your query.</li>
						) : (
							pageRoles.map((role) => (
								<li>
									<a
										href={`/applicant/jobs/${role.id}`}
										class={jobItemLinkClass}
									>
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
							))
						)}
					</ul>

					{totalPages > 1 && (
						<div class={jobsPagerClass}>
							<span class={pagerLabelClass}>
								Page {currentPage} of {totalPages}
							</span>
							<div class={pagerNavClass}>
								{currentPage > 1 ? (
									<a
										href={qs("page", currentPage - 1)}
										class={pagerButtonClass}
									>
										← Prev
									</a>
								) : (
									<span class={pagerDisabledClass}>← Prev</span>
								)}
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
									p === currentPage ? (
										<span class={pagerCurrentClass}>{p}</span>
									) : (
										<a href={qs("page", p)} class={pagerPageClass}>
											{p}
										</a>
									),
								)}
								{currentPage < totalPages ? (
									<a
										href={qs("page", currentPage + 1)}
										class={pagerButtonClass}
									>
										Next →
									</a>
								) : (
									<span class={pagerDisabledClass}>Next →</span>
								)}
							</div>
						</div>
					)}
				</section>

				<dialog id="filters-modal" class={filtersDialogClass}>
					<form method="dialog" class={filtersFormClass}>
						<div class={filtersHeaderClass}>
							<span class={filtersLabelClass}>
								System {"//"} Custom Filters
							</span>
							<button type="button" class={filtersCloseClass}>
								✕
							</button>
						</div>
						<div class={filtersBodyClass}>
							<div class={filtersFieldClass}>
								<label class={filtersLabelClass} for="f-type">
									Job Type
								</label>
								<select id="f-type" name="type" class={filtersSelectClass}>
									<option value="">Any</option>
									<option>Full-time</option>
									<option>Contract</option>
									<option>Part-time</option>
								</select>
							</div>
							<div class={filtersFieldClass}>
								<label class={filtersLabelClass} for="f-location">
									Location
								</label>
								<input
									id="f-location"
									name="location"
									type="text"
									placeholder="Remote, Berlin, NYC..."
									class={filtersInputClass}
								/>
							</div>
							<div class={filtersFieldClass}>
								<label class={filtersLabelClass} for="f-salary-min">
									Min Salary
								</label>
								<input
									id="f-salary-min"
									name="salary_min"
									type="text"
									placeholder="$80K"
									class={filtersInputClass}
								/>
							</div>
							<div class={filtersFieldClass}>
								<label class={filtersLabelClass} for="f-salary-max">
									Max Salary
								</label>
								<input
									id="f-salary-max"
									name="salary_max"
									type="text"
									placeholder="$200K"
									class={filtersInputClass}
								/>
							</div>
							<div class={filtersModeFieldClass}>
								<span class={filtersLabelClass}>Work Mode</span>
								<div class={filtersModeGridClass}>
									<label class={filtersModeOptionClass}>
										<input
											type="checkbox"
											name="mode"
											value="Remote"
											class={filtersModeCheckClass}
										/>{" "}
										Remote
									</label>
									<label class={filtersModeOptionClass}>
										<input
											type="checkbox"
											name="mode"
											value="Hybrid"
											class={filtersModeCheckClass}
										/>{" "}
										Hybrid
									</label>
									<label class={filtersModeOptionClass}>
										<input
											type="checkbox"
											name="mode"
											value="On-site"
											class={filtersModeCheckClass}
										/>{" "}
										On-site
									</label>
								</div>
							</div>
						</div>
						<div class={filtersFooterClass}>
							<button type="reset" class={filtersClearClass}>
								Clear all
							</button>
							<button type="submit" class={filtersApplyClass}>
								Apply Filters
							</button>
						</div>
					</form>
				</dialog>
			</Main>
			<Footer />
		</Fragment>,
	);
});

const UPLOAD_LIMIT = 1_000_000;

const fileToBase64 = async (file: File): Promise<string> => {
	const bytes = new Uint8Array(await file.arrayBuffer());
	let binary = "";
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
};

const activeJob = async (c: Context<AppEnv>, rawId: string) => {
	if (!/^\d+$/.test(rawId)) return null;
	return new JobsManager(c).getActiveJobWithCompany(Number(rawId));
};

const appliedState = async (c: Context<AppEnv>, jobId: number) => {
	const user = c.get("user");
	if (!user) return false;
	return new ApplicationsManager(c).hasApplied(jobId, user.id);
};

jobs.get("/:id", async (c: Context<AppEnv>) => {
	const job = await activeJob(c, c.req.param("id") ?? "");
	if (!job) return c.notFound();

	const applied = await appliedState(c, job.id);

	return c.render(
		<Fragment>
			<Nav user={c.get("user")} />
			<Main>
				<JobView job={job} applied={applied} />
			</Main>
			<Footer />
		</Fragment>,
	);
});

jobs.get("/:id/apply", async (c: Context<AppEnv>) => {
	const job = await activeJob(c, c.req.param("id") ?? "");
	if (!job) return c.notFound();

	if (await appliedState(c, job.id)) {
		return c.redirect(`/applicant/jobs/${job.id}`);
	}

	return c.render(
		<Fragment>
			<Nav user={c.get("user")} />
			<Main>
				<JobApply
					job={job}
					questions={questionsFromSchema(job.customFormSchema)}
				/>
			</Main>
			<Footer />
		</Fragment>,
	);
});

jobs.post("/:id/apply", async (c: Context<AppEnv>) => {
	const job = await activeJob(c, c.req.param("id") ?? "");
	if (!job) return c.notFound();

	const user = c.get("user");
	if (!user) return c.redirect("/login");

	if (await new ApplicationsManager(c).hasApplied(job.id, user.id)) {
		return c.redirect(`/applicant/jobs/${job.id}`, 303);
	}

	const questions = questionsFromSchema(job.customFormSchema);
	const form = await c.req.raw.formData();
	const answers: ApplicationAnswers = {};

	let error: string | null = null;

	const resume = form.get("resume");
	if (resume instanceof File && resume.size > 0) {
		if (resume.size > UPLOAD_LIMIT) {
			error = "Resume must be under 1 MB — please upload a smaller file.";
		} else {
			answers.resume = {
				name: resume.name,
				data: await fileToBase64(resume),
			};
		}
	}
	if (!error && !answers.resume) {
		error = "Please attach your resume (PDF, DOC, DOCX, TXT or RTF).";
	}

	for (const [index, question] of questions.entries()) {
		if (error) break;
		const name = questionFieldName(question, index);
		const entry = form.get(name);
		if (question.type === "file") {
			if (entry instanceof File && entry.size > 0) {
				if (entry.size > UPLOAD_LIMIT) {
					error = `"${question.label}" must be under 1 MB.`;
				} else {
					answers[question.id] = {
						name: entry.name,
						data: await fileToBase64(entry),
					};
				}
			} else if (question.required) {
				error = `"${question.label}" is required.`;
			}
		} else {
			const value = typeof entry === "string" ? entry.trim() : "";
			if (value !== "") {
				answers[question.id] = value;
			} else if (question.required) {
				error = `"${question.label}" is required.`;
			}
		}
	}

	if (error === null) {
		await new ApplicationsManager(c).create(job.id, user.id, answers);
		return c.redirect(`/applicant/jobs/${job.id}`, 303);
	}

	c.status(400);
	return c.render(
		<Fragment>
			<Nav user={user} />
			<Main>
				<JobApply job={job} questions={questions} error={error} />
			</Main>
			<Footer />
		</Fragment>,
	);
});
