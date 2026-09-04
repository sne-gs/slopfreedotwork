import type { Context } from "hono";
import type { AppEnv } from "#gateway/shared";

interface Stat {
	readonly label: string;
	readonly value: string;
}

interface Role {
	readonly title: string;
	readonly company: string;
	readonly location: string;
	readonly salary: string;
	readonly type: string;
	readonly slug: string;
}

interface Company {
	readonly name: string;
	readonly slug: string;
	readonly open: number;
}

export class AnalysisManager {
	#c: Context<AppEnv>;

	constructor(c: Context<AppEnv>) {
		this.#c = c;
	}

	public async filterStatsAsync() {
		const statsRes = await this.#c.env.slopfreeworkdb.batch<{ count: number }>([
			this.#c.env.slopfreeworkdb.prepare(
				"SELECT COUNT(*) as count FROM jobs WHERE status = 'active'",
			),
			this.#c.env.slopfreeworkdb.prepare(
				"SELECT COUNT(*) as count FROM companies",
			),
			this.#c.env.slopfreeworkdb.prepare(
				"SELECT COUNT(*) as count FROM applicants",
			),
		]);

		const rolesCount = statsRes[0].results?.[0]?.count || 0;
		const companiesCount = statsRes[1].results?.[0]?.count || 0;
		const applicantsCount = statsRes[2].results?.[0]?.count || 0;

		const fmt = (n: number) => n.toLocaleString();

		const stats: Stat[] = [
			{ label: "Open Roles", value: fmt(rolesCount) },
			{ label: "Companies", value: fmt(companiesCount) },
			{ label: "Talent Pool", value: fmt(applicantsCount) },
			{ label: "Match Rate", value: "97.4%" },
		];

		return stats;
	}

	public async filterRolesAsync() {
		const rolesRes = await this.#c.env.slopfreeworkdb
			.prepare(`
      SELECT j.title, c.name AS company, j.location, j.salary_range AS salary, j.job_type AS type, j.slug 
      FROM jobs j 
      JOIN companies c ON j.company_id = c.id 
      WHERE j.status = 'active' 
      ORDER BY j.created_at DESC 
      LIMIT 4
    `)
			.all<Role>();
		const roles = rolesRes.results || [];
		return roles;
	}

	public async filterCompaniesAsync() {
		const companiesRes = await this.#c.env.slopfreeworkdb
			.prepare(`
      SELECT c.name, c.slug, COUNT(j.id) AS open 
      FROM companies c 
      LEFT JOIN jobs j ON c.id = j.company_id AND j.status = 'active' 
      GROUP BY c.id, c.name, c.slug 
      ORDER BY c.created_at DESC 
      LIMIT 6
    `)
			.all<Company>();
		const companies = companiesRes.results || [];
		return companies;
	}
}
