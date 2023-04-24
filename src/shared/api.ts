import router from "@/router";

type FetchOptions = Omit<RequestInit, "body" | "method">;
type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const API_VERSION = "2";

const FETCH_ORIGIN = `http://localhost:8000/api/v${API_VERSION}`;
const FETCH_ORIGIN_AUTH = `http://localhost:8000/auth`;

/**
 * Custom fetch function.
 * Throws an error if the response is not ok or any other error occurs.
 */
export function fetchJson<T>(
  url: string, 
  withToken = false,
  method: FetchMethod = "GET",
  body?: Record<string, unknown>, 
  otherOptions?: FetchOptions
) {
  const headers: HeadersInit  = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };

  if (withToken) {
    const token = localStorage.getItem("token");
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(FETCH_ORIGIN + url, {
      method,
      headers,
      body: JSON.stringify(body),
      ...otherOptions
    }).then(async (res) => {
      if (!res.ok){ 
        if(res.status === 401) {
          throw new Error("Please, log in");
        }
        throw new Error((await res.json())?.message ?? res.statusText);

      }
      return <Promise<T>>res.json();
    });
}

export function fetchAuth<T>(
  url: string, 
  withToken = false,
  body?: Record<string, unknown>, 
  otherOptions?: FetchOptions
) {
  const method = body ? "POST" : "GET";
  const headers: HeadersInit  = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  
  if (withToken) {
    const token = localStorage.getItem("token");
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(headers, url);

  return fetch(FETCH_ORIGIN_AUTH + url, {
      method,
      headers,
      body: JSON.stringify(body),
      ...otherOptions
    }).then(async (res) => {
      if (!res.ok){ 
        throw new Error((await res.json())?.message ?? res.statusText);
      }
      return <Promise<T>>res.json();
    });
}