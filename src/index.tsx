import { Hono } from "hono";
import { applicant } from "./applicant";
import { open } from "./open";
import { recruiter } from "./recruiter";
import { renderer } from "./shared";

const app = new Hono();

app.use(renderer);

app.route("/applicant", applicant);

app.route("/recruiter", recruiter);

app.route("/", open);

export default app;
