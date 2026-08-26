import { Hono } from "hono";
import { home } from "./home";
import { login } from "./login";
import { register } from "./register";

export const open = new Hono();

open.route("/", home);

open.route("/login", login);

open.route("/register", register);
