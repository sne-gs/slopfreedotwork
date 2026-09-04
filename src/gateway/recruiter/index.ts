import { Hono } from "hono";
import { requireAuth, requireRole } from "#gateway/shared";
import { dashboard } from "./dashboard";
import { jobs } from "./jobs";

export const recruiter = new Hono();

recruiter.use("*", requireAuth, requireRole("recruiter"));

recruiter.route("/dashboard", dashboard);

recruiter.route("/jobs", jobs);
