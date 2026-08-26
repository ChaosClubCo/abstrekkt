// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory_store = client.beta.memory_stores.create(
    name="x",
)
print(beta_managed_agents_memory_store.id)


// --- block 2 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
page = client.beta.memory_stores.list()
page = page.data[0]
print(page.id)


// --- block 4 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory_store = client.beta.memory_stores.retrieve(
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_memory_store.id)


// --- block 6 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory_store = client.beta.memory_stores.update(
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_memory_store.id)


// --- block 8 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_deleted_memory_store = client.beta.memory_stores.delete(
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_deleted_memory_store.id)


// --- block 10 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory_store = client.beta.memory_stores.archive(
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_memory_store.id)


// --- block 12 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory = client.beta.memory_stores.memories.create(
    memory_store_id="memory_store_id",
    content="content",
    path="xx",
)
print(beta_managed_agents_memory.id)


// --- block 14 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
page = client.beta.memory_stores.memories.list(
    memory_store_id="memory_store_id",
)
page = page.data[0]
print(page)


// --- block 16 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory = client.beta.memory_stores.memories.retrieve(
    memory_id="memory_id",
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_memory.id)


// --- block 18 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory = client.beta.memory_stores.memories.update(
    memory_id="memory_id",
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_memory.id)


// --- block 20 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_deleted_memory = client.beta.memory_stores.memories.delete(
    memory_id="memory_id",
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_deleted_memory.id)


// --- block 22 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
page = client.beta.memory_stores.memory_versions.list(
    memory_store_id="memory_store_id",
)
page = page.data[0]
print(page.id)


// --- block 24 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory_version = client.beta.memory_stores.memory_versions.retrieve(
    memory_version_id="memory_version_id",
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_memory_version.id)


// --- block 26 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_memory_version = client.beta.memory_stores.memory_versions.redact(
    memory_version_id="memory_version_id",
    memory_store_id="memory_store_id",
)
print(beta_managed_agents_memory_version.id)
