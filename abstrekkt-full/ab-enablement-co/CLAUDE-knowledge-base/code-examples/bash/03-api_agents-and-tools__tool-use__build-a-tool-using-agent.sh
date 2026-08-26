// --- block 0 (lang: bash) ---
#!/bin/bash
# Ring 1: Single tool, single turn.

# Define one tool as a JSON fragment. The input_schema is a JSON Schema
# object describing the arguments Claude should pass when it calls this
# tool. This schema includes nested objects (recurrence), arrays
# (attendees), and optional fields, which is closer to real-world tools
# than a flat string argument.
TOOLS='[
  {
    "name": "create_calendar_event",
    "description": "Create a calendar event with attendees and optional recurrence.",
    "input_schema": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "start": {"type": "string", "format": "date-time"},
        "end": {"type": "string", "format": "date-time"},
        "attendees": {
          "type": "array",
          "items": {"type": "string", "format": "email"}
        },
        "recurrence": {
          "type": "object",
          "properties": {
            "frequency": {"enum": ["daily", "weekly", "monthly"]},
            "count": {"type": "integer", "minimum": 1}
          }
        }
      },
      "required": ["title", "start", "end"]
    }
  }
]'

USER_MSG="Schedule a 30-minute sync with alice@example.com and bob@example.com next Monday at 10am."

# Send the user's request along with the tool definition. Claude decides
# whether to call the tool based on the request and the tool description.
RESPONSE=$(curl -s https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d "$(jq -n \
    --argjson tools "$TOOLS" \
    --arg msg "$USER_MSG" \
    '{
      model: "claude-opus-4-8",
      max_tokens: 1024,
      tools: $tools,
      tool_choice: {type: "auto", disable_parallel_tool_use: true},
      messages: [{role: "user", content: $msg}]
    }')")

# When Claude calls a tool, the response has stop_reason "tool_use"
# and the content array contains a tool_use block alongside any text.
echo "stop_reason: $(echo "$RESPONSE" | jq -r '.stop_reason')"

# Find the tool_use block. A response may contain text blocks before the
# tool_use block, so filter by type rather than assuming position.
TOOL_USE=$(echo "$RESPONSE" | jq '.content[] | select(.type == "tool_use")')
TOOL_USE_ID=$(echo "$TOOL_USE" | jq -r '.id')
echo "Tool: $(echo "$TOOL_USE" | jq -r '.name')"
echo "Input: $(echo "$TOOL_USE" | jq -c '.input')"

# Execute the tool. In a real system this would call your calendar API.
# Here the result is hardcoded to keep the example self-contained.
RESULT='{"event_id": "evt_123", "status": "created"}'

# Send the result back. The tool_result block goes in a user message and
# its tool_use_id must match the id from the tool_use block above. The
# assistant's previous response is included so Claude has the full history.
ASSISTANT_CONTENT=$(echo "$RESPONSE" | jq '.content')
FOLLOWUP=$(curl -s https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d "$(jq -n \
    --argjson tools "$TOOLS" \
    --arg msg "$USER_MSG" \
    --argjson assistant "$ASSISTANT_CONTENT" \
    --arg tool_use_id "$TOOL_USE_ID" \
    --arg result "$RESULT" \
    '{
      model: "claude-opus-4-8",
      max_tokens: 1024,
      tools: $tools,
      tool_choice: {type: "auto", disable_parallel_tool_use: true},
      messages: [
        {role: "user", content: $msg},
        {role: "assistant", content: $assistant},
        {role: "user", content: [
          {type: "tool_result", tool_use_id: $tool_use_id, content: $result}
        ]}
      ]
    }')")

# With the tool result in hand, Claude produces a final natural-language
# answer and stop_reason becomes "end_turn".
echo "stop_reason: $(echo "$FOLLOWUP" | jq -r '.stop_reason')"
echo "$FOLLOWUP" | jq -r '.content[] | select(.type == "text") | .text'


// --- block 1 (lang: bash) ---
#!/usr/bin/env bash
# Ring 1: Single tool, single turn.
# Uses jq for cross-turn message-array state — building an agentic loop in shell
# requires JSON manipulation beyond ant's single-call --transform scope.
set -euo pipefail

USER_MSG="Schedule a 30-minute sync with alice@example.com and bob@example.com next Monday at 10am."
MESSAGES=$(jq -n --arg msg "$USER_MSG" '[{role: "user", content: $msg}]')

# Define one tool. The input_schema is a JSON Schema object describing
# the arguments Claude should pass when it calls this tool. This schema
# includes nested objects (recurrence), arrays (attendees), and optional
# fields, which is closer to real-world tools than a flat string argument.
call_api() {
  # ant reads the request body as YAML on stdin: no auth headers, no
  # hand-built JSON envelope. The static keys (model, tools, tool_choice)
  # live in a quoted heredoc; the growing messages array is appended as
  # JSON, which YAML accepts as flow syntax.
  {
    cat <<'YAML'
model: claude-opus-4-8
max_tokens: 1024
tool_choice: {type: auto, disable_parallel_tool_use: true}
tools:
  - name: create_calendar_event
    description: Create a calendar event with attendees and optional recurrence.
    input_schema:
      type: object
      properties:
        title: {type: string}
        start: {type: string, format: date-time}
        end: {type: string, format: date-time}
        attendees:
          type: array
          items: {type: string, format: email}
        recurrence:
          type: object
          properties:
            frequency: {enum: [daily, weekly, monthly]}
            count: {type: integer, minimum: 1}
      required: [title, start, end]
YAML
    printf 'messages: %s\n' "$MESSAGES"
  } | ant messages create --format json
}

# Send the user's request along with the tool definition. Claude decides
# whether to call the tool based on the request and the tool description.
RESPONSE=$(call_api)

# When Claude calls a tool, the response has stop_reason "tool_use"
# and the content array contains a tool_use block alongside any text.
echo "stop_reason: $(jq -r '.stop_reason' <<<"$RESPONSE")"

# Find the tool_use block. A response may contain text blocks before the
# tool_use block, so filter by type rather than assuming position.
TOOL_USE=$(jq '.content[] | select(.type == "tool_use")' <<<"$RESPONSE")
TOOL_USE_ID=$(jq -r '.id' <<<"$TOOL_USE")
echo "Tool: $(jq -r '.name' <<<"$TOOL_USE")"
echo "Input: $(jq -c '.input' <<<"$TOOL_USE")"

# Execute the tool. In a real system this would call your calendar API.
# Here the result is hardcoded to keep the example self-contained.
RESULT='{"event_id": "evt_123", "status": "created"}'

# Send the result back. The tool_result block goes in a user message and
# its tool_use_id must match the id from the tool_use block above. The
# assistant's previous response is included so Claude has the full history.
MESSAGES=$(jq \
  --argjson assistant "$(jq '.content' <<<"$RESPONSE")" \
  --arg tool_use_id "$TOOL_USE_ID" \
  --arg result "$RESULT" \
  '. + [
    {role: "assistant", content: $assistant},
    {role: "user", content: [
      {type: "tool_result", tool_use_id: $tool_use_id, content: $result}
    ]}
  ]' <<<"$MESSAGES")

FOLLOWUP=$(call_api)

# With the tool result in hand, Claude produces a final natural-language
# answer and stop_reason becomes "end_turn".
echo "stop_reason: $(jq -r '.stop_reason' <<<"$FOLLOWUP")"
jq -r '.content[] | select(.type == "text") | .text' <<<"$FOLLOWUP"
