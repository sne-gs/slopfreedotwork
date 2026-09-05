import { type Context, Hono } from "hono";
import type { AppEnv } from "#gateway/shared";
import { parseDraftForm } from "./draftInput";
import { resolveDraft } from "./draftSupport";
import { savedAtText, statusResponse } from "./patch";

export const draft = new Hono();

draft.post("/", async (c: Context<AppEnv>) => {
	const resolution = await resolveDraft(c);
	if (!resolution.ok) return resolution.response;

	const form = await c.req.raw.formData();
	const draft = parseDraftForm(form);

	await resolution.mgr.saveDraft(resolution.draftId, draft);

	return statusResponse(savedAtText());
});
