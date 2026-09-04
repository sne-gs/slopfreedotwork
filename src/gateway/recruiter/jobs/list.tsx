import { Hono } from "hono";

export const list = new Hono();

list.get("/", (c) => {
	return c.render(<div>Jobs List</div>);
});
