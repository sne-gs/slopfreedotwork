import { type Context, Hono } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, cx, Footer, Main, Nav } from "#gateway/shared";
import {
	type ApplicationListRow,
	type ApplicationStatus,
	ApplicationsManager,
	applicationStatuses,
} from "#manager/applications";
import { JobsManager } from "#manager/jobs";

export const applications = new Hono();

const perPage = 10;

const defaultStatuses: readonly ApplicationStatus[] = ["submitted"];

const parseStatuses = (raw: readonly string[]): ApplicationStatus[] => {
	const selected = new Set(
		raw
			.flatMap((value) => value.split(","))
			.filter((value): value is ApplicationStatus =>
				(applicationStatuses as readonly string[]).includes(value),
			),
	);
	return applicationStatuses.filter((status) => selected.has(status));
};

const parsePage = (raw: string | undefined): number => {
	const parsed = Number(raw || "1");
	return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

interface ViewState {
	readonly q: string;
	readonly statuses: ApplicationStatus[];
	readonly includeClosed: boolean;
	readonly page: number;
}

const isDefaultStatuses = (statuses: ApplicationStatus[]): boolean =>
	statuses.length === 1 && statuses[0] === defaultStatuses[0];

const buildPath = (
	state: ViewState,
	overrides: Partial<ViewState> = {},
): string => {
	const merged = { ...state, ...overrides };
	const params = new URLSearchParams();
	if (merged.q) params.set("q", merged.q);
	if (!isDefaultStatuses(merged.statuses)) {
		params.set("status", merged.statuses.join(","));
	}
	if (merged.includeClosed) params.set("closed", "1");
	if (merged.page > 1) params.set("page", String(merged.page));
	const qs = params.toString();
	return qs ? `?${qs}` : "";
};

const labelClass = cx("text-label", "tracking-label", "uppercase");

const sectionClass = cx("bg-base-100", "md:p-12", "p-10", "px-6");

const headerMetaRowClass = cx(
	labelClass,
	"mb-8 flex items-center justify-between text-base-content/50",
);

const resultsCountClass = cx("bg-base-200", "px-2");

const headingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"text-5xl",
	"tracking-[-0.06em]",
);

const filterRowClass = cx(
	"flex",
	"flex-col",
	"gap-4",
	"md:flex-row",
	"md:items-center",
	"md:justify-between",
);

const searchFormClass = cx("flex", "flex-1", "gap-4", "items-center");

const searchWrapClass = cx("max-w-xl", "relative", "w-full");

const searchInputClass = cx(
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

const searchClearClass = cx(
	"-translate-y-1/2",
	"absolute",
	"hover:text-base-content",
	"right-0",
	"text-base-content/40",
	"text-xs",
	"top-1/2",
);

const searchButtonClass = cx(
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

const filtersButtonClass = cx(
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

const stateRowClass = cx(
	labelClass,
	"mb-6 flex flex-wrap gap-x-6 gap-y-2 text-base-content/50",
);

const listClass = cx("border-base-300", "border-t");

const rowLinkClass = cx(
	"border-b",
	"border-base-300",
	"duration-150",
	"ease-out",
	"gap-3",
	"grid",
	"hover:bg-base-200",
	"items-center",
	"md:gap-6",
	"md:grid-cols-[1.5fr_1.3fr_1.3fr_auto_auto_2rem]",
	"md:px-2",
	"py-5",
	"transition-colors",
);

const applicantNameClass = cx("font-semibold", "md:text-base", "text-sm");

const applicantHeadlineClass = cx(labelClass, "mt-1 text-base-content/40");

const detailClass = cx(
	labelClass,
	"[overflow-wrap:anywhere]",
	"text-base-content/50",
);

const statusCellClass = cx("flex", "flex-wrap", "gap-2", "items-center");

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

const statusChipMutedClass = cx("border-dashed", "text-base-content/60");

const statusChipAccentClass = cx("border-info", "text-info");

const statusChipSuccessClass = cx("border-success", "text-success");

const arrowClass = cx("hidden", "md:block", "text-right");

const emptyClass = cx("py-6", "text-base-content/50", "text-sm");

const pagerClass = cx("flex", "items-center", "justify-between", "mt-10");

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

const filtersBodyClass = cx("gap-8", "grid", "p-4");

const filtersFieldClass = cx("gap-3", "grid");

const filtersLabelClass = cx(labelClass, "text-base-content/60");

const filtersOptionGridClass = cx("gap-2", "grid", "md:grid-cols-3");

const filtersOptionClass = cx(
	"border",
	"border-base-content",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"flex",
	"gap-2",
	"hover:bg-base-200",
	"items-center",
	"p-3",
	"select-none",
	"text-label",
	"tracking-tab",
	"transition-colors",
	"uppercase",
);

const filtersCheckboxClass = cx("accent-base-content", "cursor-pointer");

const filtersFooterClass = cx(
	"border-base-300",
	"border-t",
	"flex",
	"items-center",
	"justify-between",
	"px-8",
	"py-5",
);

const filtersResetClass = cx(
	"cursor-pointer",
	"hover:text-base-content",
	"no-underline",
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

const intl = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

const appliedDate = (value: string | null): string =>
	value && value.length >= 10
		? `applied ${intl.format(new Date(value.slice(0, 10)))}`
		: "—";

const statusChipVariantClass = (status: ApplicationStatus): string => {
	if (status === "hired") return statusChipSuccessClass;
	if (status === "interview") return statusChipAccentClass;
	if (status === "rejected") return statusChipMutedClass;
	return "";
};

const ApplicationListItem = ({
	application,
}: {
	readonly application: ApplicationListRow;
}) => (
	<li>
		<a href={`/recruiter/applications/${application.id}`} class={rowLinkClass}>
			<div>
				<span class={applicantNameClass}>{application.applicantName}</span>
				{application.applicantHeadline && (
					<div class={applicantHeadlineClass}>
						{application.applicantHeadline}
					</div>
				)}
			</div>
			<span class={detailClass}>{application.applicantEmail}</span>
			<span class={detailClass}>{application.jobTitle}</span>
			<div class={statusCellClass}>
				<span
					class={cx(
						statusChipClass,
						statusChipVariantClass(application.status),
					)}
				>
					{application.status}
				</span>
				{application.jobStatus === "closed" && (
					<span class={cx(statusChipClass, statusChipMutedClass)}>
						Closed role
					</span>
				)}
			</div>
			<span class={detailClass}>{appliedDate(application.appliedAt)}</span>
			<span class={arrowClass} aria-hidden="true">
				→
			</span>
		</a>
	</li>
);

applications.get("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const query = (c.req.query("q") || "").trim();
	const includeClosed = c.req.query("closed") === "1";
	const parsedStatuses = parseStatuses(c.req.queries("status") || []);
	const statuses =
		parsedStatuses.length > 0 ? parsedStatuses : [...defaultStatuses];
	const page = parsePage(c.req.query("page"));

	const company = await new JobsManager(c).getCompanyByOwnerId(user.id);

	let total = 0;
	let rows: ApplicationListRow[] = [];
	let currentPage = page;

	if (company) {
		const manager = new ApplicationsManager(c);
		const filter = {
			companyId: company.id,
			search: query,
			statuses,
			includeClosed,
		};
		total = await manager.countByCompanyAsync(filter);
		currentPage = Math.min(
			Math.max(1, page),
			Math.max(1, Math.ceil(total / perPage)),
		);
		rows = await manager.listByCompanyAsync({
			...filter,
			limit: perPage,
			offset: (currentPage - 1) * perPage,
		});
	}

	const totalPages = Math.max(1, Math.ceil(total / perPage));
	const state: ViewState = {
		q: query,
		statuses,
		includeClosed,
		page: currentPage,
	};
	const hasFilters =
		query !== "" || !isDefaultStatuses(statuses) || includeClosed;

	return c.render(
		<Fragment>
			<Nav user={user} />
			<Main>
				<section class={sectionClass}>
					<div class={headerMetaRowClass}>
						<span>Recruiter {"//"} Applications</span>
						<span class={resultsCountClass}>{total} results</span>
					</div>
					<h1 class={headingClass}>Applicant pipeline.</h1>
				</section>

				<section class={cx(sectionClass, "md:py-8", "py-6")}>
					<div class={filterRowClass}>
						<form
							action="/recruiter/applications"
							method="get"
							class={searchFormClass}
						>
							<input type="hidden" name="status" value={statuses.join(",")} />
							{includeClosed && <input type="hidden" name="closed" value="1" />}
							<div class={searchWrapClass}>
								<input
									name="q"
									type="text"
									placeholder="Search applicants, emails, roles..."
									class={searchInputClass}
									value={query}
								/>
								{query && (
									<a
										href={`/recruiter/applications${buildPath(state, { q: "", page: 1 })}`}
										class={searchClearClass}
										aria-label="Clear search"
									>
										✕
									</a>
								)}
							</div>
							<button type="submit" class={searchButtonClass}>
								Search
							</button>
						</form>
						<button
							type="button"
							onclick="document.getElementById('applications-filters-modal').showModal()"
							class={filtersButtonClass}
						>
							Filters
						</button>
					</div>
				</section>

				<section class={cx(sectionClass, "flex-1")}>
					<div class={stateRowClass}>
						<span>
							Pipeline {"//"} status: {statuses.join(", ")}
						</span>
						<span>
							{includeClosed ? "Closed roles: shown" : "Closed roles: hidden"}
						</span>
					</div>
					{company ? (
						rows.length > 0 ? (
							<ul class={listClass}>
								{rows.map((application) => (
									<ApplicationListItem application={application} />
								))}
							</ul>
						) : (
							<p class={emptyClass}>
								{hasFilters
									? "No applications match your search and filters."
									: "No applications yet. They'll show up here as candidates apply."}
							</p>
						)
					) : (
						<p class={emptyClass}>No company linked to your account yet.</p>
					)}

					{totalPages > 1 && (
						<div class={pagerClass}>
							<span class={pagerLabelClass}>
								Page {currentPage} of {totalPages}
							</span>
							<div class={pagerNavClass}>
								{currentPage > 1 ? (
									<a
										href={`/recruiter/applications${buildPath(state, { page: currentPage - 1 })}`}
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
										<a
											href={`/recruiter/applications${buildPath(state, { page: p })}`}
											class={pagerPageClass}
										>
											{p}
										</a>
									),
								)}
								{currentPage < totalPages ? (
									<a
										href={`/recruiter/applications${buildPath(state, { page: currentPage + 1 })}`}
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

				<dialog id="applications-filters-modal" class={filtersDialogClass}>
					<form
						action="/recruiter/applications"
						method="get"
						class={filtersFormClass}
					>
						<input type="hidden" name="q" value={query} />
						<div class={filtersHeaderClass}>
							<span class={filtersLabelClass}>Pipeline {"//"} Filters</span>
							<button
								type="button"
								class={filtersCloseClass}
								onclick="document.getElementById('applications-filters-modal').close()"
							>
								✕
							</button>
						</div>
						<div class={filtersBodyClass}>
							<div class={filtersFieldClass}>
								<span class={filtersLabelClass}>Application status</span>
								<div class={filtersOptionGridClass}>
									{applicationStatuses.map((status) => (
										<label class={filtersOptionClass}>
											<input
												type="checkbox"
												name="status"
												value={status}
												checked={statuses.includes(status)}
												class={filtersCheckboxClass}
											/>
											{status}
										</label>
									))}
								</div>
							</div>
							<label class={cx(filtersOptionClass, "w-max")}>
								<input
									type="checkbox"
									name="closed"
									value="1"
									checked={includeClosed}
									class={filtersCheckboxClass}
								/>
								Include closed roles
							</label>
						</div>
						<div class={filtersFooterClass}>
							<a
								href={`/recruiter/applications${buildPath(state, {
									statuses: [...defaultStatuses],
									includeClosed: false,
									page: 1,
								})}`}
								class={filtersResetClass}
							>
								Reset to defaults
							</a>
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
