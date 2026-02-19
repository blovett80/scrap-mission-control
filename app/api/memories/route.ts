import { NextResponse } from "next/server";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";

const MIND_DIR = "/Users/cassandralovett/.openclaw/workspace/mind";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();
  const file = searchParams.get("file");

  try {
    if (file) {
      // Read specific file relative to MIND_DIR
      const content = await readFile(join(MIND_DIR, file), "utf-8");
      return NextResponse.json({ content, filename: file });
    }

    // List all markdown files in MIND_DIR and subdirectories
    async function getMarkdownFiles(dir: string, baseDir: string = ""): Promise<string[]> {
      const items = await readdir(dir, { withFileTypes: true });
      let results: string[] = [];

      for (const item of items) {
        if (item.isDirectory()) {
          const subResults = await getMarkdownFiles(join(dir, item.name), join(baseDir, item.name));
          results = results.concat(subResults);
        } else if (item.name.endsWith(".md")) {
          results.push(join(baseDir, item.name));
        }
      }

      return results;
    }

    const mdFiles = await getMarkdownFiles(MIND_DIR);

    const memories = await Promise.all(
      mdFiles.map(async (filename) => {
        const fullPath = join(MIND_DIR, filename);
        const content = await readFile(fullPath, "utf-8");
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

export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json();
    if (!filename || content === undefined) {
      return NextResponse.json({ error: "Filename and content required" }, { status: 400 });
    }

    const fullPath = join(MIND_DIR, filename);
    await writeFile(fullPath, content, "utf-8");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
