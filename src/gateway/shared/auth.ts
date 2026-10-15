import type { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import type { User } from "#utility/types";
import { HTTPException } from "hono/http-exception";

export interface BaseEnv {
	readonly Bindings: {
		readonly db: D1Database;
		readonly SESSION_SECRET?: string;
		readonly BASE_URL?: string;
		readonly RESEND_API_KEY?: string;
	};
}

export interface ReqUsrEnv extends BaseEnv {
	readonly Variables: {
		readonly user: User;
	};
}

export interface OptUsrEnv extends BaseEnv {
	readonly Variables: {
		readonly user: User | null;
	};
}

const getUserAsync = async <E extends BaseEnv>(c: Context<E>) => {
	const secret =
		c.env.SESSION_SECRET || "dev-fallback-secret-key-change-in-prod";
	const userId = await getSignedCookie(c, secret, "session");
	if (!userId) {
		return null;
	}
	const user = await c.env.db
		.prepare("SELECT id, email, role, email_verified FROM users WHERE id = ?1")
		.bind(userId)
		.first<User>();
	return user;
};

export const useOptionalUser = async (c: Context<OptUsrEnv>, next: Next) => {
	const user = await getUserAsync(c);
	c.set("user", user);
	await next();
};

export const useRequiredUser = async (c: Context<ReqUsrEnv>, next: Next) => {
	const user = await getUserAsync(c);
	if (!user) {
		return c.redirect("/login");
	}
	c.set("user", user);
	await next();
};

export const useRequiredRole = (role: User["role"]) => {
	return async (c: Context<ReqUsrEnv>, next: Next) => {
		const user = c.get("user");
		if (user.role !== role) {
			throw new HTTPException(403);
		}
		await next();
	};
};
