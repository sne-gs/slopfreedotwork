import { type Context, Hono } from "hono";
import { type AppEnv, Footer, Nav } from "../shared";

export const companies = new Hono();

const perPage = 12;

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
		<div class="flex min-h-screen flex-col bg-base-100 font-sans text-base-content">
			<Nav user={c.get("user")} />
			<header class="border-b border-solid border-base-300 px-6 py-10 md:px-12 md:py-14 bg-dot-fade">
				<div class="mb-8 flex items-center justify-between text-label case-upper tracking-label text-base-content/50">
					<span>Network // Companies</span>
					<span class="bg-base-200 py-1 px-2">{total} results</span>
				</div>
				<h1 class="text-5xl font-medium leading-[0.9] tracking-[-0.06em] md:text-7xl">
					Browse
					<br />
					companies.
				</h1>
			</header>

			<section class="border-b border-solid border-base-300 px-6 py-6 md:px-12">
				<form
					action="/companies"
					method="get"
					class="flex flex-1 items-center gap-4 max-w-xl"
				>
					<div class="relative flex-1">
						<input
							name="q"
							type="text"
							placeholder="Search companies..."
							class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
							defaultValue={query}
						/>
						{query && (
							<a
								href="/companies"
								class="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-base-content/40 hover:text-base-content"
							>
								✕
							</a>
						)}
					</div>
					<button
						type="submit"
						class="h-12 px-6 border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85 cursor-pointer"
					>
						Search
					</button>
				</form>
			</section>

			<section class="px-6 md:px-12 py-10 flex-1">
				{pageCompanies.length === 0 ? (
					<div class="border border-solid border-base-300 py-12 text-center text-sm text-base-content/50">
						No companies match your query.
					</div>
				) : (
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{pageCompanies.map((company) => (
							<a
								key={company.slug}
								href={`/companies/${company.slug}`}
								class="flex min-h-32 flex-col justify-between border border-solid border-base-content p-5 transition-colors hover:bg-base-200"
							>
								<span class="text-sm font-semibold case-upper tracking-[0.2em]">
									{company.name}
								</span>
								<span class="mt-4 text-label case-upper tracking-label text-base-content/50">
									{company.open_roles} open roles
								</span>
							</a>
						))}
					</div>
				)}

				{totalPages > 1 && (
					<div class="mt-10 flex items-center justify-between">
						<span class="text-label case-upper tracking-label text-base-content/50">
							Page {currentPage} of {totalPages}
						</span>
						<div class="flex items-center gap-2">
							{currentPage > 1 ? (
								<a
									href={qs("page", currentPage - 1)}
									class="h-10 inline-flex items-center px-5 border border-solid border-base-content text-xs case-upper tracking-button transition-colors hover:bg-base-200"
								>
									← Prev
								</a>
							) : (
								<span class="h-10 inline-flex items-center px-5 border border-solid border-base-300 text-xs case-upper tracking-button text-base-content/30">
									← Prev
								</span>
							)}
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
								p === currentPage ? (
									<span class="h-10 w-10 inline-flex items-center justify-center border-0 bg-neutral text-neutral-content text-xs case-upper tracking-button">
										{p}
									</span>
								) : (
									<a
										href={qs("page", p)}
										class="h-10 w-10 inline-flex items-center justify-center border border-solid border-base-content text-xs case-upper tracking-button transition-colors hover:bg-base-200"
									>
										{p}
									</a>
								),
							)}
							{currentPage < totalPages ? (
								<a
									href={qs("page", currentPage + 1)}
									class="h-10 inline-flex items-center px-5 border border-solid border-base-content text-xs case-upper tracking-button transition-colors hover:bg-base-200"
								>
									Next →
								</a>
							) : (
								<span class="h-10 inline-flex items-center px-5 border border-solid border-base-300 text-xs case-upper tracking-button text-base-content/30">
									Next →
								</span>
							)}
						</div>
					</div>
				)}
			</section>
			<Footer />
		</div>,
	);
});
