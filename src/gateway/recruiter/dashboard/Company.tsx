import { cx, Field, mediumDate } from "#gateway/shared";

export interface Company {
	readonly id: number;
	readonly name: string;
	readonly slug: string;
	readonly logoUrl: string | null;
	readonly website: string | null;
	readonly description: string | null;
	readonly createdAt: string | null;
}

const panelClass = cx("bg-base-100", "p-6");

const identityClass = cx(
	"flex",
	"gap-5",
	"items-center",
	"bg-base-100",
	"px-8",
	"py-6",
);

const fieldClass = cx("gap-2", "grid");

const logoFrameClass = cx(
	"bg-base-200",
	"border",
	"border-base-content",
	"grid",
	"h-16",
	"place-items-center",
	"shrink-0",
	"w-16",
);

const logoImgClass = cx(
	"h-full",
	"object-contain",
	"p-1",
	"w-full",
	"flex",
	"items-center",
	"justify-center",
);

const logoFallbackClass = cx("font-medium", "text-2xl");

const companyNameClass = cx(
	"font-semibold",
	"leading-tight",
	"text-2xl",
	"m-0",
);

const websiteLinkClass = cx(
	"[overflow-wrap:anywhere]",
	"hover:text-base-content",
	"text-base-content/60",
	"text-sm",
	"underline",
	"underline-offset-4",
);

const Logo = ({
	name,
	logoUrl,
}: {
	readonly name: string;
	readonly logoUrl: string | null;
}) =>
	logoUrl ? (
		<span class={logoFrameClass}>
			<img src={logoUrl} alt="logo" class={logoImgClass} />
		</span>
	) : (
		<span class={logoFrameClass} aria-hidden="true">
			<span class={logoFallbackClass}>{name.charAt(0).toUpperCase()}</span>
		</span>
	);

export const Company = ({ company }: { readonly company: Company }) => {
	return (
		<section class={panelClass}>
			<div
				class={cx(
					"grid",
					"bg-base-300",
					"gap-px",
					"md:grid-cols-none",
					"lg:grid-cols-3",
				)}
			>
				<div class={identityClass}>
					<Logo name={company.name} logoUrl={company.logoUrl} />
					<div class={fieldClass}>
						<h2 class={companyNameClass}>{company.name}</h2>
						{company.website && (
							<a
								href={company.website}
								target="_blank"
								rel="noreferrer noopener"
								class={websiteLinkClass}
							>
								{company.website}
							</a>
						)}
					</div>
				</div>
				<Field label="About">{company.description ?? "—"}</Field>
				<Field label="Created">{mediumDate(company.createdAt)}</Field>
			</div>
		</section>
	);
};
