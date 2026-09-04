import type { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import type { User } from "#utility/types";

export type AppEnv = {
	Bindings: {
		slopfreeworkdb: D1Database;
		SESSION_SECRET?: string;
		BASE_URL?: string;
		RESEND_API_KEY?: string;
	};
	Variables: {
		user: User | null;
	};
};

const getUserAsync = async (c: Context<AppEnv>) => {
	const secret =
		c.env.SESSION_SECRET || "dev-fallback-secret-key-change-in-prod";
	const userId = await getSignedCookie(c, secret, "session");
	if (!userId) {
		return null;
	}
	const user = await c.env.slopfreeworkdb
		.prepare("SELECT id, email, role, email_verified FROM users WHERE id = ?1")
		.bind(userId)
		.first<User>();
	return user;
};

export const useAuth = async (c: Context<AppEnv>, next: Next) => {
	const user = await getUserAsync(c);
	c.set("user", user);
	await next();
};

export const requireAuth = async (c: Context<AppEnv>, next: Next) => {
	const user = await getUserAsync(c);
	if (!user) {
		return c.redirect("/login");
	}
	c.set("user", user);
	await next();
};

export const requireRole = (role: User["role"]) => {
	return async (c: Context<AppEnv>, next: Next) => {
		const user = c.get("user");
		if (!user || user.role !== role) {
			return c.redirect("/");
		}
		await next();
	};
};
