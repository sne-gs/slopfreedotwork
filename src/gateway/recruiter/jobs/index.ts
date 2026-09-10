import { Hono } from "hono";
import { add } from "./add";
import { deleteJob } from "./delete";
import { discard } from "./discard";
import { draft } from "./draft";
import { edit } from "./edit";
import { list } from "./list";
import { questions } from "./questions";

export const jobs = new Hono();

jobs.route("/", list);

jobs.route("/add", add);

jobs.route("/delete/:jobId", deleteJob);

jobs.route("/edit/:jobId/draft", draft);
jobs.route("/edit/:jobId/questions", questions);
jobs.route("/edit/:jobId/discard", discard);
jobs.route("/edit/:jobId", edit);
