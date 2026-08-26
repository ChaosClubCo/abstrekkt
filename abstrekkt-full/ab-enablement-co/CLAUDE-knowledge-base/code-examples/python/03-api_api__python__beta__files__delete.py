// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
deleted_file = client.beta.files.delete(
    file_id="file_id",
)
print(deleted_file.id)
