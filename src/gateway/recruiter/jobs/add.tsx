import { type Context, Hono } from "hono";
import { css, cx } from "hono/css";
import { Fragment } from "hono/jsx/jsx-runtime";
import {
	type AppEnv,
	Button,
	Col,
	Footer,
	Link,
	Main,
	MarkdownInput,
	Nav,
	Row,
	TextInput,
} from "#gateway/shared";
import { JobsManager } from "#manager/jobs";
import { parseDraftForm, questionsFromSchema } from "./draftInput";
import { redirectResponse, statusResponse } from "./patch";
import { QuestionEditor } from "./QuestionEditor";

export const add = new Hono();

const DRAFT_ENDPOINT = "/recruiter/jobs/add/draft";

const autosave = {
	"data-on:input__debounce.750ms": `@post('${DRAFT_ENDPOINT}', {contentType: 'form'})`,
	"data-on:change__debounce.750ms": `@post('${DRAFT_ENDPOINT}', {contentType: 'form'})`,
	"data-on:submit": `@post('${DRAFT_ENDPOINT}', {contentType: 'form'})`,
};

const jobTitleInputClass = css`
        font-size: var(--text-5xl);
`;

const jobInputContainerClass = css`
        display: flex;
        align-items: center;
        padding-inline: var(--spacing-default);
`;

const jobInputClass = css`
        border: 0;
`;

const formClass = css`
        height: 100%;
        background-color: var(--color-base-100);
        padding: var(--spacing-4xl);
`;

const saveStatusClass = css`
        display: flex;
        align-items: center;
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-label);
        color: var(--color-content-faint);
`;

const savedAtLabel = (updatedAt: string | null): string => {
	if (!updatedAt || updatedAt.length < 16)
		return "Draft · autosaves as you type";
	return `Draft · last saved ${updatedAt.slice(11, 16)} UTC`;
};

add.get("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	const draft = company ? await mgr.findLatestDraft(company.id) : null;
	const questions = questionsFromSchema(draft?.customFormSchema ?? null);

	return c.render(
		<Fragment>
			<Nav user={user} />
			<Main>
				<form class={formClass} noValidate {...autosave}>
					<Col template="auto auto 1fr auto auto" gap="md">
						<TextInput
							name="jobTitle"
							isRequired
							value={draft?.title ?? ""}
							inputClass={cx(jobInputClass, jobTitleInputClass)}
							placeholder="Job title"
						/>
						<Row gap="md">
							<TextInput
								inputClass={jobInputClass}
								inputContainerClass={jobInputContainerClass}
								name="jobLocation"
								label="Location"
								isRequired
								value={draft?.location ?? ""}
								placeholder="Job location"
							/>
							<TextInput
								inputClass={jobInputClass}
								inputContainerClass={jobInputContainerClass}
								name="jobType"
								label="Job Type"
								isRequired
								value={draft?.jobType ?? ""}
								placeholder="Job type (full-time, part-time, contract, etc)"
							/>
						</Row>
						<MarkdownInput
							name="jobDescription"
							placeholder="Enter the job description here (accepts markdown)"
							content={draft?.description ?? ""}
						/>
						<QuestionEditor questions={questions} />
						<Row template="1fr auto auto" gap="sm">
							<span id="save-status" class={saveStatusClass}>
								{savedAtLabel(draft?.updatedAt ?? null)}
							</span>
							<Link variant="button" href="/somewhere">
								Cancel
							</Link>
							<Button
								type="button"
								variant="contrast"
								data-on:click="@post('/recruiter/jobs/add', {contentType: 'form'})"
							>
								Publish
							</Button>
						</Row>
					</Col>
				</form>
			</Main>
			<Footer />
		</Fragment>,
	);
});

add.post("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return statusResponse("Session expired — please log in again");

	const form = await c.req.raw.formData();
	const draft = parseDraftForm(form);

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	if (!company) {
		return statusResponse("No company linked to your account yet");
	}

	if (!draft.title.trim()) return statusResponse("Add a job title to publish");
	if (!draft.location.trim()) {
		return statusResponse("Add a location to publish");
	}
	if (!draft.jobType.trim()) return statusResponse("Add a job type to publish");

	const draftId = await mgr.ensureDraft(company.id);
	await mgr.publishDraft(draftId, draft);

	return redirectResponse("/recruiter/jobs");
});
