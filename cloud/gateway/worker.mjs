const siteOrigin = "https://e-an66.github.io";
const upstreamOrigin = "https://rjjefseticcaflccpwtf.supabase.co";
const allowedHeaders = [
  "apikey", "authorization", "content-type", "x-client-info",
  "x-supabase-api-version", "x-upsert", "cache-control",
  "accept-profile", "content-profile", "prefer", "range", "range-unit",
];

function allowedPath(path, method) {
  if (path === "/auth/v1/token" || path === "/auth/v1/logout" ||
      path === "/rest/v1/rpc/study_sync") {
    return method === "POST";
  }
  if (path === "/auth/v1/user" || path === "/rest/v1/study_private_catalogue") {
    return method === "GET" || method === "HEAD";
  }
  if (path.startsWith("/storage/v1/object/authenticated/study-private/")) {
    return method === "GET" || method === "HEAD";
  }
  return path.startsWith("/storage/v1/object/study-private/") &&
    (method === "GET" || method === "HEAD" || method === "POST");
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = {
      "Access-Control-Allow-Origin": siteOrigin,
      "Access-Control-Expose-Headers": "content-range, x-supabase-api-version",
      "Cache-Control": "no-store",
      "Vary": "Origin",
    };
    if (origin !== siteOrigin) {
      return new Response(null, { status: 403, headers: { Vary: "Origin" } });
    }
    if (request.method === "GET" && url.pathname === "/_health") {
      return new Response("ok", { headers: cors });
    }
    const preflight = request.method === "OPTIONS";
    const method = preflight ? request.headers.get("Access-Control-Request-Method") : request.method;
    if (!allowedPath(url.pathname, method)) {
      return new Response(null, { status: 404, headers: cors });
    }
    if (preflight) {
      return new Response(null, { status: 204, headers: {
        ...cors,
        "Access-Control-Allow-Methods": method,
        "Access-Control-Allow-Headers": allowedHeaders.join(", "),
        "Access-Control-Max-Age": "600",
      } });
    }
    const target = new URL(upstreamOrigin);
    target.pathname = url.pathname;
    target.search = url.search;
    const headers = new Headers();
    for (const name of allowedHeaders) {
      const value = request.headers.get(name);
      if (value !== null) headers.set(name, value);
    }
    let response;
    try {
      response = await fetch(target, {
        method,
        headers,
        body: request.body,
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      return Response.json({ message: "登录和同步服务暂时无法连接" }, { status: 502, headers: cors });
    }
    if (response.status >= 300 && response.status < 400) {
      return Response.json({ message: "登录和同步服务返回了意外跳转" }, { status: 502, headers: cors });
    }
    const responseHeaders = new Headers(cors);
    for (const name of ["content-type", "content-range", "x-supabase-api-version"]) {
      const value = response.headers.get(name);
      if (value !== null) responseHeaders.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  },
};
