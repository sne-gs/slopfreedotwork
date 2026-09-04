import { type Context, Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { Fragment } from "hono/jsx";
import { type AppEnv, Footer, Main, Nav } from "#gateway/shared";
import { AnalysisManager } from "#manager/analysis";
import { Companies } from "./companies";
import { Header } from "./header";
import { Jobs } from "./jobs";
import { Register } from "./register";
import { Stats } from "./stats";
import { Steps } from "./steps";
import { Ticker } from "./ticker";

export const home = new Hono();

home.get("/logout", (c) => {
	deleteCookie(c, "session");
	return c.redirect("/");
});

home.get("/", async (c: Context<AppEnv>) => {
	const analysis = new AnalysisManager(c);
	const stats = await analysis.filterStatsAsync();
	const roles = await analysis.filterRolesAsync();
	const companies = await analysis.filterCompaniesAsync();

	return c.render(
		<Fragment>
			<Nav user={c.get("user")} />
			<Main>
				<Header />
				<Ticker />
				<Stats stats={stats} />
				<Steps />
				<Jobs roles={roles} />
				<Companies companies={companies} />
				<Register />
			</Main>
			<Footer />
		</Fragment>,
	);
});
