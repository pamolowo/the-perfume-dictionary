import "server-only";
import { createApiClient } from "@tpd/api-client";

/** Server-side only. In Kubernetes this is the in-cluster service URL, e.g. http://perfume-api:8000. */
export const api = createApiClient(process.env.API_URL ?? "http://localhost:8000");
