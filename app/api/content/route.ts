import { NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

const API_KEY = process.env.API_KEY || "dev-key";

function auth(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }
  const token = authHeader.slice(7);
  if (token !== API_KEY) {
    return { error: "Invalid API key", status: 401 };
  }
  return null;
}

export async function GET(request: Request) {
  const authError = auth(request);
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

  try {
    const items = await fetchQuery({ api, endpoint: api.content.list, args: {} });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = auth(request);
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case "create":
        const newItem = await fetchMutation({
          api,
          endpoint: api.content.create,
          args: data,
        });
        return NextResponse.json({ item: newItem });

      case "update":
        await fetchMutation({
          api,
          endpoint: api.content.update,
          args: data,
        });
        return NextResponse.json({ success: true });

      case "moveStage":
        await fetchMutation({
          api,
          endpoint: api.content.moveStage,
          args: data,
        });
        return NextResponse.json({ success: true });

      case "delete":
        await fetchMutation({
          api,
          endpoint: api.content.remove,
          args: data,
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
