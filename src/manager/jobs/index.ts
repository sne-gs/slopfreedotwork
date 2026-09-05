import type { Context } from "hono";
import type { AppEnv } from "#gateway/shared";
import type { DraftInput, Question } from "#utility/types";

export interface CompanyRow {
	readonly id: number;
	readonly name: string;
}

export interface JobRow {
	readonly id: number;
	readonly title: string;
	readonly slug: string;
	readonly description: string;
	readonly location: string | null;
	readonly jobType: string | null;
	readonly customFormSchema: string | null;
	readonly status: "active" | "closed" | "draft";
	readonly createdAt: string | null;
	readonly updatedAt: string | null;
}

export interface JobWithCompanyRow extends JobRow {
	readonly companyName: string;
}

export const slugify = (title: string): string =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

export class JobsManager {
	#c: Context<AppEnv>;

	constructor(c: Context<AppEnv>) {
		this.#c = c;
	}

	public async getCompanyByOwnerId(
		ownerId: number,
	): Promise<CompanyRow | null> {
		return this.#c.env.slopfreeworkdb
			.prepare("SELECT id, name FROM companies WHERE owner_id = ?1")
			.bind(ownerId)
			.first<CompanyRow>();
	}

	/** The recruiter's most recent draft, i.e. the one the add form resumes. */
	public async findLatestDraft(companyId: number): Promise<JobRow | null> {
		return this.#c.env.slopfreeworkdb
			.prepare(
				"SELECT id, title, slug, description, location, job_type AS jobType, custom_form_schema AS customFormSchema, status, created_at AS createdAt, updated_at AS updatedAt FROM jobs WHERE company_id = ?1 AND status = 'draft' ORDER BY id DESC LIMIT 1",
			)
			.bind(companyId)
			.first<JobRow>();
	}

	public async listByCompanyId(companyId: number): Promise<JobRow[]> {
		const res = await this.#c.env.slopfreeworkdb
			.prepare(
				"SELECT id, title, slug, description, location, job_type AS jobType, custom_form_schema AS customFormSchema, status, created_at AS createdAt, updated_at AS updatedAt FROM jobs WHERE company_id = ?1 ORDER BY updated_at DESC, id DESC",
			)
			.bind(companyId)
			.all<JobRow>();
		return res.results || [];
	}

	public async getActiveJobWithCompany(
		jobId: number,
	): Promise<JobWithCompanyRow | null> {
		return this.#c.env.slopfreeworkdb
			.prepare(
				"SELECT j.id, j.title, j.slug, j.description, j.location, j.job_type AS jobType, j.custom_form_schema AS customFormSchema, j.status, j.created_at AS createdAt, j.updated_at AS updatedAt, c.name AS companyName FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = ?1 AND j.status = 'active'",
			)
			.bind(jobId)
			.first<JobWithCompanyRow>();
	}

	public async createDraft(companyId: number): Promise<number> {
		const slug = `draft-${crypto.randomUUID()}`;
		const res = await this.#c.env.slopfreeworkdb
			.prepare(
				"INSERT INTO jobs (company_id, title, slug, description, status) VALUES (?1, '', ?2, '', 'draft')",
			)
			.bind(companyId, slug)
			.run();
		return Number(res.meta.last_row_id);
	}

	public async saveDraft(jobId: number, draft: DraftInput): Promise<void> {
		await this.#c.env.slopfreeworkdb
			.prepare(
				"UPDATE jobs SET title = ?1, description = ?2, location = ?3, job_type = ?4, custom_form_schema = ?5, updated_at = CURRENT_TIMESTAMP WHERE id = ?6 AND status = 'draft'",
			)
			.bind(
				draft.title,
				draft.description,
				draft.location,
				draft.jobType,
				JSON.stringify(draft.questions),
				jobId,
			)
			.run();
	}

	public async ensureDraft(companyId: number): Promise<number> {
		const draft = await this.findLatestDraft(companyId);
		if (draft) return draft.id;
		return this.createDraft(companyId);
	}

	public async publishDraft(jobId: number, draft: DraftInput): Promise<void> {
		const title = draft.title.trim();
		const base = slugify(title) || "job";

		const slugRows = await this.#c.env.slopfreeworkdb
			.prepare(
				"SELECT slug FROM jobs WHERE company_id = (SELECT company_id FROM jobs WHERE id = ?1) AND id != ?1 AND (slug = ?2 OR slug LIKE ?2 || '-%')",
			)
			.bind(jobId, base)
			.all<{ slug: string }>();
		const taken = new Set((slugRows.results || []).map((r) => r.slug));

		let slug = base;
		let n = 2;
		while (taken.has(slug)) {
			slug = `${base}-${n}`;
			n += 1;
		}

		const liveQuestions = draft.questions.filter(
			(q: Question) => q.label.trim().length > 0,
		);

		await this.#c.env.slopfreeworkdb
			.prepare(
				"UPDATE jobs SET title = ?1, description = ?2, location = ?3, job_type = ?4, custom_form_schema = ?5, slug = ?6, status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?7 AND status = 'draft'",
			)
			.bind(
				title,
				draft.description,
				draft.location,
				draft.jobType,
				JSON.stringify(liveQuestions),
				slug,
				jobId,
			)
			.run();
	}
}
