import { Hono } from "hono";
import { requireAuth, requireRole } from "../shared";
import { dashboard } from "./dashboard";

export const recruiter = new Hono();

recruiter.use("*", requireAuth, requireRole("recruiter"));

recruiter.route("/dashboard", dashboard);
