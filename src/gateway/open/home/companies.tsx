import type { FC } from "hono/jsx";
import { cx } from "#gateway/shared";

export interface Company {
	name: string;
	slug: string;
	open: number;
}

interface CompaniesProps {
	companies: Company[];
}

const companiesSectionClass = cx("bg-base-100", "md:p-12", "p-10", "px-6");

const companiesHeaderTextClass = cx(
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const companiesGridClass = cx(
	"gap-4",
	"grid",
	"grid-cols-2",
	"lg:grid-cols-6",
	"mt-8",
	"sm:grid-cols-3",
);

const companyCardClass = cx(
	"border",
	"border-base-content",
	"duration-150",
	"ease-out",
	"flex",
	"flex-col",
	"hover:bg-base-200",
	"justify-between",
	"min-h-28",
	"p-5",
	"transition-colors",
);

const companyNameClass = cx(
	"font-semibold",
	"text-sm",
	"tracking-tab",
	"uppercase",
);

const companyRolesClass = cx(
	"mt-8",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

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
