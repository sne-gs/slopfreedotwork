import type { Child } from "hono/jsx";
import type { User } from "#utility/types";
import { cx } from "./cx";
import { Link } from "./Link";

const logoLink = cx(
	"flex",
	"font-semibold",
	"gap-2",
	"items-center",
	"no-underline",
	"text-base-content/50",
	"text-xs",
);

const slopText = cx(
	"font-extrabold",
	"text-base-content",
	"text-lg",
	"tracking-[-0.02em]",
	"uppercase",
);

const lineSpan = cx(
	"-inset-x-2",
	"-rotate-6",
	"-translate-y-1/2",
	"absolute",
	"bg-error",
	"h-[3px]",
	"top-1/2",
);

const desktopLinks = cx(
	"hidden",
	"md:flex",
	"md:gap-8",
	"md:items-center",
	"md:text-base-content/60",
	"md:text-label",
	"md:tracking-button",
	"md:uppercase",
);

const mobileDropdown = cx(
	"absolute",
	"bg-base-100",
	"border-b",
	"border-base-300",
	"flex-col",
	"gap-4",
	"hidden",
	"inset-x-0",
	"mobile-dropdown",
	"p-6",
	"top-full",
	"z-50",
);

const Hamburger = ({ children }: { children: Child }) => (
	<details class="hamburger md:hidden">
		<summary aria-label="Toggle navigation menu">
			<span class="hamburger-box">
				<span class="hamburger-inner" />
			</span>
		</summary>
		{children}
	</details>
);

export const Nav = ({ user }: { user: User | null }) => {
	const links = (
		<>
			<Link href={`/${user?.role ?? "applicant"}/jobs`} size="sm">
				Jobs
			</Link>
			<Link href={`/${user?.role ?? "applicant"}/companies`} size="sm">
				Companies
			</Link>
			{user ? (
				<>
					<Link href={`/${user.role}/dashboard`} size="sm">
						Dashboard
					</Link>
					<Link href="/logout" size="sm">
						Sign-Out
					</Link>
				</>
			) : (
				<>
					<Link href="/login" size="sm">
						Sign-In
					</Link>
					<Link variant="buttonContrast" href="/register" size="sm">
						Get Access
					</Link>
				</>
			)}
		</>
	);

	return (
		<nav
			class="relative flex items-center justify-between bg-base-100 px-6 py-4"
			aria-label="Main"
		>
			<a href="/" class={logoLink}>
				<span class="relative inline-grid place-items-center">
					<span class={slopText}>Slop</span>
					<span aria-hidden="true" class={lineSpan} />
				</span>
				.work
			</a>

			<div class={desktopLinks}>{links}</div>

			<Hamburger>
				<div class={mobileDropdown}>{links}</div>
			</Hamburger>
		</nav>
	);
};
