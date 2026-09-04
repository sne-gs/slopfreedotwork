import { type Context, Hono } from "hono";
import { css, cx } from "hono/css";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, Footer, Main, Nav } from "#gateway/shared";

export const jobs = new Hono();

const perPage = 5;

const labelClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
`;

const jobsHeaderClass = css`
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-14) var(--space-12);
    }
`;

const jobsMetaRowClass = css`
    ${labelClass}
    margin-bottom: var(--space-8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-content-faint);
`;

const jobsCountClass = css`
    background-color: var(--color-base-200);
    padding: 0 var(--space-2);
`;

const jobsHeadingClass = css`
    font-size: var(--text-5xl);
    font-weight: var(--weight-medium);
    line-height: 0.9;
    letter-spacing: -0.06em;
    @media (min-width: 768px) {
        font-size: 6rem;
    }
`;

const jobsFilterSectionClass = css`
		background-color: var(--color-base-100);
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-6) var(--space-12);
    }
`;

const jobsFilterRowClass = css`
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const jobsSearchFormClass = css`
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--space-4);
`;

const jobsSearchWrapClass = css`
    position: relative;
    flex: 1;
    max-width: 36rem;
`;

const jobsSearchInputClass = css`
    height: var(--space-12);
    width: 100%;
    border: 0;
    border-bottom: var(--line-width-default) solid var(--color-base-content);
    background-color: transparent;
    padding: 0;
    font-size: var(--text-sm);
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: var(--color-content-faint);
    }
`;

const jobsClearClass = css`
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    font-size: var(--text-xs);
    color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
    &:hover {
        color: var(--color-base-content);
    }
`;

const jobsSearchButtonClass = css`
    height: var(--space-12);
    padding-inline: var(--space-6);
    border: 0;
    background-color: var(--color-neutral);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    color: var(--color-neutral-content);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: color-mix(in oklab, var(--color-neutral) 85%, transparent);
    }
`;

const jobsFilterButtonClass = css`
    height: var(--space-12);
    padding-inline: var(--space-6);
    border: var(--line-width-default) solid var(--color-base-content);
    background-color: var(--color-base-100);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
`;

const jobsListSectionClass = css`
		background-color: var(--color-base-100);
    flex: 1;
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-10) var(--space-12);
    }
`;

const jobsListClass = css`
    border-top: var(--line-width-default) solid var(--color-base-300);
`;

const jobsEmptyClass = css`
    border-bottom: var(--line-width-default) solid var(--color-base-300);
    padding-block: var(--space-12);
    text-align: center;
    font-size: var(--text-sm);
    color: var(--color-conent-faint);
`;

const jobItemLinkClass = css`
    display: grid;
    align-items: center;
    gap: var(--space-3);
    border-bottom: var(--line-width-default) solid var(--color-base-300);
    padding: var(--space-5) 0;
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
    @media (min-width: 768px) {
        grid-template-columns: 2.2fr 1.4fr 1.4fr 1.1fr auto var(--space-8);
        gap: var(--space-6);
        padding: var(--space-5) var(--space-2);
    }
`;

const jobTitleClass = css`
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    @media (min-width: 768px) {
        font-size: var(--text-base);
    }
`;

const jobDetailClass = css`
    ${labelClass}
    color: var(--color-content-faint);
`;

const jobSalaryClass = css`
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
`;

const jobTypeClass = css`
    display: inline-flex;
    height: var(--space-8);
    width: max-content;
    align-items: center;
    border: var(--line-width-default) solid var(--color-base-content);
    padding-inline: var(--space-4);
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tab);
`;

const jobArrowClass = css`
    display: none;
    text-align: right;
    @media (min-width: 768px) {
        display: block;
    }
`;

const jobsPagerClass = css`
    margin-top: var(--space-10);
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const pagerLabelClass = css`
    ${labelClass}
    color: var(--color-content-faint);
`;

const pagerNavClass = css`
    display: flex;
    align-items: center;
    gap: var(--space-2);
`;

const pagerButtonClass = css`
    display: inline-flex;
    height: var(--space-10);
    align-items: center;
    padding-inline: var(--space-5);
    border: var(--line-width-default) solid var(--color-base-content);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
`;

const pagerDisabledClass = css`
    display: inline-flex;
    height: var(--space-10);
    align-items: center;
    padding-inline: var(--space-5);
    border: var(--line-width-default) solid var(--color-base-300);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    color: color-mix(in oklab, var(--color-base-content) 30%, transparent);
`;

const pagerPageClass = css`
    display: inline-flex;
    width: var(--space-10);
    height: var(--space-10);
    align-items: center;
    justify-content: center;
    border: var(--line-width-default) solid var(--color-base-content);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
`;

const pagerCurrentClass = css`
    display: inline-flex;
    width: var(--space-10);
    height: var(--space-10);
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: var(--color-neutral);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    color: var(--color-neutral-content);
`;

const filtersDialogClass = css`
    width: 90vw;
    max-width: 42rem;
    border: var(--line-width-default) solid var(--color-base-content);
    background-color: var(--color-base-100);
    padding: 0;
    &::backdrop {
        background-color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
    }
`;

const filtersFormClass = css`
    display: grid;
`;

const filtersHeaderClass = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--line-width-default) solid var(--color-base-300);
    padding: var(--space-5) var(--space-8);
`;

const filtersCloseClass = css`
    font-size: var(--text-sm);
    color: var(--color-content-faint);
    cursor: pointer;
    &:hover {
        color: var(--color-base-content);
    }
`;

const filtersBodyClass = css`
    display: grid;
    gap: var(--space-8);
    padding: var(--space-8);
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const filtersFieldClass = css`
    display: grid;
    gap: var(--space-2);
`;

const filtersLabelClass = css`
    ${labelClass}
    color: var(--color-content-muted);
`;

const filtersSelectClass = css`
    height: var(--space-12);
    width: 100%;
    border: 0;
    border-bottom: var(--line-width-default) solid var(--color-base-content);
    background-color: transparent;
    padding: 0;
    font-size: var(--text-sm);
    cursor: pointer;
    &:focus {
        outline: none;
    }
`;

const filtersInputClass = css`
    height: var(--space-12);
    width: 100%;
    border: 0;
    border-bottom: var(--line-width-default) solid var(--color-base-content);
    background-color: transparent;
    padding: 0;
    font-size: var(--text-sm);
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: var(--color-content-faint);
    }
`;

const filtersModeFieldClass = css`
    display: grid;
    gap: var(--space-2);
    @media (min-width: 768px) {
        grid-column: span 2 / span 2;
    }
`;

const filtersModeGridClass = css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: var(--line-width-default) solid var(--color-base-content);
    text-align: center;
    ${labelClass}
    letter-spacing: var(--tracking-tab);
`;

const filtersModeOptionClass = css`
    padding: var(--space-3);
    border-right: var(--line-width-default) solid var(--color-base-content);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
    &:last-child {
        border-right: 0;
    }
`;

const filtersModeCheckClass = css`
    margin-right: var(--space-2);
`;

const filtersFooterClass = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: var(--line-width-default) solid var(--color-base-300);
    padding: var(--space-5) var(--space-8);
`;

const filtersClearClass = css`
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    color: var(--color-content-faint);
    cursor: pointer;
    &:hover {
        color: var(--color-base-content);
    }
`;

const filtersApplyClass = css`
    height: var(--space-12);
    padding-inline: var(--space-10);
    border: 0;
    background-color: var(--color-neutral);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    color: var(--color-neutral-content);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: color-mix(in oklab, var(--color-neutral) 85%, transparent);
    }
`;

jobs.get("/", async (c: Context<AppEnv>) => {
	const page = Number(c.req.query("page") || "1");
	const query = (c.req.query("q") || "").trim();
	const search = `%${query}%`;

	const countStmt = c.env.slopfreeworkdb.prepare(`
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

	const jobsStmt = c.env.slopfreeworkdb.prepare(`
    SELECT j.title, c.name as company, j.location, j.salary_range as salary, j.job_type as type, j.slug, c.slug as company_slug 
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
