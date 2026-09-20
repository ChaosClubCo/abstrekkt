// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_vault = client.beta.vaults.retrieve(
    vault_id="vlt_011CZkZDLs7fYzm1hXNPeRjv",
)
print(beta_managed_agents_vault.id)
