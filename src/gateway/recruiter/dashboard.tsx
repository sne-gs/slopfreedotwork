import { type Context, Hono } from "hono";
import { type AppEnv, Footer, Nav } from "#gateway/shared";

export const dashboard = new Hono();

dashboard.get("/", (c: Context<AppEnv>) => {
	const user = c.get("user");
	return c.render(
		<>
			<Nav user={user} />
			<div class="bg-base-100">Dashboard</div>
			<Footer />
		</>,
	);
});
