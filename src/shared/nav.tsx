interface User {
	readonly id: number;
	readonly email: string;
	readonly role: string;
}

export const Nav = async ({ user }: { user: User | null }) => {
	return (
		<nav class="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-base-300 bg-base-100 px-6 py-4">
			<a
				href="/"
				class="flex items-center gap-2 text-xs font-semibold text-base-content/50"
			>
				<span class="relative inline-grid place-items-center">
					<span class="case-upper text-lg font-extrabold tracking-[-0.02em] text-base-content">
						Slop
					</span>
					<span
						aria-hidden="true"
						class="absolute -inset-x-2 top-1/2 h-[3px] -translate-y-1/2 -rotate-6 bg-error"
					></span>
				</span>
				.work
			</a>
			<div class="flex items-center gap-8 text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60">
				<a
					href="/applicant/jobs"
					class="hidden transition-colors hover:text-base-content md:inline"
				>
					Jobs
				</a>
				<a
					href="/applicant/companies"
					class="hidden transition-colors hover:text-base-content md:inline"
				>
					Companies
				</a>
				{user ? (
					<>
						<a
							href={`/${user.role}/dashboard`}
							class="hidden transition-colors hover:text-base-content md:inline"
						>
							{user.email}
						</a>
						<a
							href="/logout"
							class="hidden transition-colors hover:text-base-content md:inline"
						>
							Sign Out
						</a>
					</>
				) : (
					<>
						<a
							href="/login"
							class="hidden transition-colors hover:text-base-content md:inline"
						>
							Sign In
						</a>
						<a
							href="/register"
							class="inline-flex h-10 items-center border-0 bg-neutral px-6 text-neutral-content transition-colors hover:bg-neutral/85"
						>
							Get Access
						</a>
					</>
				)}
			</div>
		</nav>
	);
};
