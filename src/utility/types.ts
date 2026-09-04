export interface User {
	readonly id: number;
	readonly name: string;
	readonly email: string;
	readonly role: "recruiter" | "applicant";
	readonly isEmailVerified: boolean;
	readonly emailVerificationToken: string | null;
	readonly passwordHash: string;
	readonly createdAt: string;
}

export interface Company {
	readonly id: number;
	readonly ownerId: number;
	readonly name: string;
	readonly slug: string;
	readonly logoUrl: string | null;
	readonly primaryColor: string | null;
	readonly secondaryColor: string | null;
	readonly contactEmail: string | null;
	readonly website: string | null;
	readonly description: string | null;
	readonly createdAt: string;
}

export interface Role {
	readonly id: number;
	readonly companyId: number;
	readonly title: string;
	readonly slug: string;
	readonly description: string;
	readonly location: string | null;
	readonly jobType: string | null;
	readonly salaryRange: string | null;
	readonly customFormSchema: string | null;
	readonly status: "active" | "closed" | "draft";
	readonly createdAt: string;
}
