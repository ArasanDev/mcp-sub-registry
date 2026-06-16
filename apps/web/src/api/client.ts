export interface ApiError {
  error: string;
  code: string;
  details: Record<string, unknown>;
}

function headers(adminKey?: string | null, includeContentType = false) {
  return {
    Accept: "application/json",
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    ...(adminKey ? { Authorization: `Bearer ${adminKey}` } : {})
  };
}

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = body as ApiError | null;
    throw new Error(err?.error ?? `Request failed: ${res.status}`);
  }
  return body as T;
}

export async function apiGet<T>(path: string, adminKey?: string | null): Promise<T> {
  return handle<T>(await fetch(path, { headers: headers(adminKey) }));
}

export async function apiPost<T>(path: string, body: unknown, adminKey?: string | null): Promise<T> {
  return handle<T>(
    await fetch(path, {
      method: "POST",
      headers: headers(adminKey, true),
      body: JSON.stringify(body)
    })
  );
}

export async function apiPatch<T>(path: string, body: unknown, adminKey?: string | null): Promise<T> {
  return handle<T>(
    await fetch(path, {
      method: "PATCH",
      headers: headers(adminKey, true),
      body: JSON.stringify(body)
    })
  );
}
