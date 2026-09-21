// --- block 11 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
for message in client.beta.messages.create(
    max_tokens=1024,
    messages=[{
        "content": "Hello, world",
        "role": "user",
    }],
    model="claude-opus-4-6",
):
  print(message)


// --- block 21 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_message_tokens_count = client.beta.messages.count_tokens(
    messages=[{
        "content": "Hello, world",
        "role": "user",
    }],
    model="claude-opus-4-6",
)
print(beta_message_tokens_count.context_management)


// --- block 40 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_message_batch = client.beta.messages.batches.create(
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
print(beta_message_batch.id)


// --- block 42 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_message_batch = client.beta.messages.batches.retrieve(
    message_batch_id="message_batch_id",
)
print(beta_message_batch.id)


// --- block 44 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
page = client.beta.messages.batches.list()
page = page.data[0]
print(page.id)


// --- block 46 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_message_batch = client.beta.messages.batches.cancel(
    message_batch_id="message_batch_id",
)
print(beta_message_batch.id)


// --- block 48 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_deleted_message_batch = client.beta.messages.batches.delete(
    message_batch_id="message_batch_id",
)
print(beta_deleted_message_batch.id)


// --- block 53 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
for batch in client.beta.messages.batches.results(
    message_batch_id="message_batch_id",
):
  print(batch)
