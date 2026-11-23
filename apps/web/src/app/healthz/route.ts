/** Liveness/readiness probe for the web container. Deliberately does not call the API. */
export function GET() {
  return new Response("ok", { headers: { "content-type": "text/plain", "cache-control": "no-store" } });
}
