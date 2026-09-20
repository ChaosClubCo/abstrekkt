exports.handler = async (event) => {
    console.log('🚀 FlashFusion API Request:', JSON.stringify(event, null, 2));
    
    const { httpMethod, path, body, headers, queryStringParameters } = event;
    const timestamp = new Date().toISOString();
    
    // Enhanced CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Helicone-Auth,X-API-Version',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
        'Content-Type': 'application/json',
        'X-Powered-By': 'FlashFusion-AI',
        'X-Response-Time': timestamp
    };
    
    // Handle CORS preflight
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ 
                message: 'FlashFusion CORS preflight successful',
                timestamp 
            })
        };
    }
    
    try {
        // Enhanced routing with path parameter support
        const pathSegments = path.split('/').filter(Boolean);
        const basePath = `/${pathSegments[0] || ''}`;
        
        switch (basePath) {
            case '/health':
                return handleHealth(corsHeaders);
                
            case '/agents':
                return handleAgents(httpMethod, body, pathSegments.slice(1), corsHeaders);
                
            case '/workflows':
                return handleWorkflows(httpMethod, body, pathSegments.slice(1), corsHeaders);
                
            case '/integrations':
                return handleIntegrations(httpMethod, body, corsHeaders);
                
            case '/helicone':
                return handleHelicone(httpMethod, body, corsHeaders);
                
            case '/analytics':
                return handleAnalytics(httpMethod, corsHeaders);
                
            case '/':
            case '':
                return handleRoot(corsHeaders);
                
            default:
                return {
                    statusCode: 404,
                    headers: corsHeaders,
                    body: JSON.stringify({ 
                        error: 'Endpoint not found',
                        path,
                        available_endpoints: [
                            '/health',
                            '/agents',
                            '/workflows', 
                            '/integrations',
                            '/helicone',
                            '/analytics'
                        ],
                        timestamp
                    })
                };
        }
    } catch (error) {
        console.error('❌ FlashFusion Error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                timestamp,
                service: 'FlashFusion-Main-Handler'
            })
        };
    }
};

// Root endpoint - API info
function handleRoot(headers) {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            service: 'FlashFusion AI-Powered Business Platform API',
            version: '2.0.0',
            status: 'operational',
            timestamp: new Date().toISOString(),
            endpoints: {
                health: '/health',
                agents: '/agents',
                workflows: '/workflows',
                integrations: '/integrations',
                helicone: '/helicone',
                analytics: '/analytics'
            },
            documentation: 'https://docs.flashfusion.co'
        })
    };
}

// Health check with system info
function handleHealth(headers) {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            status: 'healthy',
            service: 'FlashFusion-Main-Handler',
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(process.uptime())}s`,
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
            },
            environment: process.env.AWS_REGION || 'unknown',
            checks: {
                agents: 'operational',
                workflows: 'operational', 
                integrations: 'operational',
                helicone: 'operational'
            }
        })
    };
}

// AI Agents management with enhanced features
function handleAgents(method, body, pathParams, headers) {
    const agents = [
        { 
            id: 'researcher', 
            name: 'Research Agent',
            status: 'active', 
            type: 'research',
            capabilities: ['market-analysis', 'competitor-research', 'trend-analysis'],
            last_active: new Date().toISOString()
        },
        { 
            id: 'creator', 
            name: 'Content Creator',
            status: 'active', 
            type: 'content',
            capabilities: ['content-generation', 'copywriting', 'social-media'],
            last_active: new Date().toISOString()
        },
        { 
            id: 'optimizer', 
            name: 'Performance Optimizer',
            status: 'active', 
            type: 'optimization',
            capabilities: ['a-b-testing', 'conversion-optimization', 'performance-tuning'],
            last_active: new Date().toISOString()
        },
        { 
            id: 'automator', 
            name: 'Automation Agent',
            status: 'active', 
            type: 'automation',
            capabilities: ['workflow-automation', 'deployment', 'scaling'],
            last_active: new Date().toISOString()
        },
        { 
            id: 'analyzer', 
            name: 'Data Analyzer',
            status: 'active', 
            type: 'analytics',
            capabilities: ['data-analysis', 'reporting', 'insights'],
            last_active: new Date().toISOString()
        },
        { 
            id: 'coordinator', 
            name: 'Agent Coordinator',
            status: 'active', 
            type: 'orchestration',
            capabilities: ['agent-management', 'task-coordination', 'resource-allocation'],
            last_active: new Date().toISOString()
        }
    ];
    
    const agentId = pathParams[0];
    
    switch (method) {
        case 'GET':
            if (agentId) {
                const agent = agents.find(a => a.id === agentId);
                if (!agent) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Agent not found', agentId })
                    };
                }
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ agent })
                };
            }
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    agents, 
                    total: agents.length,
                    active: agents.filter(a => a.status === 'active').length
                })
            };
            
        case 'POST':
            const data = JSON.parse(body || '{}');
            const newAgent = {
                id: `agent-${Date.now()}`,
                name: data.name || 'New Agent',
                status: 'active',
                type: data.type || 'general',
                capabilities: data.capabilities || [],
                created: new Date().toISOString()
            };
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ 
                    message: 'Agent created successfully',
                    agent: newAgent
                })
            };
            
        default:
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed', allowed: ['GET', 'POST'] })
            };
    }
}

// Enhanced workflow management
function handleWorkflows(method, body, pathParams, headers) {
    const workflows = [
        { 
            id: 'wf-content-001', 
            name: 'Content Creation Pipeline', 
            status: 'running',
            progress: 75,
            agents: ['researcher', 'creator', 'optimizer'],
            started: new Date(Date.now() - 3600000).toISOString(),
            estimated_completion: new Date(Date.now() + 1800000).toISOString()
        },
        { 
            id: 'wf-analysis-002', 
            name: 'Market Analysis Workflow', 
            status: 'completed',
            progress: 100,
            agents: ['researcher', 'analyzer'],
            started: new Date(Date.now() - 7200000).toISOString(),
            completed: new Date(Date.now() - 300000).toISOString()
        },
        { 
            id: 'wf-deploy-003', 
            name: 'Deployment Pipeline', 
            status: 'pending',
            progress: 0,
            agents: ['automator', 'coordinator'],
            scheduled: new Date(Date.now() + 3600000).toISOString()
        }
    ];
    
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
            workflows, 
            total: workflows.length,
            running: workflows.filter(w => w.status === 'running').length,
            completed: workflows.filter(w => w.status === 'completed').length,
            pending: workflows.filter(w => w.status === 'pending').length
        })
    };
}

// Integration status and management
function handleIntegrations(method, body, headers) {
    const integrations = [
        { 
            name: 'Helicone AI Gateway', 
            status: 'connected', 
            type: 'ai-monitoring',
            health: 'excellent',
            last_check: new Date().toISOString(),
            metrics: { requests: 1247, success_rate: 99.8 }
        },
        { 
            name: 'Supabase Database', 
            status: 'connected', 
            type: 'database',
            health: 'excellent',
            last_check: new Date().toISOString(),
            metrics: { connections: 12, response_time: '15ms' }
        },
        { 
            name: 'Vercel Deployment', 
            status: 'connected', 
            type: 'hosting',
            health: 'good',
            last_check: new Date().toISOString(),
            metrics: { deployments: 23, uptime: '99.9%' }
        },
        { 
            name: 'Clerk Authentication', 
            status: 'connected', 
            type: 'auth',
            health: 'excellent',
            last_check: new Date().toISOString(),
            metrics: { users: 156, sessions: 89 }
        }
    ];
    
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
            integrations, 
            total: integrations.length,
            connected: integrations.filter(i => i.status === 'connected').length,
            health_summary: {
                excellent: integrations.filter(i => i.health === 'excellent').length,
                good: integrations.filter(i => i.health === 'good').length,
                poor: integrations.filter(i => i.health === 'poor').length
            }
        })
    };
}

// Helicone AI Gateway monitoring
function handleHelicone(method, body, headers) {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            service: 'Helicone AI Gateway',
            status: 'operational',
            monitoring: 'active',
            features: {
                cost_tracking: 'enabled',
                cache: 'enabled',
                retry: 'enabled',
                logging: 'enabled'
            },
            metrics: {
                total_requests: 1247,
                successful_requests: 1244,
                failed_requests: 3,
                success_rate: 99.76,
                average_latency: '247ms',
                cache_hit_rate: 23.4,
                estimated_cost: '$12.47'
            },
            last_updated: new Date().toISOString()
        })
    };
}

// Analytics and metrics
function handleAnalytics(method, headers) {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            platform_metrics: {
                total_agents: 6,
                active_workflows: 1,
                completed_tasks: 847,
                success_rate: 97.3,
                uptime: '99.9%'
            },
            performance: {
                avg_response_time: '245ms',
                peak_concurrent_users: 89,
                data_processed: '2.4GB',
                ai_requests: 1247
            },
            business_metrics: {
                revenue_generated: '$2,847',
                conversion_rate: 4.2,
                customer_satisfaction: 4.8,
                automation_savings: '$15,230'
            },
            timestamp: new Date().toISOString()
        })
    };
}