import { cx } from "./cx";

interface Props {
	readonly name: string;
	readonly label: string;
	readonly checked: boolean;
}

const labelClass = cx(
	"border",
	"border-base-content",
	"cursor-pointer",
	"focus-within:ring-2",
	"focus-within:ring-info",
	"focus-within:ring-offset-2",
	"gap-2",
	"inline-flex",
	"items-center",
	"px-2",
	"relative",
	"select-none",
	"text-xs",
	"tracking-tab",
	"uppercase",
);

const inputClass = cx(
	"absolute",
	"appearance-none",
	"cursor-pointer",
	"inset-0",
	"opacity-0",
	"peer",
);

const iconClass = cx(
	"i-pixelarticons:checkbox-sharp",
	"peer-checked:i-pixelarticons:checkbox-on-sharp",
	"text-2xl",
);

export const Checkbox = ({ name, label, checked }: Props) => {
	return (
		<label class={labelClass}>
			<input type="checkbox" name={name} checked={checked} class={inputClass} />
			<div class={iconClass} />
			<span>{label}</span>
		</label>
	);
};
