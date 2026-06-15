export interface ApiError {
  error: string;
  code: string;
  details: Record<string, unknown>;
}

export async function apiGet<T>(path: string, adminKey?: string | null): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
      ...(adminKey ? { Authorization: `Bearer ${adminKey}` } : {})
    }
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  adminKey?: string | null
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: requestHeaders(adminKey),
    body: JSON.stringify(body)
  });

  return handleResponse<T>(response);
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  adminKey?: string | null
): Promise<T> {
  const response = await fetch(path, {
    method: "PATCH",
    headers: requestHeaders(adminKey),
    body: JSON.stringify(body)
  });

  return handleResponse<T>(response);
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  adminKey?: string | null
): Promise<T> {
  const response = await fetch(path, {
    method: "PUT",
    headers: requestHeaders(adminKey),
    body: JSON.stringify(body)
  });

  return handleResponse<T>(response);
}

function requestHeaders(adminKey?: string | null) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(adminKey ? { Authorization: `Bearer ${adminKey}` } : {})
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = body as ApiError | null;
    throw new Error(error?.error || `Request failed with ${response.status}`);
  }

  return body as T;
}
