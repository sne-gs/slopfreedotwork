import { cx } from "hono/css";
import { Badge, Caption, Field, mediumDate } from "#gateway/shared";

export interface Recruiter {
	readonly email: string;
	readonly name: string | null;
	readonly emailVerified: number;
	readonly createdAt: string | null;
}

const panelClass = cx("bg-base-100", "p-6");

export const Profile = ({ recruiter }: { readonly recruiter: Recruiter }) => {
	return (
		<section class={panelClass}>
			<Caption labels={["Account", "Profile"]} />
			<div
				class={cx(
					"grid",
					"bg-base-300",
					"gap-px",
					"md:grid-cols-2",
					"lg:grid-cols-4",
					"sm:grid-cols-none",
				)}
			>
				<Field label="Email">{recruiter.email}</Field>
				<Field label="Status">
					{recruiter.emailVerified === 1 ? (
						<Badge status="success">
							<span class="i-pixelarticons:check mr-1" />
							<span>Verified</span>
						</Badge>
					) : (
						<Badge status="warning">
							<span class="i-pixelarticons:alert mr-1" />
							<span>Unverified</span>
						</Badge>
					)}
				</Field>
				<Field label="Member since">{mediumDate(recruiter.createdAt)}</Field>
				<Field label="Display name">{recruiter.name ?? ""}</Field>
			</div>
		</section>
	);
};
