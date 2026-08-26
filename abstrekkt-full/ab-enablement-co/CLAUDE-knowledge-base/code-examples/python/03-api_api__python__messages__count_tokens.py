// --- block 8 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
message_tokens_count = client.messages.count_tokens(
    messages=[{
        "content": "Hello, world",
        "role": "user",
    }],
    model="claude-opus-4-6",
)
print(message_tokens_count.input_tokens)
