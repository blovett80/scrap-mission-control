import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";

const MEMORY_DIR = "/Users/cassandralovett/.openclaw/workspace/memory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();
  const file = searchParams.get("file");

  try {
    if (file) {
      // Read specific file
      const content = await readFile(join(MEMORY_DIR, file), "utf-8");
      return NextResponse.json({ content, filename: file });
    }

    // List all files
    const files = await readdir(MEMORY_DIR);
    const mdFiles = files.filter(f => f.endsWith(".md"));

    const memories = await Promise.all(
      mdFiles.map(async (filename) => {
        const content = await readFile(join(MEMORY_DIR, filename), "utf-8");
        const lines = content.split("\n");
        const title = lines[0]?.replace("#", "").trim() || filename;
        const preview = lines.slice(1, 5).join(" ").substring(0, 150) + "...";
        
        return {
          filename,
          title,
          preview,
          content: query ? content : undefined,
        };
      })
    );

    // Filter if search query
    const filtered = query
      ? memories.filter(m => 
          m.title.toLowerCase().includes(query) || 
          m.content?.toLowerCase().includes(query)
        )
      : memories;

    return NextResponse.json({ memories: filtered });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
