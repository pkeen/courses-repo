// src/base/errors.ts
export class NetworkError extends Error {
	constructor(msg: string, public cause?: unknown) {
		super(msg);
	}
}
export class HttpError extends Error {
	constructor(public status: number, public body: string) {
		super(`HTTP ${status}`);
	}
}
export function normalizeHttpError(status: number, body: string) {
	return new HttpError(status, body);
}
