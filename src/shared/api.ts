
type FetchOptions = Omit<RequestInit, "body" | "method">;
type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const API_VERSION = "v1";

const FETCH_ORIGIN = `http://localhost:8000/api/${API_VERSION}`;

/**
 * Custom fetch function.
 * Throws an error if the response is not ok or any other error occurs.
 */
export function fetchJson<T>(
  url: string, 
  method: FetchMethod = "GET",
  body?: Record<string, any>, 
  otherOptions?: FetchOptions
) {
  return fetch(FETCH_ORIGIN + url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...otherOptions
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return <Promise<T>>res.json();
    });
}