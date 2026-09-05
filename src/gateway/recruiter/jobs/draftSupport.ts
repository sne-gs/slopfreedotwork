import type { Context } from "hono";
import type { AppEnv } from "#gateway/shared";
import { JobsManager } from "#manager/jobs";
import { statusResponse } from "./patch";

export type DraftResolution =
	| { readonly ok: true; readonly mgr: JobsManager; readonly draftId: number }
	| { readonly ok: false; readonly response: Response };

export const resolveDraft = async (
	c: Context<AppEnv>,
): Promise<DraftResolution> => {
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

	const draftId = await mgr.ensureDraft(company.id);
	return { ok: true, mgr, draftId };
};
