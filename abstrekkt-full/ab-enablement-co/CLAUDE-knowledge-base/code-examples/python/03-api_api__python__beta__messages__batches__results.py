// --- block 3 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
for batch in client.beta.messages.batches.results(
    message_batch_id="message_batch_id",
):
  print(batch)
