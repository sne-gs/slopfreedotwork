import { Hono } from "hono";
import { useOptionalUser } from "#gateway/shared";
import { home } from "./home";
import { login } from "./login";
import { register } from "./register";

export const open = new Hono();

open.use(useOptionalUser);

open.route("/", home);

open.route("/login", login);

open.route("/register", register);
