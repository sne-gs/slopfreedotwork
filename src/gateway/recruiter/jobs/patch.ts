import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { renderToReadableStream } from "hono/jsx/streaming";

const SAVE_STATUS_SELECTOR = "#save-status";
const QUESTIONS_EDITOR_SELECTOR = "#questions-editor";

const cssBootstrapRe =
	/<script>document\.querySelector\('#hono-css'\)[\s\S]*?<\/script>/g;

export const renderFragment = async (
	node: Parameters<typeof renderToReadableStream>[0],
): Promise<string> => {
	const stream = await renderToReadableStream(node);
	const html = await new Response(stream).text();
	return html.replace(cssBootstrapRe, "");
};

export const savedAtText = (): string =>
	`Saved ${new Date().toUTCString().slice(17, 25)} UTC`;

export const statusResponse = (message: string): Response =>
	ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(message, {
			selector: SAVE_STATUS_SELECTOR,
			mode: "inner",
		});
	});

export const questionsEditorResponse = (
	fragment: string,
	status: string,
): Response =>
	ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(fragment, {
			selector: QUESTIONS_EDITOR_SELECTOR,
			mode: "outer",
		});
		stream.patchElements(status, {
			selector: SAVE_STATUS_SELECTOR,
			mode: "inner",
		});
	});

export const redirectResponse = (url: string): Response =>
	ServerSentEventGenerator.stream((stream) => {
		stream.executeScript(`window.location.href = ${JSON.stringify(url)}`);
	});
