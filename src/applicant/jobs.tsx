import { type Context, Hono } from "hono";
import { type AppEnv, Footer, Nav } from "../shared";

export const jobs = new Hono();

const perPage = 5;

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
		<div class="flex min-h-screen flex-col bg-base-100 font-sans text-base-content">
			<Nav user={c.get("user")} />
			<header class="border-b border-solid border-base-300 px-6 py-10 md:px-12 md:py-14 bg-dot-fade">
				<div class="mb-8 flex items-center justify-between text-label case-upper tracking-label text-base-content/50">
					<span>Network // Open Roles</span>
					<span class="bg-base-200 py-1 px-2">{total} results</span>
				</div>
				<h1 class="text-5xl font-medium leading-[0.9] tracking-[-0.06em] md:text-7xl">
					Browse
					<br />
					open roles.
				</h1>
			</header>

			<section class="border-b border-solid border-base-300 px-6 py-6 md:px-12">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<form
						action="/jobs"
						method="get"
						class="flex flex-1 items-center gap-4"
					>
						<div class="relative flex-1 max-w-xl">
							<input
								name="q"
								type="text"
								placeholder="Search roles, companies, locations..."
								class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
								defaultValue={query}
							/>
							{query && (
								<a
									href="/jobs"
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
					<button
						type="button"
						onclick="document.getElementById('filters-modal').showModal()"
						class="h-12 px-6 border border-solid border-base-content bg-base-100 text-xs case-upper tracking-button transition-colors hover:bg-base-200 cursor-pointer"
					>
						Custom Filters
					</button>
				</div>
			</section>

			<section class="px-6 md:px-12 py-10 flex-1">
				<ul class="border-t border-solid border-base-300">
					{pageRoles.length === 0 ? (
						<li class="border-b border-solid border-base-300 py-12 text-center text-sm text-base-content/50">
							No roles match your query.
						</li>
					) : (
						pageRoles.map((role) => (
							<li>
								<a
									href={`/jobs/${role.slug}`}
									class="grid items-center gap-3 border-b border-solid border-base-300 py-5 transition-colors hover:bg-base-200 md:grid-cols-[2.2fr_1.4fr_1.4fr_1.1fr_auto_2rem] md:gap-6 md:px-2"
								>
									<span class="text-sm font-semibold md:text-base">
										{role.title}
									</span>
									<span class="text-label case-upper tracking-label text-base-content/50">
										{role.company}
									</span>
									<span class="text-label case-upper tracking-label text-base-content/50">
										{role.location}
									</span>
									<span class="text-sm font-semibold">{role.salary}</span>
									<span class="inline-flex h-8 w-max items-center border border-solid border-base-content px-4 text-label case-upper tracking-tab">
										{role.type}
									</span>
									<span class="hidden text-right md:block" aria-hidden="true">
										→
									</span>
								</a>
							</li>
						))
					)}
				</ul>

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

			<dialog
				id="filters-modal"
				class="backdrop:bg-base-content/40 bg-base-100 border border-solid border-base-content p-0 max-w-2xl w-[90vw]"
			>
				<form method="dialog" class="grid">
					<div class="flex items-center justify-between border-b border-solid border-base-300 px-8 py-5">
						<span class="text-label case-upper tracking-label text-base-content/50">
							System // Custom Filters
						</span>
						<button
							type="button"
							class="text-sm text-base-content/50 hover:text-base-content cursor-pointer"
						>
							✕
						</button>
					</div>
					<div class="grid gap-8 p-8 md:grid-cols-2">
						<div class="grid gap-2">
							<label
								class="text-label case-upper tracking-label text-base-content/60"
								for="f-type"
							>
								Job Type
							</label>
							<select
								id="f-type"
								name="type"
								class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm focus:outline-none cursor-pointer"
							>
								<option value="">Any</option>
								<option>Full-time</option>
								<option>Contract</option>
								<option>Part-time</option>
							</select>
						</div>
						<div class="grid gap-2">
							<label
								class="text-label case-upper tracking-label text-base-content/60"
								for="f-location"
							>
								Location
							</label>
							<input
								id="f-location"
								name="location"
								type="text"
								placeholder="Remote, Berlin, NYC..."
								class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
							/>
						</div>
						<div class="grid gap-2">
							<label
								class="text-label case-upper tracking-label text-base-content/60"
								for="f-salary-min"
							>
								Min Salary
							</label>
							<input
								id="f-salary-min"
								name="salary_min"
								type="text"
								placeholder="$80K"
								class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
							/>
						</div>
						<div class="grid gap-2">
							<label
								class="text-label case-upper tracking-label text-base-content/60"
								for="f-salary-max"
							>
								Max Salary
							</label>
							<input
								id="f-salary-max"
								name="salary_max"
								type="text"
								placeholder="$200K"
								class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
							/>
						</div>
						<div class="grid gap-2 md:col-span-2">
							<span class="text-label case-upper tracking-label text-base-content/60">
								Work Mode
							</span>
							<div class="grid grid-cols-3 border border-solid border-base-content text-center text-label case-upper tracking-tab">
								<label class="border-r border-solid border-base-content px-3 py-3 cursor-pointer hover:bg-base-200">
									<input
										type="checkbox"
										name="mode"
										value="Remote"
										class="mr-2"
									/>{" "}
									Remote
								</label>
								<label class="border-r border-solid border-base-content px-3 py-3 cursor-pointer hover:bg-base-200">
									<input
										type="checkbox"
										name="mode"
										value="Hybrid"
										class="mr-2"
									/>{" "}
									Hybrid
								</label>
								<label class="px-3 py-3 cursor-pointer hover:bg-base-200">
									<input
										type="checkbox"
										name="mode"
										value="On-site"
										class="mr-2"
									/>{" "}
									On-site
								</label>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between border-t border-solid border-base-300 px-8 py-5">
						<button
							type="reset"
							class="text-xs case-upper tracking-button text-base-content/50 hover:text-base-content cursor-pointer"
						>
							Clear all
						</button>
						<button
							type="submit"
							class="h-12 px-10 border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85 cursor-pointer"
						>
							Apply Filters
						</button>
					</div>
				</form>
			</dialog>
			<Footer />
		</div>,
	);
});
