import { Hono } from "hono";

export const dashboard = new Hono();

dashboard.get("/", (c) => {
	return c.render(
		<div>
			<h1>Recruiter Dashboard</h1>
		</div>,
	);
});
