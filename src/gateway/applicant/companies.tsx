import { type Context, Hono } from "hono";
import { css, cx } from "hono/css";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, Footer, Main, Nav } from "#gateway/shared";

export const companies = new Hono();

const perPage = 12;

const labelClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
`;

const companiesHeaderClass = css`
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-14) var(--space-12);
    }
`;

const companiesMetaRowClass = css`
    ${labelClass}
    margin-bottom: var(--space-8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-content-faint);
`;

const companiesCountClass = css`
    background-color: var(--color-base-200);
    padding: 0 var(--space-2);
`;

const companiesHeadingClass = css`
    font-size: var(--text-5xl);
    font-weight: var(--weight-medium);
    line-height: 0.9;
    letter-spacing: -0.06em;
    @media (min-width: 768px) {
        font-size: 6rem;
    }
`;

const companiesSearchSectionClass = css`
		background-color: var(--color-base-100);
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-6) var(--space-12);
    }
`;

const companiesSearchFormClass = css`
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--space-4);
    max-width: 36rem;
`;

const companiesSearchWrapClass = css`
    position: relative;
    flex: 1;
`;

const companiesSearchInputClass = css`
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

const companiesClearClass = css`
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

const companiesSearchButtonClass = css`
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

const companiesListSectionClass = css`
		background-color: var(--color-base-100);
    flex: 1;
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-10) var(--space-12);
    }
`;

const companiesEmptyClass = css`
		background-color: var(--color-base-100);
    padding-block: var(--space-12);
    text-align: center;
    font-size: var(--text-sm);
    color: var(--color-content-faint);
`;

const companiesGridClass = css`
		background-color: var(--color-base-100);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1280px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const companyCardClass = css`
    display: flex;
    min-height: 8rem;
    flex-direction: column;
    justify-content: space-between;
    border: var(--line-width-default) solid var(--color-base-content);
    padding: var(--space-5);
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
`;

const companyNameClass = css`
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.2em;
`;

const companyRolesClass = css`
    ${labelClass}
    margin-top: var(--space-4);
    color: var(--color-content-faint);
`;

const companiesPagerClass = css`
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

companies.get("/", async (c: Context<AppEnv>) => {
	const page = Number(c.req.query("page") || "1");
	const query = (c.req.query("q") || "").trim();
	const search = `%${query}%`;

	const countStmt = c.env.slopfreeworkdb.prepare(`
    SELECT COUNT(DISTINCT c.id) as total 
    FROM companies c 
    WHERE c.name LIKE ?1
  `);
	const countRes = await countStmt.bind(search).first<{ total: number }>();
	const total = countRes?.total || 0;

	const totalPages = Math.max(1, Math.ceil(total / perPage));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const offset = (currentPage - 1) * perPage;

	const companiesStmt = c.env.slopfreeworkdb.prepare(`
    SELECT c.name, c.slug, c.description, COUNT(j.id) as open_roles 
    FROM companies c 
    LEFT JOIN jobs j ON c.id = j.company_id AND j.status = 'active' 
    WHERE c.name LIKE ?1 
    GROUP BY c.id, c.name, c.slug, c.description 
    ORDER BY c.created_at DESC 
    LIMIT ?2 OFFSET ?3
  `);
	const companiesRes = await companiesStmt.bind(search, perPage, offset).all();
	const pageCompanies = companiesRes.results || [];

	const qs = (k: string, v: string | number) => {
		const params = new URLSearchParams(c.req.query());
		params.set(k, String(v));
		return `?${params.toString()}`;
	};

	return c.render(
		<Fragment>
			<Nav user={c.get("user")} />
			<Main>
				<header class={cx("bg-dot-fade", companiesHeaderClass)}>
					<div class={companiesMetaRowClass}>
						<span>Network {"//"} Companies</span>
						<span class={companiesCountClass}>{total} results</span>
					</div>
					<h1 class={companiesHeadingClass}>
						Browse
						<br />
						companies.
					</h1>
				</header>

				<section class={companiesSearchSectionClass}>
					<form
						action="/companies"
						method="get"
						class={companiesSearchFormClass}
					>
						<div class={companiesSearchWrapClass}>
							<input
								name="q"
								type="text"
								placeholder="Search companies..."
								class={companiesSearchInputClass}
								value={query}
							/>
							{query && (
								<a href="/companies" class={companiesClearClass}>
									✕
								</a>
							)}
						</div>
						<button type="submit" class={companiesSearchButtonClass}>
							Search
						</button>
					</form>
				</section>

				<section class={companiesListSectionClass}>
					{pageCompanies.length === 0 ? (
						<div class={companiesEmptyClass}>
							No companies match your query.
						</div>
					) : (
						<div class={companiesGridClass}>
							{pageCompanies.map((company) => (
								<a
									key={company.slug}
									href={`/companies/${company.slug}`}
									class={companyCardClass}
								>
									<span class={companyNameClass}>{company.name}</span>
									<span class={companyRolesClass}>
										{company.open_roles} open roles
									</span>
								</a>
							))}
						</div>
					)}

					{totalPages > 1 && (
						<div class={companiesPagerClass}>
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
			</Main>
			<Footer />
		</Fragment>,
	);
});
