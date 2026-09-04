import { css } from "hono/css";
import type { FC } from "hono/jsx";

export interface Company {
	name: string;
	slug: string;
	open: number;
}

interface CompaniesProps {
	companies: Company[];
}

const companiesSectionClass = css`
    background-color: var(--color-base-100);
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
`;

const companiesHeaderTextClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-faint);
`;

const companiesGridClass = css`
    margin-top: var(--space-8);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1024px) {
        grid-template-columns: repeat(6, 1fr);
    }
`;

const companyCardClass = css`
    display: flex;
    min-height: 7rem;
    flex-direction: column;
    justify-content: space-between;
    border: var(--line-width-default) solid var(--color-base-content);
    padding: var(--space-5);
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
`;

const companyNameClass = css`
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tab);
`;

const companyRolesClass = css`
    margin-top: var(--space-8);
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-faint);
`;

export const Companies: FC<CompaniesProps> = ({ companies }) => (
	<section class={companiesSectionClass}>
		<span class={companiesHeaderTextClass}>Network // Companies</span>
		<div class={companiesGridClass}>
			{companies.map((company) => (
				<a
					key={company.slug}
					href={`/companies/${company.slug}`}
					class={companyCardClass}
				>
					<span class={companyNameClass}>{company.name}</span>
					<span class={companyRolesClass}>{company.open} open roles</span>
				</a>
			))}
		</div>
	</section>
);
