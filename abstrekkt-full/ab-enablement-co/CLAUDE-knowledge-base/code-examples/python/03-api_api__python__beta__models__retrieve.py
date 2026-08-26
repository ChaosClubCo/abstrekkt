// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_model_info = client.beta.models.retrieve(
    model_id="model_id",
)
print(beta_model_info.id)
