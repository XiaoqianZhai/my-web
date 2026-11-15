import { NextResponse } from "next/server";

export type JsonObjectResult =
  | { object: Record<string, unknown>; error: null }
  | { object: null; error: NextResponse };

export async function readJsonObject(
  request: Request,
): Promise<JsonObjectResult> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      object: null,
      error: NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      ),
    };
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      object: null,
      error: NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 },
      ),
    };
  }

  return { object: body as Record<string, unknown>, error: null };
}
