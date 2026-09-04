import { Hono } from "hono";
import { add } from "./add";
import { list } from "./list";

export const jobs = new Hono();

jobs.route("/", list);

jobs.route("/add", add);
