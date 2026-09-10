import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, cx, Footer, Link, Main, Nav } from "#gateway/shared";
import {
	type ApplicationListRow,
	type ApplicationStatus,
	ApplicationsManager,
	applicationStatuses,
} from "#manager/applications";
import { JobsManager } from "#manager/jobs";
import { questionsFromSchema } from "#utility/questions";
import type {
	ApplicationAnswer,
	ApplicationAnswers,
	ApplicationFileValue,
} from "#utility/types";

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

const sampleResumeUrl = "https://pdfobject.com/pdf/sample.pdf";

const detailKickerClass = cx(labelClass, "text-base-content/50");

const detailSectionKickerClass = cx(labelClass, "mb-6", "text-base-content/50");

const detailMetaRowClass = cx(
	"flex",
	"flex-wrap",
	"gap-x-6",
	"gap-y-2",
	"items-center",
	"mt-6",
);

const detailGridClass = cx("gap-6", "grid", "md:grid-cols-3");

const detailFieldClass = cx("gap-2", "grid");

const detailValueClass = cx("font-mono", "text-sm");

const bioTextClass = cx(
	"leading-relaxed",
	"max-w-prose",
	"text-base-content/70",
);

const answerTextClass = cx("text-sm", "leading-relaxed");

const fileChipClass = cx(
	statusChipClass,
	"border-dashed",
	"text-base-content/60",
);

const statusButtonClass = cx(
	"border",
	"border-base-content",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"hover:bg-base-200",
	"px-4",
	"py-2",
	"text-label",
	"tracking-tab",
	"transition-colors",
	"uppercase",
);

const statusButtonActiveClass = cx(
	"bg-neutral",
	"hover:bg-neutral",
	"text-neutral-content",
);

const statusButtonsRowClass = cx("flex", "flex-wrap", "gap-2", "items-center");

const statusMessageClass = cx(labelClass);

const statusPendingClass = cx(labelClass, "text-base-content/40");

const statusOkClass = cx("text-success");

const statusErrClass = cx("text-error");

const resumeHeadRowClass = cx(
	"flex",
	"flex-wrap",
	"gap-x-6",
	"gap-y-2",
	"items-center",
	"mb-4",
);

const resumeOpenClass = cx(
	"[overflow-wrap:anywhere]",
	"hover:text-base-content",
	"text-base-content/60",
	"text-sm",
	"underline",
	"underline-offset-4",
);

const resumeFrameClass = cx(
	"bg-base-200",
	"border",
	"border-base-content",
	"p-2",
);

const resumeEmbedClass = cx("h-[720px]", "w-full");

const mediumIntl = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const mediumDate = (value: string | null): string =>
	value && value.length >= 10
		? mediumIntl.format(new Date(value.slice(0, 10)))
		: "—";

const parseAnswers = (raw: string | null): ApplicationAnswers => {
	if (!raw) return {};
	try {
		const parsed: unknown = JSON.parse(raw);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			return parsed as ApplicationAnswers;
		}
	} catch {
		return {};
	}
	return {};
};

const isFileValue = (
	value: ApplicationAnswer | undefined,
): value is ApplicationFileValue =>
	typeof value === "object" && value !== null && "data" in value;

interface ResumeEmbed {
	readonly src: string;
	readonly onFile: boolean;
	readonly fileName: string | null;
}

const resolveResume = (answers: ApplicationAnswers): ResumeEmbed => {
	const stored = answers.resume;
	if (isFileValue(stored) && stored.name.toLowerCase().endsWith(".pdf")) {
		return {
			src: `data:application/pdf;base64,${stored.data}`,
			onFile: true,
			fileName: stored.name,
		};
	}
	return {
		src: sampleResumeUrl,
		onFile: false,
		fileName: isFileValue(stored) ? stored.name : null,
	};
};

const DetailField = ({
	label,
	children,
}: {
	readonly label: string;
	readonly children: Child;
}) => (
	<div class={detailFieldClass}>
		<span class={detailKickerClass}>{label}</span>
		{children}
	</div>
);

const statusChipHtml = (status: ApplicationStatus): string =>
	String(
		html`<span class="${cx(statusChipClass, statusChipVariantClass(status))}">${status}</span>`,
	);

const statusButtonsHtml = (current: ApplicationStatus): string =>
	applicationStatuses
		.map((status) => {
			const cls = cx(
				statusButtonClass,
				status === current && statusButtonActiveClass,
			);
			return String(
				html`<button type="submit" name="status" value="${status}" class="${cls}">${status}</button>`,
			);
		})
		.join("");

const statusSavedResponse = (
	status: ApplicationStatus,
	message: string,
	ok: boolean,
): Response =>
	ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(statusChipHtml(status), {
			selector: "#application-status",
			mode: "inner",
		});
		stream.patchElements(statusButtonsHtml(status), {
			selector: "#status-buttons",
			mode: "inner",
		});
		stream.patchElements(
			String(
				html`<span class="${cx(labelClass, ok ? statusOkClass : statusErrClass)}">${message}</span>`,
			),
			{ selector: "#status-message", mode: "inner" },
		);
	});

applications.get("/:applicationId", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const applicationId = Number(c.req.param("applicationId"));
	if (!Number.isInteger(applicationId) || applicationId <= 0) {
		return c.notFound();
	}

	const company = await new JobsManager(c).getCompanyByOwnerId(user.id);
	if (!company) return c.notFound();

	const detail = await new ApplicationsManager(c).getByIdForCompanyAsync(
		applicationId,
		company.id,
	);
	if (!detail) return c.notFound();

	const questions = questionsFromSchema(detail.customFormSchema);
	const answers = parseAnswers(detail.formResponses);
	const resume = resolveResume(answers);

	return c.render(
		<Fragment>
			<Nav user={user} />
			<Main>
				<section
					class={cx(
						sectionClass,
						"flex",
						"gap-6",
						"items-start",
						"justify-between",
					)}
				>
					<div>
						<p class={detailKickerClass}>
							Recruiter {"//"} Applications // #{detail.id}
						</p>
						<h1 class={headingClass}>{detail.applicantName}</h1>
						<div class={detailMetaRowClass}>
							<span id="application-status" class={statusCellClass}>
								<span
									class={cx(
										statusChipClass,
										statusChipVariantClass(detail.status),
									)}
								>
									{detail.status}
								</span>
							</span>
							<span class={detailClass}>
								Applied {mediumDate(detail.appliedAt)}
							</span>
							<span class={detailClass}>for {detail.jobTitle}</span>
							{detail.jobStatus === "closed" && (
								<span class={cx(statusChipClass, statusChipMutedClass)}>
									Closed role
								</span>
							)}
						</div>
					</div>
					<Link variant="buttonBase" href="/recruiter/applications">
						<div class="i-pixelarticons:arrow-left mr-2 text-2xl" />
						Back to applications
					</Link>
				</section>

				<section class={sectionClass}>
					<p class={detailSectionKickerClass}>Applicant {"//"} Profile</p>
					<div class={detailGridClass}>
						<DetailField label="Email">
							<span class={detailValueClass}>{detail.applicantEmail}</span>
						</DetailField>
						<DetailField label="Member since">
							<span class={detailValueClass}>
								{mediumDate(detail.applicantSince)}
							</span>
						</DetailField>
						<DetailField label="Headline">
							<span class={detailValueClass}>
								{detail.applicantHeadline ?? "—"}
							</span>
						</DetailField>
					</div>
					<div class={cx(detailFieldClass, "mt-8", "max-w-prose")}>
						<span class={detailKickerClass}>Bio</span>
						<p class={bioTextClass}>{detail.applicantBio ?? "—"}</p>
					</div>
				</section>

				<section class={sectionClass}>
					<p class={detailSectionKickerClass}>Pipeline {"//"} Status</p>
					<form
						id="status-controls"
						class={cx("gap-4", "grid")}
						data-indicator:saving=""
						data-on:submit={`@post('/recruiter/applications/${detail.id}/status', {contentType: 'form'})`}
					>
						<div id="status-buttons" class={statusButtonsRowClass}>
							{applicationStatuses.map((status) => (
								<button
									type="submit"
									name="status"
									value={status}
									class={cx(
										statusButtonClass,
										status === detail.status && statusButtonActiveClass,
									)}
								>
									{status}
								</button>
							))}
						</div>
						<div class={cx("flex", "gap-4", "items-center")}>
							<span
								class={statusPendingClass}
								data-text="$saving ? 'Saving...' : ''"
							></span>
							<div
								id="status-message"
								class={statusMessageClass}
								aria-live="polite"
							></div>
						</div>
					</form>
				</section>

				<section class={sectionClass}>
					<p class={detailSectionKickerClass}>
						Responses {"//"} Custom questions
					</p>
					{questions.length === 0 ? (
						<p class={emptyClass}>This role didn't include custom questions.</p>
					) : (
						<div class={cx("gap-8", "grid")}>
							{questions.map((question) => {
								const answer = answers[question.id];
								return (
									<div class={detailFieldClass}>
										<span class={detailKickerClass}>{question.label}</span>
										{typeof answer === "string" && answer.trim() !== "" ? (
											<p class={answerTextClass}>{answer}</p>
										) : isFileValue(answer) ? (
											<span class={fileChipClass}>{answer.name}</span>
										) : (
											<p class={cx(answerTextClass, "text-base-content/40")}>
												No answer
											</p>
										)}
									</div>
								);
							})}
						</div>
					)}
				</section>

				<section class={sectionClass}>
					<p class={detailSectionKickerClass}>Resume {"//"} PDF</p>
					<div class={resumeHeadRowClass}>
						{resume.onFile ? (
							<span class={statusChipClass}>On file: {resume.fileName}</span>
						) : (
							<span class={cx(statusChipClass, statusChipMutedClass)}>
								Sample — no PDF resume stored yet
							</span>
						)}
						{resume.onFile ? (
							<a
								href={resume.src}
								download={resume.fileName ?? "resume.pdf"}
								class={resumeOpenClass}
							>
								Download resume
							</a>
						) : (
							<a
								href={resume.src}
								target="_blank"
								rel="noreferrer noopener"
								class={resumeOpenClass}
							>
								Open in new tab
							</a>
						)}
					</div>
					<div class={resumeFrameClass}>
						<iframe
							src={resume.src}
							title={`${detail.applicantName} resume`}
							class={resumeEmbedClass}
						/>
					</div>
				</section>
			</Main>
			<Footer />
		</Fragment>,
	);
});

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

applications.post("/:applicationId/status", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const applicationId = Number(c.req.param("applicationId"));
	if (!Number.isInteger(applicationId) || applicationId <= 0) {
		return c.notFound();
	}

	const body = await c.req.parseBody();
	const rawStatus = body.status;
	const status =
		typeof rawStatus === "string" &&
		(applicationStatuses as readonly string[]).includes(rawStatus)
			? (rawStatus as ApplicationStatus)
			: null;

	if (!status) {
		return ServerSentEventGenerator.stream((stream) => {
			stream.patchElements(
				String(
					html`<span class="${cx(labelClass, statusErrClass)}">Invalid status</span>`,
				),
				{ selector: "#status-message", mode: "inner" },
			);
		});
	}

	const company = await new JobsManager(c).getCompanyByOwnerId(user.id);
	if (!company) return c.notFound();

	const updated = await new ApplicationsManager(c).updateStatusAsync(
		applicationId,
		company.id,
		status,
	);
	if (!updated) return c.notFound();

	return statusSavedResponse(status, `Status set to ${status}`, true);
});
