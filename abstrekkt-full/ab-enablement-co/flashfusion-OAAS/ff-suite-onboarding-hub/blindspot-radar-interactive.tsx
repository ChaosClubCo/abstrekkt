import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Search, Brain, TrendingUp, Users, Lock, Zap, Eye, Target, Layers, FileText, Download, Settings } from 'lucide-react';

const BlindSpotRadar = () => {
  const [activeView, setActiveView] = useState('radar');
  const [analysisInput, setAnalysisInput] = useState('');
  const [blindSpots, setBlindSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [securityMode, setSecurityMode] = useState(true);
  const [radarData, setRadarData] = useState([]);
  const canvasRef = useRef(null);
  const [selectedBlindSpot, setSelectedBlindSpot] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Security-validated input sanitization
  const sanitizeInput = (input) => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>\"']/g, '')
      .trim()
      .substring(0, 500); // Max length enforcement
  };

  // Comprehensive blindspot categories with security focus
  const blindSpotCategories = {
    security: {
      color: '#dc2626',
      icon: Shield,
      label: 'Security Vulnerabilities'
    },
    compliance: {
      color: '#7c3aed',
      icon: Lock,
      label: 'Compliance Gaps'
    },
    market: {
      color: '#059669',
      icon: TrendingUp,
      label: 'Market Intelligence'
    },
    technical: {
      color: '#ea580c',
      icon: Zap,
      label: 'Technical Debt'
    },
    operational: {
      color: '#0284c7',
      icon: Users,
      label: 'Operational Risks'
    },
    strategic: {
      color: '#7c2d12',
      icon: Target,
      label: 'Strategic Blindspots'
    }
  };

  // Simulated analysis engine with security-first approach
  const performBlindSpotAnalysis = async () => {
    if (!analysisInput.trim()) {
      alert('Please enter analysis parameters');
      return;
    }

    const sanitizedInput = sanitizeInput(analysisInput);
    setLoading(true);

    try {
      // Simulate API call with timeout and error handling
      await new Promise(resolve => setTimeout(resolve, 2000));

      const simulatedBlindSpots = [
        {
          id: 'BS001',
          category: 'security',
          title: 'Input Validation Missing',
          severity: 'Critical',
          riskScore: 9.2,
          description: 'No server-side validation for user inputs creates XSS and injection vulnerabilities',
          impact: 'Data breach, system compromise, regulatory penalties',
          recommendation: 'Implement allowlist-based input validation with sanitization',
          timeline: '1-2 weeks',
          effort: 'Medium',
          coordinates: { angle: 45, radius: 85 }
        },
        {
          id: 'BS002',
          category: 'compliance',
          title: 'GDPR Data Processing Gap',
          severity: 'High',
          riskScore: 8.1,
          description: 'No explicit consent mechanism for EU user data processing',
          impact: 'Legal penalties up to 4% of annual revenue, reputation damage',
          recommendation: 'Implement consent management platform with audit trails',
          timeline: '3-4 weeks',
          effort: 'High',
          coordinates: { angle: 120, radius: 75 }
        },
        {
          id: 'BS003',
          category: 'technical',
          title: 'Database Connection Pooling',
          severity: 'Medium',
          riskScore: 6.8,
          description: 'Direct database connections without pooling limit scalability',
          impact: 'Performance degradation under load, service timeouts',
          recommendation: 'Implement connection pooling with pgBouncer or similar',
          timeline: '1 week',
          effort: 'Low',
          coordinates: { angle: 200, radius: 60 }
        },
        {
          id: 'BS004',
          category: 'market',
          title: 'Competitor Intelligence Gap',
          severity: 'Medium',
          riskScore: 6.2,
          description: 'No systematic monitoring of competitor feature releases',
          impact: 'Market share loss, missed opportunities, reactive strategy',
          recommendation: 'Set up automated competitor monitoring and analysis',
          timeline: '2 weeks',
          effort: 'Medium',
          coordinates: { angle: 280, radius: 55 }
        },
        {
          id: 'BS005',
          category: 'operational',
          title: 'Incident Response Plan Missing',
          severity: 'High',
          riskScore: 7.9,
          description: 'No documented procedure for security incident handling',
          impact: 'Extended downtime, data loss, regulatory non-compliance',
          recommendation: 'Develop comprehensive incident response playbook',
          timeline: '2-3 weeks',
          effort: 'Medium',
          coordinates: { angle: 15, radius: 70 }
        },
        {
          id: 'BS006',
          category: 'strategic',
          title: 'Technical Debt Accumulation',
          severity: 'Medium',
          riskScore: 6.5,
          description: 'No systematic tracking of technical debt and refactoring needs',
          impact: 'Reduced development velocity, increased maintenance costs',
          recommendation: 'Implement technical debt tracking and budgeting process',
          timeline: '1 week',
          effort: 'Low',
          coordinates: { angle: 340, radius: 58 }
        }
      ];

      setBlindSpots(simulatedBlindSpots);
      setRadarData(simulatedBlindSpots);
      setLoading(false);
    } catch (error) {
      console.error('Analysis failed:', error);
      setLoading(false);
      alert('Analysis failed. Please try again or contact support.');
    }
  };

  // Interactive radar chart renderer
  const drawRadar = () => {
    const canvas = canvasRef.current;
    if (!canvas || radarData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 40;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw radar grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Concentric circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Risk level labels
    const riskLevels = ['Low', 'Medium', 'High', 'Critical', 'Extreme'];
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    
    riskLevels.forEach((level, i) => {
      const radius = (maxRadius / 5) * (i + 1);
      ctx.fillText(level, centerX, centerY - radius + 15);
    });

    // Draw radar sectors
    const sectorCount = Object.keys(blindSpotCategories).length;
    const sectorAngle = (2 * Math.PI) / sectorCount;

    Object.entries(blindSpotCategories).forEach(([key, category], index) => {
      const angle = index * sectorAngle - Math.PI / 2;
      
      // Sector lines
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * maxRadius,
        centerY + Math.sin(angle) * maxRadius
      );
      ctx.stroke();

      // Sector labels
      ctx.fillStyle = category.color;
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      const labelX = centerX + Math.cos(angle) * (maxRadius + 25);
      const labelY = centerY + Math.sin(angle) * (maxRadius + 25);
      ctx.fillText(category.label.split(' ')[0], labelX, labelY);
    });

    // Draw blindspot points
    radarData.forEach(blindSpot => {
      if (filterCategory !== 'all' && blindSpot.category !== filterCategory) return;

      const category = blindSpotCategories[blindSpot.category];
      const angle = (blindSpot.coordinates.angle * Math.PI) / 180 - Math.PI / 2;
      const radius = (blindSpot.coordinates.radius / 100) * maxRadius;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Draw point
      ctx.fillStyle = category.color;
      ctx.beginPath();
      ctx.arc(x, y, blindSpot.severity === 'Critical' ? 8 : 6, 0, 2 * Math.PI);
      ctx.fill();

      // Add severity ring
      if (blindSpot.severity === 'Critical') {
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Add hover area (invisible but clickable)
      ctx.fillStyle = 'transparent';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  // Canvas click handler for blindspot selection
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 40;

    // Check if click is near any blindspot
    radarData.forEach(blindSpot => {
      const angle = (blindSpot.coordinates.angle * Math.PI) / 180 - Math.PI / 2;
      const radius = (blindSpot.coordinates.radius / 100) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      if (distance <= 15) {
        setSelectedBlindSpot(blindSpot);
      }
    });
  };

  useEffect(() => {
    drawRadar();
  }, [radarData, filterCategory]);

  const getSeverityColor = (severity) => {
    const colors = {
      Critical: 'bg-red-100 text-red-800 border-red-200',
      High: 'bg-orange-100 text-orange-800 border-orange-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      analysisInput: analysisInput,
      totalBlindSpots: blindSpots.length,
      criticalCount: blindSpots.filter(bs => bs.severity === 'Critical').length,
      avgRiskScore: (blindSpots.reduce((sum, bs) => sum + bs.riskScore, 0) / blindSpots.length).toFixed(1),
      blindSpots: blindSpots
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blindspot-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BlindSpot Radar</h1>
                <p className="text-sm text-gray-500">Security & Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportReport}
                disabled={blindSpots.length === 0}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Secure Mode</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'radar', label: 'Radar View', icon: Target },
            { id: 'analysis', label: 'Analysis', icon: Brain },
            { id: 'list', label: 'Detailed List', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeView === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Analysis Input Section */}
        {activeView === 'analysis' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">BlindSpot Analysis Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Target (URL, System, or Description)
                </label>
                <textarea
                  value={analysisInput}
                  onChange={(e) => setAnalysisInput(e.target.value)}
                  placeholder="Enter system description, URL, or analysis parameters..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Input is sanitized and limited to 500 characters for security
                </p>
              </div>
              <button
                onClick={performBlindSpotAnalysis}
                disabled={loading || !analysisInput.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run BlindSpot Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Radar Visualization */}
        {activeView === 'radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Interactive Radar View</h2>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(blindSpotCategories).map(([key, category]) => (
                      <option key={key} value={key}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    onClick={handleCanvasClick}
                    className="w-full h-auto border border-gray-200 rounded-lg cursor-pointer"
                  />
                  {radarData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Run analysis to populate radar</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected BlindSpot Details */}
            <div className="space-y-6">
              {selectedBlindSpot && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">BlindSpot Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{selectedBlindSpot.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(selectedBlindSpot.severity)}`}>
                          {selectedBlindSpot.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{selectedBlindSpot.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Risk Score:</span>
                          <div className="flex items-center mt-1">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${selectedBlindSpot.riskScore * 10}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-gray-900">{selectedBlindSpot.riskScore}/10</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Timeline:</span>
                          <p className="text-gray-900">{selectedBlindSpot.timeline}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="font-medium text-gray-700">Impact:</span>
                        <p className="text-sm text-gray-600 mt-1">{selectedBlindSpot.impact}</p>
                      </div>

                      <div className="mt-4">
                        <span className="font-medium text-gray-700">Recommendation:</span>
                        <p className="text-sm text-gray-600 mt-1">{selectedBlindSpot.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Statistics */}
              {blindSpots.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total BlindSpots:</span>
                      <span className="font-semibold text-gray-900">{blindSpots.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Critical Issues:</span>
                      <span className="font-semibold text-red-600">
                        {blindSpots.filter(bs => bs.severity === 'Critical').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Risk Score:</span>
                      <span className="font-semibold text-gray-900">
                        {blindSpots.length > 0 
                          ? (blindSpots.reduce((sum, bs) => sum + bs.riskScore, 0) / blindSpots.length).toFixed(1)
                          : '0.0'
                        }/10
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed List View */}
        {activeView === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Detailed BlindSpot List</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {blindSpots.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No blindspots detected. Run an analysis to get started.</p>
                </div>
              ) : (
                blindSpots.map(blindSpot => {
                  const category = blindSpotCategories[blindSpot.category];
                  const Icon = category.icon;
                  return (
                    <div key={blindSpot.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div 
                          className="flex items-center justify-center w-10 h-10 rounded-lg"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{blindSpot.title}</h3>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getSeverityColor(blindSpot.severity)}`}>
                                {blindSpot.severity}
                              </span>
                              <span className="text-sm text-gray-500">Score: {blindSpot.riskScore}/10</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{blindSpot.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Impact:</span>
                              <p className="text-gray-600 mt-1">{blindSpot.impact}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Recommendation:</span>
                              <p className="text-gray-600 mt-1">{blindSpot.recommendation}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500">Timeline: {blindSpot.timeline}</span>
                            <span className="text-xs text-gray-500">Effort: {blindSpot.effort}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {activeView === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Security Configuration</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={securityMode}
                      onChange={(e) => setSecurityMode(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable enhanced security mode</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-7">
                    Enables additional input validation and audit logging
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Data Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(blindSpotCategories).map(([key, category]) => {
                    const Icon = category.icon;
                    return (
                      <div key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <Icon className="w-5 h-5" style={{ color: category.color }} />
                        <span className="text-sm text-gray-700">{category.label}</span>
                        <div className="ml-auto">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Export Options</h3>
                <div className="space-y-2">
                  <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                    <span>Export as JSON</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span>Generate PDF Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlindSpotRadar;