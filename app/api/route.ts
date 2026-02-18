import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Mission Control API",
    version: "1.0.0",
    endpoints: {
      tasks: "/api/tasks",
      content: "/api/content",
      calendar: "/api/calendar",
    },
  });
}
