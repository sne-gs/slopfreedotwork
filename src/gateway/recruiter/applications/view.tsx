import { type Context, Hono } from "hono";
import type { Child } from "hono/jsx";
import { Fragment } from "hono/jsx/jsx-runtime";
import { type AppEnv, cx, Footer, Link, Main, Nav } from "#gateway/shared";
import {
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

const labelClass = cx("text-label", "tracking-label", "uppercase");

const sectionClass = cx("bg-base-100", "md:p-12", "p-10", "px-6");

const headingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"text-5xl",
	"tracking-[-0.06em]",
);

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

const emptyClass = cx("py-6", "text-base-content/50", "text-sm");

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

const statusChipVariantClass = (status: ApplicationStatus): string => {
	if (status === "hired") return statusChipSuccessClass;
	if (status === "interview") return statusChipAccentClass;
	if (status === "rejected") return statusChipMutedClass;
	return "";
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

const sampleResumeUrl = "https://pdfobject.com/pdf/sample.pdf";

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

export const view = new Hono();

view.get("/", async (c: Context<AppEnv>) => {
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
