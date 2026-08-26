---
name: async-python-patterns
description: Helps build and debug async python patterns processes. Master Python asyncio, concurrent programming, and async/await patterns for high-performance applications. Use when building async APIs, concurrent systems, or I/O-bound applications requiring non-blocking operations.
---

# Claude Code Essentials for Async Python Patterns

Async Python development involves intricate concurrency logic, race conditions, and event loop management that benefit enormously from an AI coding agent. Claude Code can scaffold async patterns, run your asyncio code to verify correctness, and iteratively debug concurrency issues in real-time -- all from your terminal.

## Why These 13 Concepts Matter

Think of these concepts as your async development workbench. Code Execution is your live test runner that validates coroutines instantly. Terminal CLI is your command center for running async scripts and inspecting event loop behavior. Checkpoints protect you when refactoring complex concurrent logic. Together they form a toolkit purpose-built for the unique challenges of asynchronous Python programming.

## The 13 Concepts

### 1. Code Execution
**What:** Claude's ability to run code directly in your environment via the Bash tool, executing tests, builds, and scripts in real-time.
**Why:** Async code is notoriously hard to reason about statically. Running your coroutines, task groups, and producer-consumer patterns immediately reveals deadlocks, race conditions, and missing awaits that static analysis would miss.
**Example:**
```python
# Claude writes this, then runs it immediately to verify behavior
import asyncio

async def test_gather_error_handling():
    async def failing_task():
        raise ValueError("simulated failure")

    async def ok_task():
        return "success"

    results = await asyncio.gather(
        ok_task(), failing_task(), return_exceptions=True
    )
    assert results[0] == "success"
    assert isinstance(results[1], ValueError)
    print("All assertions passed")

asyncio.run(test_gather_error_handling())
```

### 2. Terminal CLI
**What:** Command-line interface for running Claude Code directly in your terminal for coding tasks.
**Why:** Async Python debugging often requires running scripts, inspecting output, and iterating quickly. The terminal CLI lets you ask Claude to write, run, and fix async code in a tight feedback loop without leaving your shell.
**Example:**
```bash
# Quick async debugging session from the terminal
claude "write an asyncio semaphore-based rate limiter that handles 5 concurrent requests, then run the tests"
```

### 3. Checkpoints
**What:** Git-based snapshots of progress that let you undo changes and restore to a known good state.
**Why:** Refactoring async code -- converting synchronous functions to coroutines, restructuring task groups, or migrating from threads to asyncio -- can cascade through your codebase. Checkpoints let you safely experiment knowing you can revert.
**Example:**
```
# After successfully converting sync database calls to async:
# Claude creates a checkpoint before tackling the next module
# If the websocket handler refactoring breaks something, revert instantly
```

### 4. Artifacts
**What:** Standalone, rendered content blocks (code, documents, diagrams) that Claude creates alongside conversation.
**Why:** Complex async architectures benefit from visual documentation. Claude can produce architecture diagrams showing task flow, queue relationships, and event loop interactions as artifacts you can reference while coding.
**Example:**
```
# Claude generates a complete async service module as an artifact:
# - Connection pool manager with async context managers
# - Producer-consumer queue implementation
# - Rate-limited API client wrapper
# All viewable and copyable as a standalone code block
```

### 5. Plan Mode
**What:** A mode where Claude explores and plans before making changes, creating a step-by-step implementation strategy.
**Why:** Converting a synchronous codebase to async requires careful sequencing -- you need to identify blocking calls, determine which functions become coroutines, and plan the migration order to avoid breaking intermediate states.
**Example:**
```
# Plan Mode output for async migration:
# Step 1: Audit all I/O calls in services/ directory
# Step 2: Convert database layer to async (asyncpg)
# Step 3: Convert HTTP client calls to aiohttp
# Step 4: Update FastAPI routes to async handlers
# Step 5: Add connection pooling and semaphores
# Step 6: Run full test suite with pytest-asyncio
```

### 6. Context Window
**What:** The amount of text Claude can see and reason about at once (200K tokens).
**Why:** Async codebases often have deeply interconnected modules -- event handlers, task factories, queue consumers, and error handlers all interact. The large context window lets Claude see all these pieces simultaneously to catch missed awaits and improper task lifecycle management.
**Example:**
```python
# Claude can analyze your entire async application at once:
# - main.py (event loop setup, signal handlers)
# - tasks.py (task factories, background workers)
# - queues.py (producer-consumer implementations)
# - clients.py (aiohttp sessions, connection pools)
# All in a single context to trace data flow end-to-end
```

### 7. Tool Use
**What:** Claude's ability to call external tools like file editors, terminal commands, web searches, and MCP servers.
**Why:** Debugging async Python often requires reading multiple files, running scripts, checking test output, and editing code -- all in rapid succession. Tool use lets Claude orchestrate this entire workflow seamlessly.
**Example:**
```
# Claude's workflow for fixing an async bug:
# 1. Read: examine the failing async test
# 2. Grep: find all callers of the broken coroutine
# 3. Edit: fix the missing await in the service layer
# 4. Bash: run pytest -xvs tests/test_async_service.py
# 5. Edit: fix the cascading issue revealed by the test
# 6. Bash: re-run and confirm all tests pass
```

### 8. CLAUDE.md
**What:** A configuration file that provides project context, coding conventions, and instructions to Claude Code automatically.
**Why:** Async Python projects have specific conventions -- preferred async libraries (aiohttp vs httpx), testing frameworks (pytest-asyncio vs anyio), and patterns (structured concurrency vs manual task management). Encoding these in CLAUDE.md ensures consistent output.
**Example:**
```markdown
# CLAUDE.md
## Async Conventions
- Use `asyncio.TaskGroup` (Python 3.11+) over manual gather
- All database access through `asyncpg` connection pools
- Rate limit external API calls with `asyncio.Semaphore`
- Test with `pytest-asyncio` using `auto` mode
- Never use `loop.run_until_complete()` -- use `asyncio.run()`
```

### 9. Headless Mode
**What:** Run Claude Code non-interactively via CLI flags for scripting, CI/CD, and automation pipelines.
**Why:** You can automate async code quality checks -- having Claude analyze your codebase for common async antipatterns (blocking calls in async functions, unawaited coroutines, missing error handling) as part of your CI pipeline.
**Example:**
```bash
# CI pipeline step: check for async antipatterns
claude -p "scan src/ for blocking calls inside async functions, unawaited coroutines, and missing asyncio.shield in cancellation-sensitive code. Report findings as JSON." --output-format json > async-audit.json
```

### 10. GitHub Actions
**What:** CI/CD integration that runs Claude Code agents automatically on GitHub events.
**Why:** Async Python PRs are particularly prone to subtle bugs. A GitHub Action can have Claude review async-specific concerns: proper cleanup in `__aexit__`, cancellation handling, and task lifecycle management.
**Example:**
```yaml
# .github/workflows/async-review.yml
- name: Review async patterns
  uses: anthropics/claude-code-action@v1
  with:
    prompt: |
      Review this PR for async Python issues:
      - Missing await keywords
      - Blocking calls inside async functions
      - Improper task cancellation handling
      - Resource cleanup in async context managers
```

### 11. Subagents
**What:** Specialized child agents spawned by Claude to handle specific subtasks in parallel or sequence.
**Why:** Large async codebases benefit from parallel analysis -- one subagent can audit your connection pool configuration while another reviews your error handling patterns, and a third checks your test coverage for async code paths.
**Example:**
```
# Claude spawns specialized subagents:
# Subagent 1: Analyze all asyncio.gather() calls for error handling
# Subagent 2: Check connection pool sizing across all async clients
# Subagent 3: Verify all async context managers have proper cleanup
# Results consolidated into a single report
```

### 12. Compaction
**What:** Automatic compression of conversation history when approaching context limits, summarizing earlier context to free space.
**Why:** Long async debugging sessions -- tracing a race condition through multiple modules, testing fixes, and iterating -- can consume significant context. Compaction preserves your key decisions and findings while freeing tokens for continued work.
**Example:**
```
# During a long debugging session for a race condition:
# Earlier context (compacted): "Identified race condition in queue consumer,
# tried Lock approach (failed due to deadlock), Semaphore approach works
# for read path but write path still has timing issue"
# Current context: full code for the write path fix being tested
```

### 13. Background Tasks
**What:** Long-running commands or agents that execute asynchronously while you continue working.
**Why:** Running a comprehensive async test suite (especially integration tests with real database connections and network calls) can take minutes. Background tasks let Claude kick off the test run while you discuss the next feature.
**Example:**
```bash
# Start the full async test suite in the background
# while continuing to discuss architecture decisions
claude "run pytest tests/ -x --timeout=60 -v and report results when done"
# Continue working on the next async module while tests run
```

## How These Concepts Work Together

When building async Python applications with Claude Code, these concepts form a natural development cycle:

1. **Plan Mode** maps out your async architecture and migration strategy
2. **CLAUDE.md** encodes your async conventions (libraries, patterns, testing approach)
3. **Context Window** lets Claude see your entire async codebase simultaneously
4. **Tool Use** orchestrates reading, editing, and running your async code
5. **Code Execution** validates coroutines, task groups, and concurrency logic in real-time
6. **Checkpoints** protect your progress during complex refactoring
7. **Subagents** parallelize analysis of large async codebases
8. **GitHub Actions** automate async-specific code review on every PR

### Quick Workflow: Debugging an Async Race Condition

```
1. Describe the symptoms to Claude in Terminal CLI
2. Claude enters Plan Mode to trace the data flow
3. Tool Use reads relevant async modules across the codebase
4. Context Window holds the full picture of interacting coroutines
5. Claude hypothesizes the cause, creates a Checkpoint
6. Code Execution runs a targeted reproduction script
7. Claude fixes the issue, re-runs tests via Code Execution
8. Checkpoint ensures you can revert if the fix has side effects
```

## Next Steps

- **fastapi-templates**: Apply these async patterns in a production FastAPI project
- **deployment-pipeline-design**: Set up CI/CD that validates your async code quality
- **auth-implementation-patterns**: Implement async authentication middleware

---

# Async Python Patterns

Comprehensive guidance for implementing asynchronous Python applications using asyncio, concurrent programming patterns, and async/await for building high-performance, non-blocking systems.

## When to Use This Skill

- Building async web APIs (FastAPI, aiohttp, Sanic)
- Implementing concurrent I/O operations (database, file, network)
- Creating web scrapers with concurrent requests
- Developing real-time applications (WebSocket servers, chat systems)
- Processing multiple independent tasks simultaneously
- Building microservices with async communication
- Optimizing I/O-bound workloads
- Implementing async background tasks and queues

## Core Concepts

### 1. Event Loop
The event loop is the heart of asyncio, managing and scheduling asynchronous tasks.

**Key characteristics:**
- Single-threaded cooperative multitasking
- Schedules coroutines for execution
- Handles I/O operations without blocking
- Manages callbacks and futures

### 2. Coroutines
Functions defined with `async def` that can be paused and resumed.

**Syntax:**
```python
async def my_coroutine():
    result = await some_async_operation()
    return result
```

### 3. Tasks
Scheduled coroutines that run concurrently on the event loop.

### 4. Futures
Low-level objects representing eventual results of async operations.

### 5. Async Context Managers
Resources that support `async with` for proper cleanup.

### 6. Async Iterators
Objects that support `async for` for iterating over async data sources.

## Quick Start

```python
import asyncio

async def main():
    print("Hello")
    await asyncio.sleep(1)
    print("World")

# Python 3.7+
asyncio.run(main())
```

## Fundamental Patterns

### Pattern 1: Basic Async/Await

```python
import asyncio

async def fetch_data(url: str) -> dict:
    """Fetch data from URL asynchronously."""
    await asyncio.sleep(1)  # Simulate I/O
    return {"url": url, "data": "result"}

async def main():
    result = await fetch_data("https://api.example.com")
    print(result)

asyncio.run(main())
```

### Pattern 2: Concurrent Execution with gather()

```python
import asyncio
from typing import List

async def fetch_user(user_id: int) -> dict:
    """Fetch user data."""
    await asyncio.sleep(0.5)
    return {"id": user_id, "name": f"User {user_id}"}

async def fetch_all_users(user_ids: List[int]) -> List[dict]:
    """Fetch multiple users concurrently."""
    tasks = [fetch_user(uid) for uid in user_ids]
    results = await asyncio.gather(*tasks)
    return results

async def main():
    user_ids = [1, 2, 3, 4, 5]
    users = await fetch_all_users(user_ids)
    print(f"Fetched {len(users)} users")

asyncio.run(main())
```

### Pattern 3: Task Creation and Management

```python
import asyncio

async def background_task(name: str, delay: int):
    """Long-running background task."""
    print(f"{name} started")
    await asyncio.sleep(delay)
    print(f"{name} completed")
    return f"Result from {name}"

async def main():
    # Create tasks
    task1 = asyncio.create_task(background_task("Task 1", 2))
    task2 = asyncio.create_task(background_task("Task 2", 1))

    # Do other work
    print("Main: doing other work")
    await asyncio.sleep(0.5)

    # Wait for tasks
    result1 = await task1
    result2 = await task2

    print(f"Results: {result1}, {result2}")

asyncio.run(main())
```

### Pattern 4: Error Handling in Async Code

```python
import asyncio
from typing import List, Optional

async def risky_operation(item_id: int) -> dict:
    """Operation that might fail."""
    await asyncio.sleep(0.1)
    if item_id % 3 == 0:
        raise ValueError(f"Item {item_id} failed")
    return {"id": item_id, "status": "success"}

async def safe_operation(item_id: int) -> Optional[dict]:
    """Wrapper with error handling."""
    try:
        return await risky_operation(item_id)
    except ValueError as e:
        print(f"Error: {e}")
        return None

async def process_items(item_ids: List[int]):
    """Process multiple items with error handling."""
    tasks = [safe_operation(iid) for iid in item_ids]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Filter out failures
    successful = [r for r in results if r is not None and not isinstance(r, Exception)]
    failed = [r for r in results if isinstance(r, Exception)]

    print(f"Success: {len(successful)}, Failed: {len(failed)}")
    return successful

asyncio.run(process_items([1, 2, 3, 4, 5, 6]))
```

### Pattern 5: Timeout Handling

```python
import asyncio

async def slow_operation(delay: int) -> str:
    """Operation that takes time."""
    await asyncio.sleep(delay)
    return f"Completed after {delay}s"

async def with_timeout():
    """Execute operation with timeout."""
    try:
        result = await asyncio.wait_for(slow_operation(5), timeout=2.0)
        print(result)
    except asyncio.TimeoutError:
        print("Operation timed out")

asyncio.run(with_timeout())
```

## Advanced Patterns

### Pattern 6: Async Context Managers

```python
import asyncio
from typing import Optional

class AsyncDatabaseConnection:
    """Async database connection context manager."""

    def __init__(self, dsn: str):
        self.dsn = dsn
        self.connection: Optional[object] = None

    async def __aenter__(self):
        print("Opening connection")
        await asyncio.sleep(0.1)  # Simulate connection
        self.connection = {"dsn": self.dsn, "connected": True}
        return self.connection

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Closing connection")
        await asyncio.sleep(0.1)  # Simulate cleanup
        self.connection = None

async def query_database():
    """Use async context manager."""
    async with AsyncDatabaseConnection("postgresql://localhost") as conn:
        print(f"Using connection: {conn}")
        await asyncio.sleep(0.2)  # Simulate query
        return {"rows": 10}

asyncio.run(query_database())
```

### Pattern 7: Async Iterators and Generators

```python
import asyncio
from typing import AsyncIterator

async def async_range(start: int, end: int, delay: float = 0.1) -> AsyncIterator[int]:
    """Async generator that yields numbers with delay."""
    for i in range(start, end):
        await asyncio.sleep(delay)
        yield i

async def fetch_pages(url: str, max_pages: int) -> AsyncIterator[dict]:
    """Fetch paginated data asynchronously."""
    for page in range(1, max_pages + 1):
        await asyncio.sleep(0.2)  # Simulate API call
        yield {
            "page": page,
            "url": f"{url}?page={page}",
            "data": [f"item_{page}_{i}" for i in range(5)]
        }

async def consume_async_iterator():
    """Consume async iterator."""
    async for number in async_range(1, 5):
        print(f"Number: {number}")

    print("\nFetching pages:")
    async for page_data in fetch_pages("https://api.example.com/items", 3):
        print(f"Page {page_data['page']}: {len(page_data['data'])} items")

asyncio.run(consume_async_iterator())
```

### Pattern 8: Producer-Consumer Pattern

```python
import asyncio
from asyncio import Queue
from typing import Optional

async def producer(queue: Queue, producer_id: int, num_items: int):
    """Produce items and put them in queue."""
    for i in range(num_items):
        item = f"Item-{producer_id}-{i}"
        await queue.put(item)
        print(f"Producer {producer_id} produced: {item}")
        await asyncio.sleep(0.1)
    await queue.put(None)  # Signal completion

async def consumer(queue: Queue, consumer_id: int):
    """Consume items from queue."""
    while True:
        item = await queue.get()
        if item is None:
            queue.task_done()
            break

        print(f"Consumer {consumer_id} processing: {item}")
        await asyncio.sleep(0.2)  # Simulate work
        queue.task_done()

async def producer_consumer_example():
    """Run producer-consumer pattern."""
    queue = Queue(maxsize=10)

    # Create tasks
    producers = [
        asyncio.create_task(producer(queue, i, 5))
        for i in range(2)
    ]

    consumers = [
        asyncio.create_task(consumer(queue, i))
        for i in range(3)
    ]

    # Wait for producers
    await asyncio.gather(*producers)

    # Wait for queue to be empty
    await queue.join()

    # Cancel consumers
    for c in consumers:
        c.cancel()

asyncio.run(producer_consumer_example())
```

### Pattern 9: Semaphore for Rate Limiting

```python
import asyncio
from typing import List

async def api_call(url: str, semaphore: asyncio.Semaphore) -> dict:
    """Make API call with rate limiting."""
    async with semaphore:
        print(f"Calling {url}")
        await asyncio.sleep(0.5)  # Simulate API call
        return {"url": url, "status": 200}

async def rate_limited_requests(urls: List[str], max_concurrent: int = 5):
    """Make multiple requests with rate limiting."""
    semaphore = asyncio.Semaphore(max_concurrent)
    tasks = [api_call(url, semaphore) for url in urls]
    results = await asyncio.gather(*tasks)
    return results

async def main():
    urls = [f"https://api.example.com/item/{i}" for i in range(20)]
    results = await rate_limited_requests(urls, max_concurrent=3)
    print(f"Completed {len(results)} requests")

asyncio.run(main())
```

### Pattern 10: Async Locks and Synchronization

```python
import asyncio

class AsyncCounter:
    """Thread-safe async counter."""

    def __init__(self):
        self.value = 0
        self.lock = asyncio.Lock()

    async def increment(self):
        """Safely increment counter."""
        async with self.lock:
            current = self.value
            await asyncio.sleep(0.01)  # Simulate work
            self.value = current + 1

    async def get_value(self) -> int:
        """Get current value."""
        async with self.lock:
            return self.value

async def worker(counter: AsyncCounter, worker_id: int):
    """Worker that increments counter."""
    for _ in range(10):
        await counter.increment()
        print(f"Worker {worker_id} incremented")

async def test_counter():
    """Test concurrent counter."""
    counter = AsyncCounter()

    workers = [asyncio.create_task(worker(counter, i)) for i in range(5)]
    await asyncio.gather(*workers)

    final_value = await counter.get_value()
    print(f"Final counter value: {final_value}")

asyncio.run(test_counter())
```

## Real-World Applications

### Web Scraping with aiohttp

```python
import asyncio
import aiohttp
from typing import List, Dict

async def fetch_url(session: aiohttp.ClientSession, url: str) -> Dict:
    """Fetch single URL."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
            text = await response.text()
            return {
                "url": url,
                "status": response.status,
                "length": len(text)
            }
    except Exception as e:
        return {"url": url, "error": str(e)}

async def scrape_urls(urls: List[str]) -> List[Dict]:
    """Scrape multiple URLs concurrently."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

async def main():
    urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2",
        "https://httpbin.org/status/404",
    ]

    results = await scrape_urls(urls)
    for result in results:
        print(result)

asyncio.run(main())
```

### Async Database Operations

```python
import asyncio
from typing import List, Optional

# Simulated async database client
class AsyncDB:
    """Simulated async database."""

    async def execute(self, query: str) -> List[dict]:
        """Execute query."""
        await asyncio.sleep(0.1)
        return [{"id": 1, "name": "Example"}]

    async def fetch_one(self, query: str) -> Optional[dict]:
        """Fetch single row."""
        await asyncio.sleep(0.1)
        return {"id": 1, "name": "Example"}

async def get_user_data(db: AsyncDB, user_id: int) -> dict:
    """Fetch user and related data concurrently."""
    user_task = db.fetch_one(f"SELECT * FROM users WHERE id = {user_id}")
    orders_task = db.execute(f"SELECT * FROM orders WHERE user_id = {user_id}")
    profile_task = db.fetch_one(f"SELECT * FROM profiles WHERE user_id = {user_id}")

    user, orders, profile = await asyncio.gather(user_task, orders_task, profile_task)

    return {
        "user": user,
        "orders": orders,
        "profile": profile
    }

async def main():
    db = AsyncDB()
    user_data = await get_user_data(db, 1)
    print(user_data)

asyncio.run(main())
```

### WebSocket Server

```python
import asyncio
from typing import Set

# Simulated WebSocket connection
class WebSocket:
    """Simulated WebSocket."""

    def __init__(self, client_id: str):
        self.client_id = client_id

    async def send(self, message: str):
        """Send message."""
        print(f"Sending to {self.client_id}: {message}")
        await asyncio.sleep(0.01)

    async def recv(self) -> str:
        """Receive message."""
        await asyncio.sleep(1)
        return f"Message from {self.client_id}"

class WebSocketServer:
    """Simple WebSocket server."""

    def __init__(self):
        self.clients: Set[WebSocket] = set()

    async def register(self, websocket: WebSocket):
        """Register new client."""
        self.clients.add(websocket)
        print(f"Client {websocket.client_id} connected")

    async def unregister(self, websocket: WebSocket):
        """Unregister client."""
        self.clients.remove(websocket)
        print(f"Client {websocket.client_id} disconnected")

    async def broadcast(self, message: str):
        """Broadcast message to all clients."""
        if self.clients:
            tasks = [client.send(message) for client in self.clients]
            await asyncio.gather(*tasks)

    async def handle_client(self, websocket: WebSocket):
        """Handle individual client connection."""
        await self.register(websocket)
        try:
            async for message in self.message_iterator(websocket):
                await self.broadcast(f"{websocket.client_id}: {message}")
        finally:
            await self.unregister(websocket)

    async def message_iterator(self, websocket: WebSocket):
        """Iterate over messages from client."""
        for _ in range(3):  # Simulate 3 messages
            yield await websocket.recv()
```

## Performance Best Practices

### 1. Use Connection Pools

```python
import asyncio
import aiohttp

async def with_connection_pool():
    """Use connection pool for efficiency."""
    connector = aiohttp.TCPConnector(limit=100, limit_per_host=10)

    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [session.get(f"https://api.example.com/item/{i}") for i in range(50)]
        responses = await asyncio.gather(*tasks)
        return responses
```

### 2. Batch Operations

```python
async def batch_process(items: List[str], batch_size: int = 10):
    """Process items in batches."""
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        tasks = [process_item(item) for item in batch]
        await asyncio.gather(*tasks)
        print(f"Processed batch {i // batch_size + 1}")

async def process_item(item: str):
    """Process single item."""
    await asyncio.sleep(0.1)
    return f"Processed: {item}"
```

### 3. Avoid Blocking Operations

```python
import asyncio
import concurrent.futures
from typing import Any

def blocking_operation(data: Any) -> Any:
    """CPU-intensive blocking operation."""
    import time
    time.sleep(1)
    return data * 2

async def run_in_executor(data: Any) -> Any:
    """Run blocking operation in thread pool."""
    loop = asyncio.get_event_loop()
    with concurrent.futures.ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, blocking_operation, data)
        return result

async def main():
    results = await asyncio.gather(*[run_in_executor(i) for i in range(5)])
    print(results)

asyncio.run(main())
```

## Common Pitfalls

### 1. Forgetting await

```python
# Wrong - returns coroutine object, doesn't execute
result = async_function()

# Correct
result = await async_function()
```

### 2. Blocking the Event Loop

```python
# Wrong - blocks event loop
import time
async def bad():
    time.sleep(1)  # Blocks!

# Correct
async def good():
    await asyncio.sleep(1)  # Non-blocking
```

### 3. Not Handling Cancellation

```python
async def cancelable_task():
    """Task that handles cancellation."""
    try:
        while True:
            await asyncio.sleep(1)
            print("Working...")
    except asyncio.CancelledError:
        print("Task cancelled, cleaning up...")
        # Perform cleanup
        raise  # Re-raise to propagate cancellation
```

### 4. Mixing Sync and Async Code

```python
# Wrong - can't call async from sync directly
def sync_function():
    result = await async_function()  # SyntaxError!

# Correct
def sync_function():
    result = asyncio.run(async_function())
```

## Testing Async Code

```python
import asyncio
import pytest

# Using pytest-asyncio
@pytest.mark.asyncio
async def test_async_function():
    """Test async function."""
    result = await fetch_data("https://api.example.com")
    assert result is not None

@pytest.mark.asyncio
async def test_with_timeout():
    """Test with timeout."""
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(slow_operation(5), timeout=1.0)
```

## Resources

- **Python asyncio documentation**: https://docs.python.org/3/library/asyncio.html
- **aiohttp**: Async HTTP client/server
- **FastAPI**: Modern async web framework
- **asyncpg**: Async PostgreSQL driver
- **motor**: Async MongoDB driver

## Best Practices Summary

1. **Use asyncio.run()** for entry point (Python 3.7+)
2. **Always await coroutines** to execute them
3. **Use gather() for concurrent execution** of multiple tasks
4. **Implement proper error handling** with try/except
5. **Use timeouts** to prevent hanging operations
6. **Pool connections** for better performance
7. **Avoid blocking operations** in async code
8. **Use semaphores** for rate limiting
9. **Handle task cancellation** properly
10. **Test async code** with pytest-asyncio
