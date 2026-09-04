import { css, cx } from "hono/css";

export const microLabel = css`
    font-size: var(--text-label);
    line-height: var(--leading-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
`;

const footer = css`
    background-color: var(--color-base-100);
    padding: var(--space-12) var(--space-6);
`;

const footerGrid = css`
    display: grid;
    gap: var(--space-12);

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
`;

const columnHeading = css`
    color: var(--color-content-muted);
`;

const columnLinks = css`
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-6);
    color: var(--color-content-muted);
    font-size: var(--text-note);

    & a:hover {
        color: var(--color-base-content);
    }
`;

const footerMeta = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 768px) {
        grid-column-start: 4;
        text-align: right;
    }
`;

const metaLabel = css`
    color: var(--color-content-faint);
`;

const brandChipContainer = css`
    user-select: none;
    transform: rotate(-8deg);
`;

const brandChip = css`
    font-family: var(--font-brand);
    font-size: var(--text-xl);
    background-color: #FAA11B;
    color: var(--color-base-content);
    border: 2px dashed var(--color-base-content);
    padding-inline: var(--space-2);
`;

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
					<a href={link.href}>{link.label}</a>
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
