import { css, cx } from "hono/css";

const inputBaseClass = css`
	background-color: transparent;
	border: 0;
	border-bottom: var(--line-width-default) solid var(--color-base-content);
  padding: var(--spacing-sm);
	width: 100%;
	&:focus {
    outline: none;
  }
  &::placeholder {
    color: var(--color-content-faint);
  }
`;

const inputLabelBaseClass = css`
	font-weight: var(--weight-bold);
	text-wrap: nowrap;
`;

export const TextInput = ({
	name,
	label,
	placeholder,
	isRequired = false,
	inputClass,
	inputLabelClass,
	inputContainerClass,
}: {
	readonly name: string;
	readonly label?: string;
	readonly placeholder?: string;
	readonly isRequired?: boolean;
	readonly inputClass?: Promise<string>;
	readonly inputLabelClass?: Promise<string>;
	readonly inputContainerClass?: Promise<string>;
}) => {
	const inputLabelClasses = cx(inputLabelBaseClass, inputLabelClass);
	const inputClasses = cx(inputBaseClass, inputClass);
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
				placeholder={inputPlaceholder}
				id={name}
				name={name}
				required={isRequired}
			/>
		</div>
	);
};
