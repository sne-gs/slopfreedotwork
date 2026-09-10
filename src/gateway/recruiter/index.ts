import { Hono } from "hono";
import { requireAuth, requireRole } from "#gateway/shared";
import { applications } from "./applications";
import { dashboard } from "./dashboard";
import { jobs } from "./jobs";

export const recruiter = new Hono();

recruiter.use("*", requireAuth, requireRole("recruiter"));

recruiter.route("/applications", applications);

recruiter.route("/dashboard", dashboard);

recruiter.route("/jobs", jobs);
