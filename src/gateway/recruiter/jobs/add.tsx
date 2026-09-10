import { type Context, Hono } from "hono";
import type { AppEnv } from "#gateway/shared";
import { JobsManager } from "#manager/jobs";

export const add = new Hono();

add.get("/", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	if (!company) return c.redirect("/recruiter/jobs");

	const jobId = await mgr.createDraft(company.id);
	return c.redirect(`/recruiter/jobs/edit/${jobId}`);
});
