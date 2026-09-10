import type { Context } from "hono";
import type { AppEnv } from "#gateway/shared";
import type { ApplicationAnswers } from "#utility/types";

export class ApplicationsManager {
	#c: Context<AppEnv>;

	constructor(c: Context<AppEnv>) {
		this.#c = c;
	}

	public async hasApplied(
		jobId: number,
		applicantId: number,
	): Promise<boolean> {
		const row = await this.#c.env.db
			.prepare(
				"SELECT id FROM applications WHERE job_id = ?1 AND applicant_id = ?2 LIMIT 1",
			)
			.bind(jobId, applicantId)
			.first<{ id: number }>();
		return row !== null;
	}

	public async create(
		jobId: number,
		applicantId: number,
		answers: ApplicationAnswers,
	): Promise<void> {
		await this.#c.env.db
			.prepare(
				"INSERT INTO applications (job_id, applicant_id, form_responses) VALUES (?1, ?2, ?3)",
			)
			.bind(jobId, applicantId, JSON.stringify(answers))
			.run();
	}
}
