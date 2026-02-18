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
    const tasks = await fetchQuery({ api, endpoint: api.tasks.list, args: {} });
    return NextResponse.json({ tasks });
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
        const newTask = await fetchMutation({
          api,
          endpoint: api.tasks.create,
          args: data,
        });
        return NextResponse.json({ task: newTask });

      case "updateStatus":
        await fetchMutation({
          api,
          endpoint: api.tasks.updateStatus,
          args: data,
        });
        return NextResponse.json({ success: true });

      case "delete":
        await fetchMutation({
          api,
          endpoint: api.tasks.remove,
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
