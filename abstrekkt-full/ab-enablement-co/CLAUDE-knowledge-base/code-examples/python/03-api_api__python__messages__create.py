// --- block 11 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
for message in client.messages.create(
    max_tokens=1024,
    messages=[{
        "content": "Hello, world",
        "role": "user",
    }],
    model="claude-opus-4-6",
):
  print(message)
