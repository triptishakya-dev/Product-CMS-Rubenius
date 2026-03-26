// app/api/chat/route.ts
// Rubenius Chatbot — Vectorless RAG + Gemini
//
// Flow:
//   1. Receive user query (POST body)
//   2. Normalise query → keyword match against page index
//   3. Retrieve top QA pairs from knowledge base
//   4. Build Gemini prompt (system + retrieved context + user query)
//   5. Stream / return Gemini response

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QAPair {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface QAFile {
  metadata: Record<string, unknown>;
  qa_pairs: QAPair[];
}

interface IndexEntry {
  index_id: string;
  topic: string;
  qa_ids: number[];
  match_weight: number;
  keyword_triggers: string[];
  intent: string;
}

interface CategoryEntry {
  category_id: string;
  label: string;
  qa_ids: number[];
}

interface FallbackConfig {
  fallback_response: string;
  default_suggested_categories: string[];
}

interface PageIndex {
  index: IndexEntry[];
  categories: CategoryEntry[];
  fallback_config: FallbackConfig;
}

// ─── Load JSON data ────────────────────────────────────────────────────────────
// The JSON files are located in the /constant/ directory at project root.

import qaData from "@/constant/rubenius_chatbot_qa.json";
import pageIndex from "@/constant/rubenius_page_index.json";

const QA_FILE = qaData as QAFile;
const PAGE_INDEX = pageIndex as PageIndex;

// Pre-build a lookup map: qa_id → QAPair  (O(1) retrieval)
const QA_MAP = new Map<number, QAPair>(
  QA_FILE.qa_pairs.map((pair) => [pair.id, pair])
);

// ─── Keyword Retrieval Engine ─────────────────────────────────────────────────

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // strip punctuation
    .replace(/\s+/g, " ")     // collapse whitespace
    .trim();
}

function retrieveQAPairs(userQuery: string, maxResults = 3): QAPair[] {
  const query = normalise(userQuery);

  // Score map: qa_id → accumulated score
  const scores = new Map<number, number>();

  for (const entry of PAGE_INDEX.index) {
    let hits = 0;

    for (const trigger of entry.keyword_triggers) {
      if (query.includes(trigger.toLowerCase())) {
        hits++;
      }
    }

    if (hits > 0) {
      const score = hits * entry.match_weight;
      for (const qaId of entry.qa_ids) {
        scores.set(qaId, (scores.get(qaId) ?? 0) + score);
      }
    }
  }

  if (scores.size === 0) return []; // no matches → caller handles fallback

  // Sort by score descending, deduplicate, take top N
  const sorted = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxResults)
    .map(([id]) => id);

  return sorted
    .map((id) => QA_MAP.get(id))
    .filter(Boolean) as QAPair[];
}

// ─── Gemini Prompt Builder ─────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are Rubi, the friendly and knowledgeable AI assistant for Rubenius Interiors — a leading Experience & Workspace Design firm based in Bengaluru, India, founded in 2005.

Your role is to help website visitors learn about Rubenius's services, projects, team, philosophy, and process. You speak on behalf of Rubenius with warmth, professionalism, and clarity.

STRICT RULES you must always follow:
1. Only answer questions about Rubenius. Do not answer general interior design questions or unrelated topics.
2. Base your answer EXCLUSIVELY on the CONTEXT provided below. Do not invent facts, statistics, or claims.
3. If the context does not contain enough information to answer, politely say so and offer the contact details:
   - Email: info@rubenius.in
   - Phone: +91 86608 42682
   - Start a project: https://www.rubenius.in/start-a-project
4. Keep answers conversational, helpful, and concise — 3 to 6 sentences unless more detail is clearly needed.
5. Never claim to be a human. If asked, confirm you are Rubi, Rubenius's AI assistant.
6. When relevant, end with a soft CTA — invite the user to start a project or get in touch.
7. Format lists with bullet points (•) when listing more than 3 items. Otherwise use plain prose.
8. Do not repeat the question back to the user.`;
}

function buildUserPrompt(userQuery: string, context: QAPair[]): string {
  if (context.length === 0) {
    return `User question: "${userQuery}"

No relevant context was found in the knowledge base. Politely let the user know you don't have that specific information and offer Rubenius's contact details so they can get a direct answer.`;
  }

  const contextBlock = context
    .map(
      (qa, i) =>
        `[Context ${i + 1}] Category: ${qa.category}\nQ: ${qa.question}\nA: ${qa.answer}`
    )
    .join("\n\n");

  return `Use the following retrieved context to answer the user's question accurately.

--- RETRIEVED CONTEXT ---
${contextBlock}
--- END CONTEXT ---

User question: "${userQuery}"

Answer based strictly on the context above. Be helpful, warm, and concise.`;
}

// ─── Gemini API Call ──────────────────────────────────────────────────────────

async function callGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",          // reliable, fast, and cost-effective
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.3,                  // low temp = factual, consistent answers
      topP: 0.85,
      maxOutputTokens: 512,
    },
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;

  return response.text();
}

// ─── Request / Response Schema ────────────────────────────────────────────────

interface ChatRequest {
  query: string;
  history?: { role: "user" | "assistant"; content: string }[]; // optional for multi-turn
}

interface ChatResponse {
  answer: string;
  matched_qa_ids: number[];
  intents: string[];
  fallback: boolean;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse request body
    const body = (await req.json()) as ChatRequest;
    const userQuery = body.query?.trim();

    if (!userQuery || userQuery.length === 0) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 }
      );
    }

    if (userQuery.length > 500) {
      return NextResponse.json(
        { error: "Query too long. Please keep it under 500 characters." },
        { status: 400 }
      );
    }

    // 2. Retrieve relevant QA pairs via keyword index
    const retrievedPairs = retrieveQAPairs(userQuery, 3);
    const isFallback = retrievedPairs.length === 0;

    // 3. Identify matched intents for logging / analytics
    const matchedIntents = isFallback
      ? ["fallback"]
      : retrievedPairs.map((qa) => qa.category);

    // 4. Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(userQuery, retrievedPairs);

    // 5. Call Gemini
    const answer = await callGemini(systemPrompt, userPrompt);

    // 6. Build response
    const responsePayload: ChatResponse = {
      answer,
      matched_qa_ids: retrievedPairs.map((qa) => qa.id),
      intents: [...new Set(matchedIntents)],
      fallback: isFallback,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("[Rubenius Chatbot] Error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Only POST is allowed
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
