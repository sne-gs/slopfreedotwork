import type { Context } from "hono";
import type { AppEnv } from "#gateway/shared";
import type { ApplicationAnswers } from "#utility/types";

export type ApplicationStatus =
	| "submitted"
	| "reviewed"
	| "interview"
	| "rejected"
	| "hired";

export const applicationStatuses: readonly ApplicationStatus[] = [
	"submitted",
	"reviewed",
	"interview",
	"rejected",
	"hired",
];

export interface ApplicationListRow {
	readonly id: number;
	readonly status: ApplicationStatus;
	readonly appliedAt: string | null;
	readonly jobTitle: string;
	readonly jobStatus: "active" | "closed" | "draft";
	readonly applicantName: string;
	readonly applicantEmail: string;
	readonly applicantHeadline: string | null;
}

export interface ApplicationFilterOptions {
	readonly companyId: number;
	readonly search: string;
	readonly statuses: readonly ApplicationStatus[];
	readonly includeClosed: boolean;
}

export interface ApplicationListOptions extends ApplicationFilterOptions {
	readonly limit: number;
	readonly offset: number;
}

const APPLICATIONS_FROM = `
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.applicant_id = u.id
    LEFT JOIN applicants ap ON ap.user_id = a.applicant_id
  `;

interface FilterParts {
	readonly whereClause: string;
	readonly params: (string | number)[];
}

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

	#filterParts(options: ApplicationFilterOptions): FilterParts {
		const where: string[] = ["j.company_id = ?"];
		const params: (string | number)[] = [options.companyId];
		const bind = (value: string | number): string => {
			params.push(value);
			return "?";
		};

		where.push(
			`a.status IN (${options.statuses.map((status) => bind(status)).join(", ")})`,
		);

		if (!options.includeClosed) {
			where.push("j.status <> 'closed'");
		}

		const search = options.search.trim();
		if (search) {
			const nameParam = bind(`%${search}%`);
			const emailParam = bind(`%${search}%`);
			const jobParam = bind(`%${search}%`);
			where.push(
				`(COALESCE(NULLIF(ap.full_name, ''), u.name, u.email) LIKE ${nameParam} OR u.email LIKE ${emailParam} OR j.title LIKE ${jobParam})`,
			);
		}

		return { whereClause: where.join(" AND "), params };
	}

	public async countByCompanyAsync(
		options: ApplicationFilterOptions,
	): Promise<number> {
		const { whereClause, params } = this.#filterParts(options);
		const res = await this.#c.env.db
			.prepare(
				`SELECT COUNT(*) AS total ${APPLICATIONS_FROM} WHERE ${whereClause}`,
			)
			.bind(...params)
			.first<{ total: number }>();
		return res?.total || 0;
	}

	public async listByCompanyAsync(
		options: ApplicationListOptions,
	): Promise<ApplicationListRow[]> {
		const { whereClause, params } = this.#filterParts(options);
		const res = await this.#c.env.db
			.prepare(`
      SELECT a.id, a.status, a.applied_at AS appliedAt, j.title AS jobTitle,
             j.status AS jobStatus,
             COALESCE(NULLIF(ap.full_name, ''), u.name, u.email) AS applicantName,
             u.email AS applicantEmail, ap.headline AS applicantHeadline
      ${APPLICATIONS_FROM}
      WHERE ${whereClause}
      ORDER BY a.applied_at DESC, a.id DESC
      LIMIT ? OFFSET ?
    `)
			.bind(...params, options.limit, options.offset)
			.all<ApplicationListRow>();
		return res.results || [];
	}
}
