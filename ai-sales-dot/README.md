# AI Sales Dot (V1)
A small AI sales employee: describe your business, add leads, and the Sales Dot qualifies them, explains why, and recommends the next action.

## Architecture
- `app/` Next.js App Router pages and `app/api/*` server routes (the browser never calls Gemini).
- `lib/ai/` Gemini provider (`gemini.ts`) and Sales Dot prompt, structured output and chat (`salesDot.ts`). Output is validated with zod.
- `lib/services/` business logic (`analyzeLead`). Knows nothing about storage.
- `lib/repositories/` `LeadRepository`, `DotRepository`, `ActivityRepository` interfaces plus in-memory `Local*` implementations seeded with the Nova Real Estate demo. Data resets when the server restarts.
- `lib/validation/` zod schemas. `lib/http.ts` error mapping and basic per-IP rate limiting.

## Local setup
```
npm install
cp .env.example .env.local   # add GEMINI_API_KEY
npm run dev                  # http://localhost:3000
npm run lint && npm run build
```
## Environment variables
| Name | Required | Notes |
|---|---|---|
| GEMINI_API_KEY | yes (for AI) | server-side only |
| GEMINI_MODEL | no | default gemini-2.5-flash |

Without a key the app still runs with demo data; AI actions show a clear message.

## Deploy to Vercel
1. Push to GitHub. 2. Vercel > Add New > Project > Import the repo. 3. Add `GEMINI_API_KEY` under Environment Variables. 4. Deploy.

## Moving to Supabase (V2)
Implement the three repository interfaces with Supabase and change the single `repos` export in `lib/repositories/index.ts`. Services, routes and UI stay unchanged.
