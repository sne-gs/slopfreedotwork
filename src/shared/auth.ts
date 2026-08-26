import type { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

export type User = {
	id: number;
	email: string;
	role: "recruiter" | "applicant";
	email_verified: number;
};

export type AppEnv = {
	Bindings: {
		slopfreeworkdb: D1Database;
		SESSION_SECRET?: string;
		BASE_URL?: string;
		RESEND_API_KEY?: string;
	};
	Variables: {
		user: User;
	};
};

export const requireAuth = async (c: Context<AppEnv>, next: Next) => {
	const secret =
		c.env.SESSION_SECRET || "dev-fallback-secret-key-change-in-prod";
	const userId = await getSignedCookie(c, secret, "session");

	if (!userId) {
		return c.redirect("/login");
	}

	const user = await c.env.slopfreeworkdb
		.prepare("SELECT id, email, role, email_verified FROM users WHERE id = ?1")
		.bind(userId)
		.first<User>();

	if (!user) {
		return c.redirect("/login");
	}

	c.set("user", user);
	await next();
};

export const requireRole = (role: User["role"]) => {
	return async (c: Context<AppEnv>, next: Next) => {
		const user = c.get("user");
		console.log("user", user);
		if (!user || user.role !== role) {
			return c.redirect("/");
		}
		await next();
	};
};
