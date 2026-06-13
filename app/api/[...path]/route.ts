import { NextRequest, NextResponse } from "next/server";

const BACKEND_ORIGIN = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

async function proxyRequest(request: NextRequest, path: string[]) {
  const pathname = `/api/${path.join("/")}/`;
  const target = new URL(pathname, BACKEND_ORIGIN);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  const requestContentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");

  if (requestContentType) headers.set("content-type", requestContentType);
  if (authorization) headers.set("authorization", authorization);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const upstream = await fetch(target.toString(), init);
  const responseBody = await upstream.text();

  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  } else if (responseBody && upstream.status !== 204) {
    responseHeaders.set("content-type", "application/json");
  }

  const hasBody = responseBody.length > 0 && upstream.status !== 204;
  return new NextResponse(hasBody ? responseBody : null, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handler(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
