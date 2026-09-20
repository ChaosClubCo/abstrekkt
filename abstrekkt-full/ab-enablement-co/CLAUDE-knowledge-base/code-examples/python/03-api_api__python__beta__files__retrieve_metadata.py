// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
file_metadata = client.beta.files.retrieve_metadata(
    file_id="file_id",
)
print(file_metadata.id)
