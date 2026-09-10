import { type Context, Hono } from "hono";
import type { AppEnv } from "#gateway/shared";
import { type JobRow, JobsManager } from "#manager/jobs";
import { parseDraftForm, questionsFromSchema } from "./draftInput";
import { resolveJobTarget } from "./draftSupport";
import {
	editDiscardEndpoint,
	editDraftEndpoint,
	editEndpoint,
	editQuestionsEndpoint,
} from "./endpoints";
import { JobForm } from "./JobForm";
import { redirectResponse, statusResponse } from "./patch";

export const edit = new Hono();

const statusPrefix = (job: JobRow): string =>
	job.parentJobId !== null
		? "Editing live job"
		: job.status === "draft"
			? "Draft"
			: job.status === "active"
				? "Live"
				: "Closed";

const editStatusLabel = (job: JobRow): string => {
	const prefix = statusPrefix(job);
	const suffix =
		job.parentJobId !== null ? "autosaves to draft" : "autosaves as you type";
	if (!job.updatedAt || job.updatedAt.length < 16) {
		return `${prefix} · ${suffix}`;
	}
	return `${prefix} · last saved ${job.updatedAt.slice(11, 16)} UTC`;
};

edit.get("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	const rawId = c.req.param("jobId") ?? "";
	if (!/^\d+$/.test(rawId)) return c.notFound();
	if (!company) return c.notFound();

	const job = await mgr.getCompanyJob(company.id, Number(rawId));
	if (!job) return c.notFound();

	if (job.status !== "draft") {
		const existing = await mgr.findDraftForLiveJob(company.id, job.id);
		const draftId =
			existing?.id ?? (await mgr.createDraftFromLive(company.id, job.id));
		return c.redirect(`/recruiter/jobs/edit/${draftId}`);
	}

	const mode: "draft" | "linkedDraft" =
		job.parentJobId === null ? "draft" : "linkedDraft";
	const discardEndpoint =
		job.parentJobId !== null ? editDiscardEndpoint(job.id) : undefined;

	return c.render(
		<JobForm
			user={user}
			title={job.title}
			location={job.location ?? ""}
			jobType={job.jobType ?? ""}
			description={job.description}
			questions={questionsFromSchema(job.customFormSchema)}
			draftEndpoint={editDraftEndpoint(job.id)}
			questionsEndpoint={editQuestionsEndpoint(job.id)}
			publishEndpoint={editEndpoint(job.id)}
			statusText={editStatusLabel(job)}
			cancelHref="/recruiter/jobs"
			mode={mode}
			discardEndpoint={discardEndpoint}
		/>,
	);
});

edit.post("/", async (c: Context<AppEnv>) => {
	const resolution = await resolveJobTarget(c);
	if (!resolution.ok) return resolution.response;
	const { mgr, jobId, job } = resolution;

	const form = await c.req.raw.formData();
	const draft = parseDraftForm(form);

	if (!draft.title.trim()) return statusResponse("Add a job title to publish");
	if (!draft.location.trim()) {
		return statusResponse("Add a location to publish");
	}
	if (!draft.jobType.trim()) return statusResponse("Add a job type to publish");

	if (job.status === "draft" && job.parentJobId !== null) {
		await mgr.publishDraftToLive(jobId, job.parentJobId, draft);
	} else if (job.status === "draft") {
		await mgr.publishDraft(jobId, draft);
	} else {
		await mgr.saveJobContent(jobId, draft);
	}

	return redirectResponse("/recruiter/jobs");
});
