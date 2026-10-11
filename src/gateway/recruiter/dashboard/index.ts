import { Hono } from "hono";
import { main } from "./main";
import { updateProfile } from "./updateProfile";

export const dashboard = new Hono();

dashboard.route("/", main);

dashboard.route("/update-profile", updateProfile);
