import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { html } from "hono/html";
import { type AppEnv, cx } from "#gateway/shared";

export const updateProfile = new Hono();

const statusOkClass = cx("text-success");

const statusErrClass = cx("text-error");

const profileStatusResponse = (message: string, ok: boolean): Response =>
	ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(
			String(
				html`<span class="${ok ? statusOkClass : statusErrClass}">${message}</span>`,
			),
			{ selector: "#profile-status", mode: "inner" },
		);
	});

updateProfile.post("/profile", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const body = await c.req.parseBody();
	const name = typeof body.name === "string" ? body.name.trim() : "";

	if (name.length === 0 || name.length > 80) {
		return profileStatusResponse("Name must be 1-80 characters", false);
	}

	await c.env.db
		.prepare("UPDATE users SET name = ?1 WHERE id = ?2 AND role = 'recruiter'")
		.bind(name, user.id)
		.run();

	return profileStatusResponse(
		`Saved ${new Date().toUTCString().slice(17, 25)} UTC`,
		true,
	);
});
