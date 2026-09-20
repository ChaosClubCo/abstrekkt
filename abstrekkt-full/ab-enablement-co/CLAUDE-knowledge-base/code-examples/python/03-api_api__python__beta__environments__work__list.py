// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
page = client.beta.environments.work.list(
    environment_id="env_011CZkZ9X2dpNyB7HsEFoRfW",
)
page = page.data[0]
print(page.id)
