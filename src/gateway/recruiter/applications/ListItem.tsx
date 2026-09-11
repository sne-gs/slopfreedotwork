import { cx } from "#gateway/shared";
import type {
	ApplicationListRow,
	ApplicationStatus,
} from "#manager/applications";

const labelClass = cx("text-label", "tracking-label", "uppercase");

const rowLinkClass = cx(
	"border-b",
	"border-base-300",
	"duration-150",
	"ease-out",
	"gap-3",
	"grid",
	"hover:bg-base-200",
	"items-center",
	"md:gap-6",
	"md:grid-cols-[1.5fr_1.3fr_1.3fr_auto_auto_2rem]",
	"md:px-2",
	"py-5",
	"transition-colors",
);

const applicantNameClass = cx("font-semibold", "md:text-base", "text-sm");

const applicantHeadlineClass = cx(labelClass, "mt-1 text-base-content/40");

const detailClass = cx(
	labelClass,
	"[overflow-wrap:anywhere]",
	"text-base-content/50",
);

const statusCellClass = cx("flex", "flex-wrap", "gap-2", "items-center");

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

const arrowClass = cx("hidden", "md:block", "text-right");

const statusChipVariantClass = (status: ApplicationStatus): string => {
	if (status === "hired") return statusChipSuccessClass;
	if (status === "interview") return statusChipAccentClass;
	if (status === "rejected") return statusChipMutedClass;
	return "";
};

const intl = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

const appliedDate = (value: string | null): string =>
	value && value.length >= 10
		? `applied ${intl.format(new Date(value.slice(0, 10)))}`
		: "—";

export const ApplicationListItem = ({
	application,
}: {
	readonly application: ApplicationListRow;
}) => (
	<li>
		<a href={`/recruiter/applications/${application.id}`} class={rowLinkClass}>
			<div>
				<span class={applicantNameClass}>{application.applicantName}</span>
				{application.applicantHeadline && (
					<div class={applicantHeadlineClass}>
						{application.applicantHeadline}
					</div>
				)}
			</div>
			<span class={detailClass}>{application.applicantEmail}</span>
			<span class={detailClass}>{application.jobTitle}</span>
			<div class={statusCellClass}>
				<span
					class={cx(
						statusChipClass,
						statusChipVariantClass(application.status),
					)}
				>
					{application.status}
				</span>
				{application.jobStatus === "closed" && (
					<span class={cx(statusChipClass, statusChipMutedClass)}>
						Closed role
					</span>
				)}
			</div>
			<span class={detailClass}>{appliedDate(application.appliedAt)}</span>
			<span class={arrowClass} aria-hidden="true">
				→
			</span>
		</a>
	</li>
);
