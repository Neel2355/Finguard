const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-opus-4-20250514';

// ─── Generate plain-English summary of a circular ─────────────────────────────
async function generateSummary(circular) {
  const prompt = `You are a compliance expert at an Indian bank. Analyze this regulatory circular and write a clear, plain-English summary for the compliance team.

Circular Title: ${circular.title}
Regulator: ${circular.regulator}
Date: ${circular.date}
Source: ${circular.sourceUrl}

Write a 3-5 sentence summary that:
1. States what the regulation requires in simple language (no jargon)
2. Identifies which departments/teams at the bank are affected
3. Mentions any key deadlines or thresholds mentioned (if known from the title)
4. States the consequence of non-compliance (if applicable)

Keep it concise and actionable. Write as if explaining to a senior bank manager who is not a legal expert.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim();
}

// ─── Generate action checklist from circular + summary ────────────────────────
async function generateChecklist(circular, summary) {
  const prompt = `You are a compliance expert at an Indian bank. Based on this regulatory circular, create a specific action checklist for the compliance team.

Circular Title: ${circular.title}
Regulator: ${circular.regulator}
Summary: ${summary}

Generate 3-5 specific action items. For each item, provide:
- action: The specific thing that needs to be done (clear, actionable)
- dept: Which department should do it (e.g. "Legal & Compliance", "IT/Systems", "Retail Loans", "Risk Management", "Operations", "Finance / Treasury", "AML / Fraud", "HR / Training")
- deadline: One of "urgent" (within 7 days), "soon" (within 30 days), or "ok" (within 90 days)
- done: false

Respond ONLY with a valid JSON array. No markdown, no explanation, just the raw JSON array. Example format:
[{"action":"Update KYC process for digital lending","dept":"Digital Banking","deadline":"urgent","done":false}]`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON array from response
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return [{ action: 'Review circular and determine required actions', dept: 'Legal & Compliance', deadline: 'soon', done: false }];
  }
}

// ─── Answer a question about a specific circular ──────────────────────────────
async function askQuestion(circular, question) {
  const prompt = `You are a compliance expert at an Indian bank. Answer the following question about this regulatory circular.

Circular Title: ${circular.title}
Regulator: ${circular.regulator}
Date: ${circular.date}
${circular.summary ? `Summary: ${circular.summary}` : ''}

Question: ${question}

Provide a concise, practical answer in 2-4 sentences. Be specific and actionable. If you don't have enough information from the circular details provided, say so clearly and give general guidance.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim();
}

module.exports = { generateSummary, generateChecklist, askQuestion };
