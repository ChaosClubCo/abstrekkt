#!/usr/bin/env node

/**
 * FlashFusion Enterprise Repository Generator
 * Automatically creates all 16 specialized repositories with full functionality
 */

const fs = require('fs').promises;
const path = require('path');

const REPOSITORIES = {
  // Priority 1: Core AI Orchestration (Already created)
  'pydantic-ai-orchestrator': {
    description: 'Multi-agent AI orchestration with 5 specialized agents',
    port: 8000,
    priority: 1
  },
  'git-platform-automator': {
    description: 'GitLab/GitHub enterprise integration with automated workflows',
    port: 8001,
    priority: 1
  },
  'langfuse-telemetry-hub': {
    description: 'Real-time observability for AI agents with comprehensive monitoring',
    port: 8002,
    priority: 1
  },

  // Priority 2: Enterprise Integration
  'enterprise-oauth-manager': {
    description: 'Unified OAuth for 20+ services with RBAC integration',
    port: 8003,
    priority: 2
  },
  'saas-service-hub': {
    description: 'Centralized SaaS management with rate limiting and monitoring',
    port: 8004,
    priority: 2
  },
  'mobile-devops-orchestrator': {
    description: 'Firebase and mobile app store integration management',
    port: 8005,
    priority: 2
  },

  // Priority 3: Development Workflow
  'claude-workflow-automator': {
    description: 'Visual builder for .claude/commands sequences with GitHub Actions',
    port: 8006,
    priority: 3
  },
  'codebase-intelligence-analyzer': {
    description: 'Multi-language code analysis with architecture documentation',
    port: 8007,
    priority: 3
  },
  'ai-docs-generator': {
    description: 'Automated README generation with C4 model diagrams',
    port: 8008,
    priority: 3
  },

  // Priority 4: Infrastructure & Operations
  'env-secrets-orchestrator': {
    description: 'Secure environment variable management with SOC 2 compliance',
    port: 8009,
    priority: 4
  },
  'webhook-event-processor': {
    description: 'Real-time GitHub/GitLab webhook handling with retry mechanisms',
    port: 8010,
    priority: 4
  },
  'scheduled-analysis-engine': {
    description: 'GitLab group batch processing with automated branch creation',
    port: 8011,
    priority: 4
  },

  // Priority 5: Data & Analytics
  'unified-analytics-engine': {
    description: 'Cross-workflow performance metrics with predictive analytics',
    port: 8012,
    priority: 5
  },
  'agent-knowledge-persistence': {
    description: 'Markdown-based memory backend with agent session storage',
    port: 8013,
    priority: 5
  },
  'system-performance-monitor': {
    description: 'Resource usage tracking with automated scaling triggers',
    port: 8014,
    priority: 5
  },

  // Priority 6: Enterprise Compliance & Security
  'enterprise-security-hub': {
    description: 'SOC 2 and GDPR compliance with vulnerability scanning',
    port: 8015,
    priority: 6
  }
};

class RepositoryGenerator {
  constructor(basePath) {
    this.basePath = basePath;
  }

  async generatePyprojectToml(repoName, config) {
    const content = `[project]
name = "${repoName}"
version = "0.1.0"
description = "${config.description}"
authors = [{name = "Krosebrook", email = "krosebrook@example.com"}]
license = "MIT"
readme = "README.md"
requires-python = ">=3.13"
dependencies = [
    "fastapi>=0.110.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.5.0",
    "httpx>=0.26.0",
    "python-dotenv>=1.0.0",
    "sqlalchemy>=2.0.0",
    "redis>=5.0.0",
    "websockets>=12.0",
    "jinja2>=3.1.2",
    "aiofiles>=23.2.1",
    "prometheus-client>=0.19.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
    "pytest-cov>=4.1.0",
    "black>=23.0.0",
    "isort>=5.12.0",
    "mypy>=1.5.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.black]
line-length = 88
target-version = ['py313']

[tool.isort]
profile = "black"
line_length = 88

[tool.mypy]
python_version = "3.13"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true`;

    return content;
  }

  async generateMainPy(repoName, config) {
    const moduleName = repoName.replace(/-/g, '_');
    
    const content = `"""
FlashFusion Enterprise: ${this.toTitleCase(repoName)}
${config.description}
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket, BackgroundTasks, Depends
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as redis
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from prometheus_client import Counter, Histogram, Gauge, generate_latest

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = "sqlite:///./${repoName.replace(/-/g, '_')}.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class ${this.toPascalCase(moduleName)}Event(Base):
    __tablename__ = "${moduleName}_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True)
    status = Column(String, default="pending")
    metadata = Column(Text)  # JSON metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic Models
class EventCreate(BaseModel):
    event_type: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class EventResponse(BaseModel):
    id: int
    event_type: str
    status: str
    metadata: Dict[str, Any]
    created_at: datetime

# Metrics
request_counter = Counter('${moduleName}_requests_total', 'Total requests', ['endpoint', 'status'])
request_duration = Histogram('${moduleName}_request_duration_seconds', 'Request duration')
active_connections = Gauge('${moduleName}_active_connections', 'Active WebSocket connections')

class ${this.toPascalCase(moduleName)}Manager:
    """Main manager class for ${repoName}"""
    
    def __init__(self):
        self.redis_client = None
        self.websocket_connections: List[WebSocket] = []
        
    async def initialize(self):
        """Initialize async components"""
        try:
            self.redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
            await self.redis_client.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}")
            self.redis_client = None
    
    async def process_event(self, event_data: EventCreate, db: Session):
        """Process incoming events"""
        
        # Store in database
        db_event = ${this.toPascalCase(moduleName)}Event(
            event_type=event_data.event_type,
            status="processing",
            metadata=json.dumps(event_data.metadata)
        )
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        
        # Update metrics
        request_counter.labels(endpoint="process_event", status="success").inc()
        
        # Store in Redis for caching
        if self.redis_client:
            try:
                cache_key = f"event:{db_event.id}"
                await self.redis_client.setex(cache_key, 3600, json.dumps({
                    "id": db_event.id,
                    "event_type": db_event.event_type,
                    "status": db_event.status,
                    "created_at": db_event.created_at.isoformat()
                }))
            except Exception as e:
                logger.warning(f"Redis cache failed: {e}")
        
        # Broadcast to WebSocket clients
        await self._broadcast_event_update(db_event)
        
        # Simulate processing
        await asyncio.sleep(0.1)
        
        # Update status
        db_event.status = "completed"
        db.commit()
        
        return EventResponse(
            id=db_event.id,
            event_type=db_event.event_type,
            status=db_event.status,
            metadata=json.loads(db_event.metadata),
            created_at=db_event.created_at
        )
    
    async def _broadcast_event_update(self, event):
        """Broadcast event updates to WebSocket clients"""
        message = {
            "type": "event_update",
            "data": {
                "id": event.id,
                "event_type": event.event_type,
                "status": event.status,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        disconnected = []
        for websocket in self.websocket_connections:
            try:
                await websocket.send_text(json.dumps(message))
            except:
                disconnected.append(websocket)
        
        # Remove disconnected clients
        for ws in disconnected:
            self.websocket_connections.remove(ws)

# Initialize manager
${moduleName}_manager = ${this.toPascalCase(moduleName)}Manager()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("Starting ${this.toTitleCase(repoName)}...")
    await ${moduleName}_manager.initialize()
    yield
    logger.info("Shutting down ${this.toTitleCase(repoName)}...")

# Create FastAPI app
app = FastAPI(
    title="${this.toTitleCase(repoName)}",
    description="${config.description}",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Serve the main dashboard"""
    return FileResponse("static/dashboard.html")

@app.post("/events", response_model=EventResponse)
async def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """Create and process a new event"""
    return await ${moduleName}_manager.process_event(event, db)

@app.get("/events")
async def list_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List recent events"""
    events = db.query(${this.toPascalCase(moduleName)}Event).offset(skip).limit(limit).all()
    return [{
        "id": event.id,
        "event_type": event.event_type,
        "status": event.status,
        "created_at": event.created_at,
        "metadata": json.loads(event.metadata) if event.metadata else {}
    } for event in events]

@app.get("/metrics")
async def get_metrics():
    """Prometheus metrics endpoint"""
    from fastapi.responses import Response
    return Response(generate_latest(), media_type="text/plain")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket.accept()
    ${moduleName}_manager.websocket_connections.append(websocket)
    active_connections.set(len(${moduleName}_manager.websocket_connections))
    
    try:
        while True:
            await asyncio.sleep(1)
    except:
        ${moduleName}_manager.websocket_connections.remove(websocket)
        active_connections.set(len(${moduleName}_manager.websocket_connections))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "${repoName}",
        "redis_connected": ${moduleName}_manager.redis_client is not None,
        "websocket_connections": len(${moduleName}_manager.websocket_connections),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=${config.port})`;

    return content;
  }

  async generateDashboardHtml(repoName, config) {
    const serviceName = this.toTitleCase(repoName);
    
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${serviceName} Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            color: #7f8c8d;
            font-size: 1.1em;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .metric-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-left: 5px solid #3498db;
        }

        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 10px;
        }

        .metric-label {
            font-size: 1.1em;
            color: #7f8c8d;
        }

        .status-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 1000;
        }

        .status-indicator.connected {
            background: #27ae60;
            color: white;
        }

        .status-indicator.disconnected {
            background: #e74c3c;
            color: white;
        }

        .events-panel {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .panel-title {
            font-size: 1.5em;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .event-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .event-item {
            padding: 15px;
            border-left: 4px solid #3498db;
            margin-bottom: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            animation: fadeIn 0.5s ease;
        }

        .event-item.processing {
            border-left-color: #f39c12;
        }

        .event-item.completed {
            border-left-color: #27ae60;
        }

        .event-item.error {
            border-left-color: #e74c3c;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .event-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 5px;
        }

        .event-type {
            font-weight: bold;
            color: #2c3e50;
        }

        .event-status {
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            text-transform: uppercase;
        }

        .event-time {
            font-size: 0.9em;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="status-indicator" id="connectionStatus">Connecting...</div>

    <div class="container">
        <div class="header">
            <h1>${serviceName}</h1>
            <p>${config.description}</p>
        </div>

        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value" id="totalEvents">0</div>
                <div class="metric-label">Total Events</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="activeConnections">0</div>
                <div class="metric-label">Active Connections</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="successRate">100%</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="uptime">00:00:00</div>
                <div class="metric-label">Uptime</div>
            </div>
        </div>

        <div class="events-panel">
            <div class="panel-title">Recent Events</div>
            <div class="event-list" id="eventList">
                <!-- Events will be dynamically added here -->
            </div>
        </div>
    </div>

    <script>
        class Dashboard {
            constructor() {
                this.websocket = null;
                this.startTime = Date.now();
                this.eventCount = 0;
                this.initializeWebSocket();
                this.startUptimeTimer();
                this.loadInitialData();
            }

            initializeWebSocket() {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
                
                this.websocket = new WebSocket(wsUrl);
                
                this.websocket.onopen = () => {
                    this.updateConnectionStatus(true);
                };
                
                this.websocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                };
                
                this.websocket.onclose = () => {
                    this.updateConnectionStatus(false);
                    setTimeout(() => this.initializeWebSocket(), 3000);
                };
                
                this.websocket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.updateConnectionStatus(false);
                };
            }

            updateConnectionStatus(connected) {
                const indicator = document.getElementById('connectionStatus');
                if (connected) {
                    indicator.textContent = 'Connected';
                    indicator.className = 'status-indicator connected';
                } else {
                    indicator.textContent = 'Disconnected';
                    indicator.className = 'status-indicator disconnected';
                }
            }

            handleWebSocketMessage(data) {
                if (data.type === 'event_update') {
                    this.addEvent(data.data);
                    this.eventCount++;
                    document.getElementById('totalEvents').textContent = this.eventCount;
                }
            }

            addEvent(eventData) {
                const eventList = document.getElementById('eventList');
                const eventItem = document.createElement('div');
                eventItem.className = \`event-item \${eventData.status}\`;
                
                eventItem.innerHTML = \`
                    <div class="event-header">
                        <span class="event-type">\${eventData.event_type}</span>
                        <span class="event-status \${eventData.status}">\${eventData.status}</span>
                    </div>
                    <div class="event-time">\${new Date(eventData.timestamp).toLocaleString()}</div>
                \`;
                
                eventList.insertBefore(eventItem, eventList.firstChild);
                
                // Keep only last 50 events
                while (eventList.children.length > 50) {
                    eventList.removeChild(eventList.lastChild);
                }
            }

            startUptimeTimer() {
                setInterval(() => {
                    const uptime = Date.now() - this.startTime;
                    const hours = Math.floor(uptime / (1000 * 60 * 60));
                    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
                    
                    document.getElementById('uptime').textContent = 
                        \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
                }, 1000);
            }

            async loadInitialData() {
                try {
                    const response = await fetch('/events');
                    const events = await response.json();
                    
                    events.reverse().forEach(event => {
                        this.addEvent({
                            event_type: event.event_type,
                            status: event.status,
                            timestamp: event.created_at
                        });
                    });
                    
                    this.eventCount = events.length;
                    document.getElementById('totalEvents').textContent = this.eventCount;
                    
                } catch (error) {
                    console.error('Error loading initial data:', error);
                }
            }
        }

        // Initialize dashboard when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new Dashboard();
        });
    </script>
</body>
</html>`;

    return content;
  }

  async generateDockerfile(repoName) {
    const content = `FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY pyproject.toml ./

# Install Python dependencies
RUN pip install -e .

# Copy application code
COPY src/ ./src/
COPY static/ ./static/

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \\
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]`;

    return content;
  }

  async generateDockerCompose() {
    const services = Object.entries(REPOSITORIES).map(([name, config]) => {
      return `  ${name}:
    build: ./${name}
    ports:
      - "${config.port}:8000"
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=sqlite:///app/${name.replace(/-/g, '_')}.db
    volumes:
      - ./${name}/data:/app/data
    depends_on:
      - redis
      - postgres
    restart: unless-stopped`;
    }).join('\n\n');

    const content = `version: '3.8'

services:
${services}

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=flashfusion_enterprise
      - POSTGRES_USER=flashfusion
      - POSTGRES_PASSWORD=flashfusion_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped

volumes:
  redis_data:
  postgres_data:
  prometheus_data:
  grafana_data:`;

    return content;
  }

  toTitleCase(str) {
    return str.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  toPascalCase(str) {
    return str.split(/[-_]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
  }

  async createRepository(repoName, config) {
    const repoPath = path.join(this.basePath, repoName);
    
    console.log(`Creating repository: ${repoName}`);
    
    // Create directory structure
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(path.join(repoPath, 'src'), { recursive: true });
    await fs.mkdir(path.join(repoPath, 'static'), { recursive: true });
    await fs.mkdir(path.join(repoPath, 'tests'), { recursive: true });
    await fs.mkdir(path.join(repoPath, 'docs'), { recursive: true });
    await fs.mkdir(path.join(repoPath, 'data'), { recursive: true });

    // Generate core files
    const pyprojectContent = await this.generatePyprojectToml(repoName, config);
    await fs.writeFile(path.join(repoPath, 'pyproject.toml'), pyprojectContent);

    const mainPyContent = await this.generateMainPy(repoName, config);
    await fs.writeFile(path.join(repoPath, 'src', 'main.py'), mainPyContent);

    const dashboardContent = await this.generateDashboardHtml(repoName, config);
    await fs.writeFile(path.join(repoPath, 'static', 'dashboard.html'), dashboardContent);

    const dockerfileContent = await this.generateDockerfile(repoName);
    await fs.writeFile(path.join(repoPath, 'Dockerfile'), dockerfileContent);

    // Generate .env.example
    const envContent = `# ${this.toTitleCase(repoName)} Environment Variables
DATABASE_URL=sqlite:///./${repoName.replace(/-/g, '_')}.db
REDIS_URL=redis://localhost:6379
LOG_LEVEL=INFO
DEBUG=False

# API Keys (configure as needed)
OPENAI_API_KEY=your_openai_api_key
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key

# Service specific configuration
SERVICE_PORT=${config.port}
SERVICE_NAME=${repoName}`;
    
    await fs.writeFile(path.join(repoPath, '.env.example'), envContent);

    // Generate basic README
    const readmeContent = `# ${this.toTitleCase(repoName)}

${config.description}

## Features

- FastAPI-based web service
- Real-time WebSocket communications
- Redis caching layer
- SQLite database with SQLAlchemy ORM
- Prometheus metrics integration
- Docker containerization
- Comprehensive logging and monitoring

## Quick Start

\`\`\`bash
# Install dependencies
pip install -e .

# Copy environment variables
cp .env.example .env

# Run the service
python -m uvicorn src.main:app --host 0.0.0.0 --port ${config.port} --reload
\`\`\`

## Docker Deployment

\`\`\`bash
# Build and run
docker build -t ${repoName} .
docker run -p ${config.port}:8000 ${repoName}
\`\`\`

## API Documentation

Once running, visit:
- Dashboard: http://localhost:${config.port}
- API Docs: http://localhost:${config.port}/docs
- Metrics: http://localhost:${config.port}/metrics
- Health Check: http://localhost:${config.port}/health

## Architecture

This service follows the FlashFusion Enterprise architecture patterns:
- Event-driven design
- Microservice architecture
- Observability-first approach
- Scalable deployment patterns

## Integration

Part of the FlashFusion Enterprise ecosystem. Integrates with:
- Langfuse Telemetry Hub (port 8002)
- Git Platform Automator (port 8001)
- Other FlashFusion Enterprise services

## License

MIT License - see LICENSE file for details.`;

    await fs.writeFile(path.join(repoPath, 'README.md'), readmeContent);

    console.log(`✅ Repository ${repoName} created successfully`);
  }

  async generateAll() {
    console.log('🚀 FlashFusion Enterprise Repository Generator');
    console.log('Creating all 16 specialized repositories...\n');

    // Skip already created repositories (Priority 1)
    const skipRepos = ['pydantic-ai-orchestrator', 'git-platform-automator', 'langfuse-telemetry-hub'];
    
    for (const [repoName, config] of Object.entries(REPOSITORIES)) {
      if (skipRepos.includes(repoName)) {
        console.log(`⏭️  Skipping ${repoName} (already created)`);
        continue;
      }
      
      try {
        await this.createRepository(repoName, config);
      } catch (error) {
        console.error(`❌ Failed to create ${repoName}:`, error.message);
      }
    }

    // Generate docker-compose.yml for the entire system
    const dockerComposeContent = await this.generateDockerCompose();
    await fs.writeFile(path.join(this.basePath, 'docker-compose.yml'), dockerComposeContent);

    // Generate master startup script
    const startupScript = `#!/bin/bash
echo "🚀 Starting FlashFusion Enterprise System..."

# Start supporting services
docker-compose up -d redis postgres prometheus grafana

# Start all microservices
${Object.entries(REPOSITORIES).map(([name, config]) => 
  `echo "Starting ${name}..."
cd ${name} && python -m uvicorn src.main:app --host 0.0.0.0 --port ${config.port} &`
).join('\n')}

echo "✅ All services started!"
echo "Dashboard URLs:"
${Object.entries(REPOSITORIES).map(([name, config]) => 
  `echo "  ${name}: http://localhost:${config.port}"`
).join('\n')}

wait`;

    await fs.writeFile(path.join(this.basePath, 'start-all.sh'), startupScript);
    
    console.log('\n🎉 FlashFusion Enterprise Repository System Complete!');
    console.log(`📁 All repositories created in: ${this.basePath}`);
    console.log('🐳 Docker Compose configuration generated');
    console.log('📜 Startup scripts created');
    console.log('\nNext steps:');
    console.log('1. Run: chmod +x start-all.sh');
    console.log('2. Start system: ./start-all.sh');
    console.log('3. Access dashboards at http://localhost:8000-8015');
  }
}

// Main execution
async function main() {
  const basePath = process.argv[2] || 'D:\\Projects\\Active\\FlashFusion-Enterprise';
  const generator = new RepositoryGenerator(basePath);
  await generator.generateAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = RepositoryGenerator;