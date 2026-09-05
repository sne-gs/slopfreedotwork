import { css } from "hono/css";
import { html, raw } from "hono/html";
import { Fragment } from "hono/jsx/jsx-runtime";

const editorClass = css`
        overflow-y: scroll;
        border-top: var(--line-width-default) solid var(--color-base-300);
        border-bottom: var(--line-width-default) solid var(--color-base-300);
        & .TinyMDE {
                background-color: transparent;
                padding: var(--spacing-default);
                height: 100%;
        }
`;

const asJsLiteral = (value: string): string =>
	raw(JSON.stringify(value).replace(/</g, "\\u003c"));

export const MarkdownInput = ({
	name,
	placeholder,
	content = "",
}: {
	readonly name: string;
	readonly placeholder: string;
	readonly content?: string;
}) => {
	return (
		<Fragment>
			<div class={editorClass}>
				<textarea id="editor" name={name}>
					{content}
				</textarea>
			</div>
			<script src="/static/tiny-mde.js"></script>
			<link rel="stylesheet" type="text/css" href="/static/tiny-mde.css" />
			{html`
        <script>
          const editor = new TinyMDE.Editor({
            element: "editor",
            placeholder: ${asJsLiteral(placeholder)},
            content: ${asJsLiteral(content)},
          });
        </script>`}
		</Fragment>
	);
};
