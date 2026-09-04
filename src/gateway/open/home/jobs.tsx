import { css } from "hono/css";
import type { FC } from "hono/jsx";

export interface Role {
	title: string;
	company: string;
	location: string;
	salary: string;
	type: string;
	slug: string;
}

interface JobsProps {
	roles: Role[];
}

const jobsSectionClass = css`
    background-color: var(--color-base-100);
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
`;

const jobsHeaderClass = css`
    margin-bottom: var(--space-8);
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const jobsHeaderTextClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-faint);
`;

const jobsHeaderLinkClass = css`
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-label);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    text-decoration: underline;
    text-underline-offset: 4px;
    transition: color var(--duration-fast) var(--ease-out);
    &:hover {
        color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
    }
`;

const jobsListClass = css`
    border-top: var(--line-width-default) solid var(--color-base-300);
`;

const jobItemLinkClass = css`
    display: grid;
    align-items: center;
    gap: var(--space-3);
    border-bottom: var(--line-width-default) solid var(--color-base-300);
    padding: var(--space-5) var(--space-2);
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
    @media (min-width: 768px) {
        grid-template-columns: 2.2fr 1.4fr 1.4fr 1.1fr auto var(--space-8);
        gap: var(--space-6);
        padding: var(--space-5) var(--space-2);
    }
`;

const jobTitleClass = css`
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    @media (min-width: 768px) {
        font-size: var(--text-base);
    }
`;

const jobDetailClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-faint);
`;

const jobSalaryClass = css`
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
`;

const jobTypeClass = css`
    display: inline-flex;
    height: var(--space-8);
    width: max-content;
    align-items: center;
    border: var(--line-width-default) solid var(--color-base-content);
    padding-inline: var(--space-4);
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tab);
`;

const jobArrowClass = css`
    display: none;
    text-align: right;
    @media (min-width: 768px) {
        display: block;
    }
`;

export const Jobs: FC<JobsProps> = ({ roles }) => (
	<section class={jobsSectionClass}>
		<div class={jobsHeaderClass}>
			<span class={jobsHeaderTextClass}>Network // Open Roles</span>
			<a href="/jobs" class={jobsHeaderLinkClass}>
				View all roles <span aria-hidden="true">→</span>
			</a>
		</div>
		<ul class={jobsListClass}>
			{roles.map((role) => (
				<li key={role.slug}>
					<a href={`/jobs/${role.slug}`} class={jobItemLinkClass}>
						<span class={jobTitleClass}>{role.title}</span>
						<span class={jobDetailClass}>{role.company}</span>
						<span class={jobDetailClass}>{role.location}</span>
						<span class={jobSalaryClass}>{role.salary}</span>
						<span class={jobTypeClass}>{role.type}</span>
						<span class={jobArrowClass} aria-hidden="true">
							→
						</span>
					</a>
				</li>
			))}
		</ul>
	</section>
);
