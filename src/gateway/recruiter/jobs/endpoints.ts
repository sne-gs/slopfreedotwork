export const editEndpoint = (jobId: number): string =>
	`/recruiter/jobs/edit/${jobId}`;

export const editDraftEndpoint = (jobId: number): string =>
	`/recruiter/jobs/edit/${jobId}/draft`;

export const editQuestionsEndpoint = (jobId: number): string =>
	`/recruiter/jobs/edit/${jobId}/questions`;

export const editDiscardEndpoint = (jobId: number): string =>
	`/recruiter/jobs/edit/${jobId}/discard`;
