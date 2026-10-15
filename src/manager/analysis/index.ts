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

export interface Job {
	readonly id: number;
	readonly title: string;
	readonly slug: string;
	readonly status: "active" | "closed" | "draft";
	readonly location: string | null;
	readonly jobType: string | null;
	readonly updatedAt: string | null;
}

export class AnalysisManager {
	#db: D1Database;

	constructor(db: D1Database) {
		this.#db = db;
	}

	public async filterRecentJobsAsync(companyId: number): Promise<Job[]> {
		const jobsRes = await this.#db
			.prepare(`
      SELECT j.id, j.title, j.slug, j.status, j.location, j.job_type AS jobType, j.updated_at AS updatedAt
      FROM jobs j
      WHERE j.company_id = ?1 AND j.parent_job_id IS NULL
      ORDER BY j.updated_at DESC, j.id DESC
      LIMIT 3
    `)
			.bind(companyId)
			.all<Job>();
		const jobs = jobsRes.results || [];
		return jobs;
	}

	public async filterStatsAsync() {
		const statsRes = await this.#db.batch<{ count: number }>([
			this.#db.prepare(
				"SELECT COUNT(*) as count FROM jobs WHERE status = 'active'",
			),
			this.#db.prepare("SELECT COUNT(*) as count FROM companies"),
			this.#db.prepare("SELECT COUNT(*) as count FROM applicants"),
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
		const rolesRes = await this.#db
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
		const companiesRes = await this.#db
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
