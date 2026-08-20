import { Hono } from "hono";
import { renderer } from "./renderer";
import home from "./home";
import login from "./login";
import register from "./register";

const app = new Hono();

app.use(renderer);

app.route("/", home);

app.route("/login", login);

app.route("/register", register);

export default app;
