import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { action, notes } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY;

  // Mock responses if no API key
  if (!apiKey) {
    if (action === "organize") {
      // Group notes by simple keyword matching
      const categories: Record<string, string[]> = {};
      for (const note of notes) {
        const text = note.text || "(empty)";
        const cat = text.length > 20 ? "Detailed Notes" : text.length > 10 ? "Short Notes" : "Quick Notes";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(text);
      }
      return NextResponse.json({
        result: `📋 **Organized Notes (${notes.length} total)**\n\n` +
          Object.entries(categories)
            .map(([cat, items]) => `**${cat}:**\n${items.map((i: string) => `  • ${i}`).join("\n")}`)
            .join("\n\n") +
          "\n\n_⚠️ Mock AI — set OPENROUTER_API_KEY for real clustering_",
      });
    }
    if (action === "summarize") {
      const allText = notes.map((n: { text: string }) => n.text).filter(Boolean).join(", ");
      return NextResponse.json({
        result: `📝 **Board Summary (${notes.length} notes)**\n\nTopics covered: ${allText || "No content yet"}\n\n_⚠️ Mock AI — set OPENROUTER_API_KEY for real summarization_`,
      });
    }
  }

  // Real AI via OpenRouter
  const prompt =
    action === "organize"
      ? `You are a helpful assistant. Given these sticky notes from a whiteboard, organize and cluster them into categories. Return a clear, formatted summary.\n\nNotes:\n${notes.map((n: { text: string }, i: number) => `${i + 1}. ${n.text}`).join("\n")}`
      : `You are a helpful assistant. Summarize the key themes and ideas from these whiteboard sticky notes into a concise summary.\n\nNotes:\n${notes.map((n: { text: string }, i: number) => `${i + 1}. ${n.text}`).join("\n")}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || "No response from AI";
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ result: "Error calling AI API" }, { status: 500 });
  }
}
