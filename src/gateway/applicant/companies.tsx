import { type Context, Hono } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, cx, Footer, Main, Nav } from "#gateway/shared";

export const companies = new Hono();

const perPage = 12;

const labelClass = cx("text-label", "tracking-label", "uppercase");

const companiesHeaderClass = cx("md:p-14", "md:px-12", "p-10", "px-6");

const companiesMetaRowClass = cx(
	labelClass,
	"mb-8 flex items-center justify-between text-base-content/50",
);

const companiesCountClass = cx("bg-base-200", "px-2");

const companiesHeadingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"md:text-[6rem]",
	"text-5xl",
	"tracking-[-0.06em]",
);

const companiesSearchSectionClass = cx("bg-base-100", "md:px-12", "p-6");

const companiesSearchFormClass = cx(
	"flex",
	"flex-1",
	"gap-4",
	"items-center",
	"max-w-xl",
);

const companiesSearchWrapClass = cx("flex-1", "relative");

const companiesSearchInputClass = cx(
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

const companiesClearClass = cx(
	"-translate-y-1/2",
	"absolute",
	"hover:text-base-content",
	"right-0",
	"text-base-content/40",
	"text-xs",
	"top-1/2",
);

const companiesSearchButtonClass = cx(
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

const companiesListSectionClass = cx(
	"bg-base-100",
	"flex-1",
	"md:px-12",
	"p-10",
	"px-6",
);

const companiesEmptyClass = cx(
	"bg-base-100",
	"py-12",
	"text-base-content/50",
	"text-center",
	"text-sm",
);

const companiesGridClass = cx(
	"bg-base-100",
	"gap-4",
	"grid",
	"grid-cols-1",
	"lg:grid-cols-3",
	"sm:grid-cols-2",
	"xl:grid-cols-4",
);

const companyCardClass = cx(
	"border",
	"border-base-content",
	"duration-150",
	"ease-out",
	"flex",
	"flex-col",
	"hover:bg-base-200",
	"justify-between",
	"min-h-32",
	"p-5",
	"transition-colors",
);

const companyNameClass = cx(
	"font-semibold",
	"text-sm",
	"tracking-[0.2em]",
	"uppercase",
);

const companyRolesClass = cx(labelClass, "mt-4 text-base-content/50");

const companiesPagerClass = cx(
	"flex",
	"items-center",
	"justify-between",
	"mt-10",
);

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

companies.get("/", async (c: Context<AppEnv>) => {
	const page = Number(c.req.query("page") || "1");
	const query = (c.req.query("q") || "").trim();
	const search = `%${query}%`;

	const countStmt = c.env.db.prepare(`
    SELECT COUNT(DISTINCT c.id) as total 
    FROM companies c 
    WHERE c.name LIKE ?1
  `);
	const countRes = await countStmt.bind(search).first<{ total: number }>();
	const total = countRes?.total || 0;

	const totalPages = Math.max(1, Math.ceil(total / perPage));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const offset = (currentPage - 1) * perPage;

	const companiesStmt = c.env.db.prepare(`
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
