import { Hono } from "hono";
import { add } from "./add";
import { draft } from "./draft";
import { list } from "./list";
import { questions } from "./questions";

export const jobs = new Hono();

jobs.route("/", list);

jobs.route("/add", add);
jobs.route("/add/draft", draft);
jobs.route("/add/questions", questions);
