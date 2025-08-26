import { NetworkError, normalizeHttpError } from "./errors";

// src/base/http.ts
export type HttpOptions = {
	baseUrl: string;
	getAuthToken?: () => string | Promise<string | undefined>;
	fetchImpl?: typeof fetch;
	defaultTimeoutMs?: number;
};

export function createHttp({
	baseUrl,
	getAuthToken,
	fetchImpl,
	defaultTimeoutMs = 15_000,
}: HttpOptions) {
	const _fetch = fetchImpl ?? fetch;

	async function request<T>(
		path: string,
		init: RequestInit = {}
	): Promise<T> {
		const ctrl = new AbortController();
		const t = setTimeout(() => ctrl.abort(), defaultTimeoutMs);
		const token = await getAuthToken?.();

		const res = await _fetch(`${baseUrl}${path}`, {
			...init,
			signal: ctrl.signal,
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				...(init.headers ?? {}),
			},
			credentials: "include",
		}).catch((e) => {
			clearTimeout(t);
			throw new NetworkError("Network request failed", e);
		});

		clearTimeout(t);

		if (!res.ok) {
			const text = await res.text().catch(() => "");
			throw normalizeHttpError(res.status, text);
		}
		// Try JSON; allow empty responses for 204
		if (res.status === 204) return undefined as T;
		return (await res.json()) as T;
	}

	return {
		get: <T>(p: string) => request<T>(p),
		post: <T>(p: string, body: unknown) =>
			request<T>(p, { method: "POST", body: JSON.stringify(body) }),
		put: <T>(p: string, body: unknown) =>
			request<T>(p, { method: "PUT", body: JSON.stringify(body) }),
		del: <T>(p: string) => request<T>(p, { method: "DELETE" }),
	};
}
