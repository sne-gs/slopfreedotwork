import { cx } from "./cx";

const baseClass = cx("text-inherit text-xl");

export const Icon = ({
	name,
}: {
	readonly name: `i-pixelarticons:${string}`;
}) => {
	const iconClass = cx(baseClass, name);
	return <div class={iconClass} />;
};
