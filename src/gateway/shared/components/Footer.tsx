import { cx } from "./cx";

export const microLabel = cx(
	"leading-label",
	"text-label",
	"tracking-button",
	"uppercase",
);

const footer = cx("bg-base-100", "px-6", "py-12");

const footerGrid = cx("gap-12", "grid", "md:grid-cols-4");

const columnHeading = cx("text-base-content/60");

const columnLinks = cx(
	"gap-3",
	"grid",
	"mt-6",
	"text-base-content/60",
	"text-note",
);

const footerMeta = cx(
	"flex",
	"flex-col",
	"justify-between",
	"md:col-start-4",
	"md:text-right",
);

const metaLabel = cx("text-base-content/50");

const brandChipContainer = cx("rotate-[-8deg]", "select-none");

const brandChip = cx(
	"bg-[#FAA11B]",
	"border-2",
	"border-base-content",
	"border-dashed",
	"font-brand",
	"px-2",
	"text-base-content",
	"text-xl",
);

interface FooterLink {
	readonly href: string;
	readonly label: string;
}

const columns: Array<{ heading: string; links: FooterLink[] }> = [
	{
		heading: "System",
		links: [
			{ href: "/documentation", label: "Documentation" },
			{ href: "/api-status", label: "API Status" },
			{ href: "/release-notes", label: "Release Notes" },
		],
	},
	{
		heading: "Network",
		links: [
			{ href: "/companies", label: "Companies" },
			{ href: "/jobs", label: "Open Roles" },
			{ href: "/talent-pool", label: "Talent Pool" },
		],
	},
	{
		heading: "Protocols",
		links: [
			{ href: "/terms-of-service", label: "Terms of Service" },
			{ href: "/privacy-policy", label: "Privacy Policy" },
		],
	},
];

const FooterColumn = ({
	heading,
	links,
}: {
	heading: string;
	links: FooterLink[];
}) => (
	<div>
		<h2 class={cx(microLabel, columnHeading)}>{heading}</h2>
		<ul class={columnLinks}>
			{links.map((link) => (
				<li key={link.href}>
					<a href={link.href} class="hover:text-base-content">
						{link.label}
					</a>
				</li>
			))}
		</ul>
	</div>
);

export const Footer = () => (
	<footer class={footer}>
		<div class={footerGrid}>
			{columns.map((column) => (
				<FooterColumn key={column.heading} {...column} />
			))}
			<div class={footerMeta}>
				<span class={cx(microLabel, metaLabel)}>Node {"//"} 02</span>
				<span class={brandChipContainer}>
					<a href="https://codeberg.org/snegs" class={brandChip}>
						snegs
					</a>
				</span>
			</div>
		</div>
	</footer>
);
