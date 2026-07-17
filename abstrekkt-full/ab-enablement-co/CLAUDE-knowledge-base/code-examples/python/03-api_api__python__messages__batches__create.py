// --- block 8 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
message_batch = client.messages.batches.create(
    requests=[{
        "custom_id": "my-custom-id-1",
        "params": {
            "max_tokens": 1024,
            "messages": [{
                "content": "Hello, world",
                "role": "user",
            }],
            "model": "claude-opus-4-6",
        },
    }],
)
print(message_batch.id)
