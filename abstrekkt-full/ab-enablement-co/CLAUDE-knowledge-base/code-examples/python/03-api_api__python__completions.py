// --- block 1 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
for completion in client.completions.create(
    max_tokens_to_sample=256,
    model="claude-2.1",
    prompt="\n\nHuman: Hello, world!\n\nAssistant:",
):
  print(completion)
