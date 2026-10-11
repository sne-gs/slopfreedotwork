const shortIntl = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

const mediumIntl = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export const shortDate = (value: string | null): string =>
	value && value.length >= 10
		? shortIntl.format(new Date(value.slice(0, 10)))
		: "—";

export const mediumDate = (value: string | null): string =>
	value && value.length >= 10
		? mediumIntl.format(new Date(value.slice(0, 10)))
		: "—";
