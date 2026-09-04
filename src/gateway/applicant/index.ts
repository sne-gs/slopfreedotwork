import { Hono } from "hono";
import { requireAuth } from "#gateway/shared";
import { companies } from "./companies";
import { jobs } from "./jobs";

export const applicant = new Hono();

applicant.use("*", requireAuth);

applicant.route("/jobs", jobs);

applicant.route("/companies", companies);
