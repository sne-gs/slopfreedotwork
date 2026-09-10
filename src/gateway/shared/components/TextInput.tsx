import { cx } from "./cx";

type Size = "sm" | "md" | "lg";

const inputBaseClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"placeholder:text-base-content/50",
	"px-4",
	"w-full",
);

const inputLabelBaseClass = cx("font-bold", "whitespace-nowrap");

const sizeClasses: Record<Size, string> = {
	sm: cx("h-8", "text-sm"),
	md: cx("h-10", "text-base"),
	lg: cx("h-12", "text-lg"),
};

export const TextInput = ({
	name,
	label,
	value,
	size = "md",
	placeholder,
	isRequired = false,
	inputClass,
	inputLabelClass,
	inputContainerClass,
}: {
	readonly name: string;
	readonly label?: string;
	readonly value?: string;
	readonly size?: Size;
	readonly placeholder?: string;
	readonly isRequired?: boolean;
	readonly inputClass?: string;
	readonly inputLabelClass?: string;
	readonly inputContainerClass?: string;
}) => {
	const inputLabelClasses = cx(inputLabelBaseClass, inputLabelClass);
	const inputClasses = cx(inputBaseClass, sizeClasses[size], inputClass);
	const inputPlaceholder =
		isRequired && !label ? `${placeholder}*` : placeholder;
	return (
		<div class={inputContainerClass ?? ""}>
			{label && (
				<label for={name} class={inputLabelClasses}>
					{label} {isRequired ? "*" : null}
				</label>
			)}
			<input
				class={inputClasses}
				type="text"
				value={value}
				placeholder={inputPlaceholder}
				id={name}
				name={name}
				required={isRequired}
			/>
		</div>
	);
};
