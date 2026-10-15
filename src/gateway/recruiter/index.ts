import { Hono } from "hono";
import { useRequiredRole, useRequiredUser } from "#gateway/shared";
import { applications } from "./applications";
import { dashboard } from "./dashboard";
import { jobs } from "./jobs";

export const recruiter = new Hono();

recruiter.use("*", useRequiredUser, useRequiredRole("recruiter"));

recruiter.route("/applications", applications);

recruiter.route("/dashboard", dashboard);

recruiter.route("/jobs", jobs);
