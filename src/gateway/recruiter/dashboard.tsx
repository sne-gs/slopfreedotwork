import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { Fragment } from "hono/jsx/jsx-runtime";
import {
	type AppEnv,
	Button,
	cx,
	Footer,
	Link,
	Main,
	Nav,
	Row,
	TextInput,
} from "#gateway/shared";
import { AnalysisManager, type RecentJobRow } from "#manager/analysis";

export const dashboard = new Hono();

interface RecruiterRow {
	readonly email: string;
	readonly name: string | null;
	readonly emailVerified: number;
	readonly createdAt: string | null;
}

interface CompanyRow {
	readonly id: number;
	readonly name: string;
	readonly slug: string;
	readonly logoUrl: string | null;
	readonly website: string | null;
	readonly description: string | null;
	readonly createdAt: string | null;
}

const panelClass = cx("bg-base-100", "md:p-12", "p-10", "px-6");

const panelHeaderClass = cx("flex", "gap-6", "items-start", "justify-between");

const kickerClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const sectionKickerClass = cx(
	"mb-6",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const pageHeadingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"text-5xl",
	"tracking-[-0.06em]",
);

const panelHeadingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"text-3xl",
	"tracking-[-0.06em]",
);

const companyGridClass = cx(
	"gap-10",
	"grid",
	"lg:grid-cols-[1.2fr_1.1fr_0.5fr]",
);

const dividerCellClass = cx("lg:border-base-300", "lg:border-l", "lg:pl-10");

const identityClass = cx("flex", "gap-5", "items-center");

const logoFrameClass = cx(
	"bg-base-200",
	"border",
	"border-base-content",
	"grid",
	"h-16",
	"place-items-center",
	"shrink-0",
	"w-16",
);

const logoImgClass = cx(
	"h-full",
	"object-contain",
	"p-1",
	"w-full",
	"flex",
	"items-center",
	"justify-center",
);

const logoFallbackClass = cx("font-medium", "text-2xl");

const companyNameClass = cx(
	"font-semibold",
	"leading-tight",
	"text-2xl",
	"m-0",
);

const websiteLinkClass = cx(
	"[overflow-wrap:anywhere]",
	"hover:text-base-content",
	"text-base-content/60",
	"text-sm",
	"underline",
	"underline-offset-4",
);

const aboutTextClass = cx(
	"leading-relaxed",
	"max-w-prose",
	"text-base-content/70",
);

const metaValueClass = cx("font-mono", "text-sm");

const fieldClass = cx("gap-2", "grid");

const fieldStackClass = cx("gap-6", "grid");

const profileGridClass = cx("gap-10", "grid", "lg:grid-cols-[1.2fr_1fr]");

const accountChipClass = cx(
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

const accountChipVerifiedClass = cx("text-success");

const accountChipUnverifiedClass = cx(
	"border-dashed",
	"border-warning",
	"text-warning",
);

const nameFormClass = cx("gap-4", "grid", "max-w-xl");

const nameActionsClass = cx("flex", "gap-4", "items-center");

const profileStatusClass = cx("text-label", "tracking-label", "uppercase");

const profilePendingClass = cx(
	"text-base-content/40",
	"text-label",
	"tracking-label",
	"uppercase",
);

const statusOkClass = cx("text-success");

const statusErrClass = cx("text-error");

const jobListClass = cx("border-base-300", "border-t");

const jobItemClass = cx(
	"border-b",
	"border-base-300",
	"gap-3",
	"grid",
	"hover:bg-base-200",
	"items-center",
	"md:gap-6",
	"md:grid-cols-[2fr_auto_1.5fr_auto_auto]",
	"p-5",
	"px-2",
);

const jobTitleClass = cx("font-semibold", "text-base");

const jobTitlePlaceholderClass = cx(
	"font-semibold",
	"italic",
	"text-base",
	"text-base-content/50",
);

const statusCellClass = cx("flex", "gap-2", "items-center");

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

const statusChipDraftClass = cx("border-dashed", "text-base-content/60");

const jobMetaClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const emptyClass = cx("py-6", "text-base-content/50", "text-sm");

const statusLabel = (status: RecentJobRow["status"]): string =>
	status === "draft" ? "Draft" : status === "active" ? "Live" : "Closed";

const shortIntl = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

const mediumIntl = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const shortDate = (value: string | null): string =>
	value && value.length >= 10
		? shortIntl.format(new Date(value.slice(0, 10)))
		: "—";

const mediumDate = (value: string | null): string =>
	value && value.length >= 10
		? mediumIntl.format(new Date(value.slice(0, 10)))
		: "—";

const Field = ({
	label,
	children,
}: {
	readonly label: string;
	readonly children: Child;
}) => (
	<div class={fieldClass}>
		<span class={kickerClass}>{label}</span>
		{children}
	</div>
);

const Logo = ({
	name,
	logoUrl,
}: {
	readonly name: string;
	readonly logoUrl: string | null;
}) =>
	logoUrl ? (
		<span class={logoFrameClass}>
			<img src={logoUrl} alt="logo" class={logoImgClass} />
		</span>
	) : (
		<span class={logoFrameClass} aria-hidden="true">
			<span class={logoFallbackClass}>{name.charAt(0).toUpperCase()}</span>
		</span>
	);

const RecentJobListItem = ({ job }: { readonly job: RecentJobRow }) => {
	const title = job.title.trim();
	return (
		<li class={jobItemClass}>
			{title ? (
				<span class={jobTitleClass}>{title}</span>
			) : (
				<span class={jobTitlePlaceholderClass}>
					(Unnamed Job Posting #{job.id})
				</span>
			)}
			<div class={statusCellClass}>
				<span
					class={cx(
						statusChipClass,
						job.status === "draft" && statusChipDraftClass,
					)}
				>
					{statusLabel(job.status)}
				</span>
			</div>
			<span class={jobMetaClass}>
				{[job.location, job.jobType].filter(Boolean).join(" // ") || "—"}
			</span>
			<span class={jobMetaClass}>
				{job.updatedAt ? `edited ${shortDate(job.updatedAt)}` : ""}
			</span>
			<Row>
				<a
					href={`/recruiter/jobs/edit/${job.id}`}
					class="px-2 text-info/80 hover:text-info"
				>
					<div class="i-pixelarticons:edit-box text-2xl" />
				</a>
			</Row>
		</li>
	);
};

const profileStatusResponse = (message: string, ok: boolean): Response =>
	ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(
			String(
				html`<span class="${ok ? statusOkClass : statusErrClass}">${message}</span>`,
			),
			{ selector: "#profile-status", mode: "inner" },
		);
	});

dashboard.get("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const recruiter = await c.env.db
		.prepare(
			"SELECT email, name, email_verified AS emailVerified, created_at AS createdAt FROM users WHERE id = ?1",
		)
		.bind(user.id)
		.first<RecruiterRow>();
	if (!recruiter) return c.notFound();

	const company = await c.env.db
		.prepare(
			"SELECT id, name, slug, logo_url AS logoUrl, website, description, created_at AS createdAt FROM companies WHERE owner_id = ?1 LIMIT 1",
		)
		.bind(user.id)
		.first<CompanyRow>();

	const analysis = new AnalysisManager(c);
	const recentJobs = company
		? await analysis.filterRecentJobsAsync(company.id)
		: [];

	return c.render(
		<Fragment>
			<Nav user={user} />
			<Main>
				<section class={cx(panelClass, panelHeaderClass)}>
					<div>
						<p class={kickerClass}>Recruiter // Dashboard</p>
						<h1 class={pageHeadingClass}>Mission control.</h1>
					</div>
					<Link variant="buttonBase" href="/recruiter/jobs/add" size="lg">
						<div class="i-pixelarticons:plus mr-2 text-2xl text-success" />
						New job
					</Link>
				</section>

				{company ? (
					<section class={panelClass}>
						<p class={sectionKickerClass}>Company // {company.slug}</p>
						<div class={companyGridClass}>
							<div class={identityClass}>
								<Logo name={company.name} logoUrl={company.logoUrl} />
								<div class={fieldClass}>
									<h2 class={companyNameClass}>{company.name}</h2>
									{company.website && (
										<a
											href={company.website}
											target="_blank"
											rel="noreferrer noopener"
											class={websiteLinkClass}
										>
											{company.website}
										</a>
									)}
								</div>
							</div>
							<div class={cx(dividerCellClass, fieldClass)}>
								<span class={kickerClass}>About</span>
								<p class={aboutTextClass}>{company.description ?? "—"}</p>
							</div>
							<div class={cx(dividerCellClass, fieldClass)}>
								<span class={kickerClass}>Created</span>
								<span class={metaValueClass}>
									{mediumDate(company.createdAt)}
								</span>
							</div>
						</div>
					</section>
				) : (
					<section class={panelClass}>
						<p class={emptyClass}>No company linked to your account yet.</p>
					</section>
				)}

				<section class={panelClass}>
					<p class={sectionKickerClass}>Account // Profile</p>
					<div class={profileGridClass}>
						<div class={fieldStackClass}>
							<Field label="Email">
								<span class={metaValueClass}>{recruiter.email}</span>
							</Field>
							<Field label="Email verified">
								<span
									class={cx(
										accountChipClass,
										recruiter.emailVerified === 1
											? accountChipVerifiedClass
											: accountChipUnverifiedClass,
									)}
								>
									{recruiter.emailVerified === 1 ? "Verified" : "Unverified"}
								</span>
							</Field>
							<Field label="Member since">
								<span class={metaValueClass}>
									{mediumDate(recruiter.createdAt)}
								</span>
							</Field>
						</div>
						<form
							class={nameFormClass}
							data-indicator:saving=""
							data-on:submit={`@post('/recruiter/dashboard/profile', {contentType: 'form'})`}
						>
							<TextInput
								name="name"
								label="Display name"
								value={recruiter.name ?? ""}
								placeholder="Your name"
								inputContainerClass={fieldClass}
								inputLabelClass={kickerClass}
							/>
							<div class={nameActionsClass}>
								<Button type="submit">Save</Button>
								<span
									class={profilePendingClass}
									data-text="$saving ? 'Saving...' : ''"
								></span>
								<div
									id="profile-status"
									class={profileStatusClass}
									aria-live="polite"
								></div>
							</div>
						</form>
					</div>
				</section>

				<section class={panelClass}>
					<header
						class={cx(
							"flex",
							"gap-6",
							"items-start",
							"justify-between",
							"mb-8",
						)}
					>
						<div class={fieldClass}>
							<p class={kickerClass}>Postings // Sorted by last edit</p>
							<h2 class={panelHeadingClass}>Recent postings</h2>
						</div>
						<Link href="/recruiter/jobs" size="sm">
							View all
						</Link>
					</header>
					{recentJobs.length > 0 ? (
						<ul class={jobListClass}>
							{recentJobs.map((job) => (
								<RecentJobListItem job={job} />
							))}
						</ul>
					) : (
						<p class={emptyClass}>
							Nothing posted yet. Click "New job" to start a draft — it
							autosaves as you type.
						</p>
					)}
				</section>
			</Main>
			<Footer />
		</Fragment>,
	);
});

dashboard.post("/profile", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const body = await c.req.parseBody();
	const name = typeof body.name === "string" ? body.name.trim() : "";

	if (name.length === 0 || name.length > 80) {
		return profileStatusResponse("Name must be 1-80 characters", false);
	}

	await c.env.db
		.prepare("UPDATE users SET name = ?1 WHERE id = ?2 AND role = 'recruiter'")
		.bind(name, user.id)
		.run();

	return profileStatusResponse(
		`Saved ${new Date().toUTCString().slice(17, 25)} UTC`,
		true,
	);
});
