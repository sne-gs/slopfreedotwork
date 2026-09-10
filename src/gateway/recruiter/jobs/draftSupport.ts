import type { Context } from "hono";
import type { AppEnv } from "#gateway/shared";
import { type JobRow, JobsManager } from "#manager/jobs";
import { statusResponse } from "./patch";

export type JobResolution =
	| {
			readonly ok: true;
			readonly mgr: JobsManager;
			readonly jobId: number;
			readonly job: JobRow;
	  }
	| { readonly ok: false; readonly response: Response };

export const resolveJobTarget = async (
	c: Context<AppEnv>,
): Promise<JobResolution> => {
	const user = c.get("user");
	if (!user) {
		return {
			ok: false,
			response: statusResponse("Session expired — please log in again"),
		};
	}

	const mgr = new JobsManager(c);
	const company = await mgr.getCompanyByOwnerId(user.id);
	if (!company) {
		return {
			ok: false,
			response: statusResponse("No company linked to your account yet"),
		};
	}

	const rawId = c.req.param("jobId");
	if (!rawId || !/^\d+$/.test(rawId)) {
		return { ok: false, response: statusResponse("Job not found") };
	}

	const job = await mgr.getCompanyJob(company.id, Number(rawId));
	if (!job) {
		return { ok: false, response: statusResponse("Job not found") };
	}

	return { ok: true, mgr, jobId: job.id, job };
};
