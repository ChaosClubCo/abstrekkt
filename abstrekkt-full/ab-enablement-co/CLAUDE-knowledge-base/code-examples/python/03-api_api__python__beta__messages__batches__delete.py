// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_deleted_message_batch = client.beta.messages.batches.delete(
    message_batch_id="message_batch_id",
)
print(beta_deleted_message_batch.id)
