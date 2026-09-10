import { type Context, Hono } from "hono";
import type { AppEnv } from "#gateway/shared";
import { parseDraftForm } from "./draftInput";
import { resolveJobTarget } from "./draftSupport";
import { savedAtText, statusResponse } from "./patch";

export const draft = new Hono();

draft.post("/", async (c: Context<AppEnv>) => {
	const resolution = await resolveJobTarget(c);
	if (!resolution.ok) return resolution.response;
	const { mgr, jobId, job } = resolution;

	const form = await c.req.raw.formData();
	const parsed = parseDraftForm(form);

	if (job.status === "draft") {
		await mgr.saveDraft(jobId, parsed);
	} else {
		await mgr.saveJobContent(jobId, parsed);
	}

	return statusResponse(savedAtText());
});
