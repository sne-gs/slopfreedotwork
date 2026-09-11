import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { html } from "hono/html";
import { type AppEnv, cx } from "#gateway/shared";
import {
	type ApplicationStatus,
	ApplicationsManager,
	applicationStatuses,
} from "#manager/applications";
import { JobsManager } from "#manager/jobs";

const labelClass = cx("text-label", "tracking-label", "uppercase");

const statusChipClass = cx(
	"border",
	"border-base-content",
	"inline-flex",
	"items-center",
	"px-4",
	"py-1",
	"text-label",
	"tracking-tab",
	"uppercase",
	"w-max",
);

const statusChipMutedClass = cx("border-dashed", "text-base-content/60");

const statusChipAccentClass = cx("border-info", "text-info");

const statusChipSuccessClass = cx("border-success", "text-success");

const statusChipVariantClass = (status: ApplicationStatus): string => {
	if (status === "hired") return statusChipSuccessClass;
	if (status === "interview") return statusChipAccentClass;
	if (status === "rejected") return statusChipMutedClass;
	return "";
};

const statusButtonClass = cx(
	"border",
	"border-base-content",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"hover:bg-base-200",
	"px-4",
	"py-2",
	"text-label",
	"tracking-tab",
	"transition-colors",
	"uppercase",
);

const statusButtonActiveClass = cx(
	"bg-neutral",
	"hover:bg-neutral",
	"text-neutral-content",
);

const statusOkClass = cx("text-success");

const statusErrClass = cx("text-error");

const statusChipHtml = (status: ApplicationStatus): string =>
	String(
		html`<span class="${cx(statusChipClass, statusChipVariantClass(status))}">${status}</span>`,
	);

const statusButtonsHtml = (current: ApplicationStatus): string =>
	applicationStatuses
		.map((status) => {
			const cls = cx(
				statusButtonClass,
				status === current && statusButtonActiveClass,
			);
			return String(
				html`<button type="submit" name="status" value="${status}" class="${cls}">${status}</button>`,
			);
		})
		.join("");

const statusSavedResponse = (
	status: ApplicationStatus,
	message: string,
	ok: boolean,
): Response =>
	ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(statusChipHtml(status), {
			selector: "#application-status",
			mode: "inner",
		});
		stream.patchElements(statusButtonsHtml(status), {
			selector: "#status-buttons",
			mode: "inner",
		});
		stream.patchElements(
			String(
				html`<span class="${cx(labelClass, ok ? statusOkClass : statusErrClass)}">${message}</span>`,
			),
			{ selector: "#status-message", mode: "inner" },
		);
	});

export const status = new Hono();

status.post("/:applicationId/status", async (c: Context<AppEnv>) => {
	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const applicationId = Number(c.req.param("applicationId"));
	if (!Number.isInteger(applicationId) || applicationId <= 0) {
		return c.notFound();
	}

	const body = await c.req.parseBody();
	const rawStatus = body.status;
	const status =
		typeof rawStatus === "string" &&
		(applicationStatuses as readonly string[]).includes(rawStatus)
			? (rawStatus as ApplicationStatus)
			: null;

	if (!status) {
		return ServerSentEventGenerator.stream((stream) => {
			stream.patchElements(
				String(
					html`<span class="${cx(labelClass, statusErrClass)}">Invalid status</span>`,
				),
				{ selector: "#status-message", mode: "inner" },
			);
		});
	}

	const company = await new JobsManager(c).getCompanyByOwnerId(user.id);
	if (!company) return c.notFound();

	const updated = await new ApplicationsManager(c).updateStatusAsync(
		applicationId,
		company.id,
		status,
	);
	if (!updated) return c.notFound();

	return statusSavedResponse(status, `Status set to ${status}`, true);
});
