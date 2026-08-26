// --- block 3 (lang: typescript) ---
// Ring 1: Single tool, single turn.

import Anthropic from "@anthropic-ai/sdk";

// Create a client. It reads ANTHROPIC_API_KEY from the environment.
const client = new Anthropic();

// Define one tool. The input_schema is a JSON Schema object describing
// the arguments Claude should pass when it calls this tool. This schema
// includes nested objects (recurrence), arrays (attendees), and optional
// fields, which is closer to real-world tools than a flat string argument.
const tools: Anthropic.Tool[] = [
  {
    name: "create_calendar_event",
    description:
      "Create a calendar event with attendees and optional recurrence.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        start: { type: "string", format: "date-time" },
        end: { type: "string", format: "date-time" },
        attendees: {
          type: "array",
          items: { type: "string", format: "email" },
        },
        recurrence: {
          type: "object",
          properties: {
            frequency: { enum: ["daily", "weekly", "monthly"] },
            count: { type: "integer", minimum: 1 },
          },
        },
      },
      required: ["title", "start", "end"],
    },
  },
];

// Send the user's request along with the tool definition. Claude decides
// whether to call the tool based on the request and the tool description.
const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  tools,
  tool_choice: { type: "auto", disable_parallel_tool_use: true },
  messages: [
    {
      role: "user",
      content:
        "Schedule a 30-minute sync with alice@example.com and bob@example.com next Monday at 10am.",
    },
  ],
});

// When Claude calls a tool, the response has stop_reason "tool_use"
// and the content array contains a tool_use block alongside any text.
console.log(`stop_reason: ${response.stop_reason}`);

// Find the tool_use block. A response may contain text blocks before the
// tool_use block, so scan the content array rather than assuming position.
const toolUse = response.content.find(
  (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
)!;
console.log(`Tool: ${toolUse.name}`);
console.log(`Input: ${JSON.stringify(toolUse.input)}`);

// Execute the tool. In a real system this would call your calendar API.
// Here the result is hardcoded to keep the example self-contained.
const result = { event_id: "evt_123", status: "created" };

// Send the result back. The tool_result block goes in a user message and
// its tool_use_id must match the id from the tool_use block above. The
// assistant's previous response is included so Claude has the full history.
const followup = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  tools,
  tool_choice: { type: "auto", disable_parallel_tool_use: true },
  messages: [
    {
      role: "user",
      content:
        "Schedule a 30-minute sync with alice@example.com and bob@example.com next Monday at 10am.",
    },
    { role: "assistant", content: response.content },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(result),
        },
      ],
    },
  ],
});

// With the tool result in hand, Claude produces a final natural-language
// answer and stop_reason becomes "end_turn".
console.log(`stop_reason: ${followup.stop_reason}`);
for (const block of followup.content) {
  if (block.type === "text") {
    console.log(block.text);
  }
}
