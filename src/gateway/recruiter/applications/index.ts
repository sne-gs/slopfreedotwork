import { Hono } from "hono";
import { list } from "./list";
import { status } from "./status";
import { view } from "./view";

export const applications = new Hono();

applications.route("/", list);

applications.route("/:applicationId", view);

applications.route("/status", status);
