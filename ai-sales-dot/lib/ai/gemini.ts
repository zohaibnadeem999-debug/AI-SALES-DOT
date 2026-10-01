export class AiError extends Error {}
type Msg = { role: string; content: string };
export async function complete(messages: Msg[], schema?: object): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiError("The Sales Dot has no Gemini API key yet. Set GEMINI_API_KEY on the server and restart.");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
  const contents = messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, ...(schema ? { generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema } } : {}) }) });
  } catch { throw new AiError("Could not reach the AI service. Check your connection and try again."); }
  if (res.status === 429) throw new AiError("The AI service is busy right now. Wait a moment and retry.");
  if (res.status === 400 || res.status === 401 || res.status === 403) throw new AiError("Gemini rejected the request. Check that GEMINI_API_KEY is valid.");
  if (!res.ok) throw new AiError("The AI service returned an error. Try again shortly.");
  const j = await res.json();
  return j.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
}
