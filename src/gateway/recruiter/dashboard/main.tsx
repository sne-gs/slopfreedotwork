import { type Context, Hono } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { Footer, Main, Nav, type ReqUsrEnv } from "#gateway/shared";
import { AnalysisManager } from "#manager/analysis";
import { Company } from "./Company";
import { Jobs } from "./Jobs";
import { Profile, type Recruiter } from "./Profile";

export const main = new Hono();

main.get("/", async (c: Context<ReqUsrEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const recruiter = await c.env.db
		.prepare(
			"SELECT email, name, email_verified AS emailVerified, created_at AS createdAt FROM users WHERE id = ?1",
		)
		.bind(user.id)
		.first<Recruiter>();
	if (!recruiter) return c.notFound();

	const company = await c.env.db
		.prepare(
			"SELECT id, name, slug, logo_url AS logoUrl, website, description, created_at AS createdAt FROM companies WHERE owner_id = ?1 LIMIT 1",
		)
		.bind(user.id)
		.first<Company>();
	if (!company) return c.notFound();

	const analysis = new AnalysisManager(c.env.db);
	const jobs = await analysis.filterRecentJobsAsync(company.id);

	return c.render(
		<Fragment>
			<Nav user={user} />
			<Main>
				<Profile recruiter={recruiter} />
				<Company company={company} />
				<Jobs jobs={jobs} />
			</Main>
			<Footer />
		</Fragment>,
	);
});
