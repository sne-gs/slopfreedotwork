import { type Context, Hono } from "hono";
import type { AppEnv } from "#gateway/shared";
import { JobsManager } from "#manager/jobs";
import { redirectResponse } from "./patch";

export const discard = new Hono();

discard.post("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return redirectResponse("/recruiter/jobs");

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	if (!company) return redirectResponse("/recruiter/jobs");

	const rawId = c.req.param("jobId") ?? "";
	if (!/^\d+$/.test(rawId)) return redirectResponse("/recruiter/jobs");

	await mgr.deleteDraft(company.id, Number(rawId));
	return redirectResponse("/recruiter/jobs");
});
