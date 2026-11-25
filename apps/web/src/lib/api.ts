import "server-only";
import { createApiClient, type Schemas } from "@tpd/api-client";
import { notFound } from "next/navigation";

export type { Schemas };

/** Server-side only. In Kubernetes this is the in-cluster service URL, e.g. http://perfume-api:8000. */
export const api = createApiClient(process.env.API_URL ?? "http://localhost:8000");

/** Thrown when the API is unreachable or fails; shown by the route error boundary. */
export class CatalogueUnavailable extends Error {
  constructor(detail: string) {
    super(`The catalogue service is unavailable (${detail}).`);
    this.name = "CatalogueUnavailable";
  }
}

type Result<T> = { data?: T; error?: unknown; response: Response };

/** Unwrap an openapi-fetch result: 404 → notFound(), any other failure → CatalogueUnavailable. */
export async function load<T>(call: Promise<Result<T>>): Promise<T> {
  let res: Result<T>;
  try {
    res = await call;
  } catch (e) {
    throw new CatalogueUnavailable(e instanceof Error ? e.message : "network error");
  }
  if (res.response.status === 404) notFound();
  if (!res.response.ok || res.data === undefined) throw new CatalogueUnavailable(`HTTP ${res.response.status}`);
  return res.data;
}

/** Like load(), but returns null instead of failing the page — for optional sections. */
export async function loadOptional<T>(call: Promise<Result<T>>): Promise<T | null> {
  try {
    const res = await call;
    return res.response.ok && res.data !== undefined ? res.data : null;
  } catch {
    return null;
  }
}

/**
 * For paginated lists: an old or tampered `cursor` makes the API answer 400. Report that as an expired link
 * instead of a catalogue outage.
 */
export async function loadPage<T>(call: () => Promise<Result<T>>, hasCursor: boolean): Promise<T | "bad-cursor"> {
  if (hasCursor) {
    const peek = await call().catch(() => null);
    if (peek?.response.status === 400) return "bad-cursor";
    if (peek) return load(Promise.resolve(peek));
  }
  return load(call());
}
