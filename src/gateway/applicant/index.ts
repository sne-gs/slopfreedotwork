import { Hono } from "hono";
import { useRequiredUser } from "#gateway/shared";
import { companies } from "./companies";
import { jobs } from "./jobs";

export const applicant = new Hono();

applicant.use("*", useRequiredUser);

applicant.route("/jobs", jobs);

applicant.route("/companies", companies);
