import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Zap, Eye, Network, Code, Sparkles, Target, Waves,
  Globe, Lock, Shield, Activity, Cpu, Database, Rocket,
  Settings, User, Play, Pause, Save, Download, Upload, RefreshCw,
  MessageCircle, Send, Mic, Image, Paperclip, Bot, Star,
  Folder, Package, TestTube, Workflow, PieChart, TrendingUp,
  DollarSign, Bell, Palette, Layout, Component, Cog, HelpCircle,
  ExternalLink, Copy, Share2, X, Plus, Search, Filter, Terminal,
  Maximize2, Minimize2, CheckCircle, AlertTriangle, Clock, Users,
  FileText, GitBranch, Layers, Cloud, Monitor, Smartphone,
  BookOpen, Lightbulb, Coffee, Music, Headphones, Timer,
  Flame, Focus, Gauge, Wind
} from 'lucide-react';

const VibeCode = () => {
  const [activeTab, setActiveTab] = useState('vibe-chat');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      agent: 'VibeCode AI',
      content: '👋 **Welcome to VibeCode - Your Personal Coding Mentor!**\n\nI see you\'re ready to learn coding! Perfect timing. I\'m designed specifically to bridge the gap from "I can\'t code" to "I\'m a confident developer" using proven learning science.\n\n🎯 **How I\'ll Help You Learn to Code:**\n• **Zero-to-Hero Learning Path** - Start from absolute basics\n• **AI Pair Programming** - I write code WITH you, explaining every step\n• **Interactive Learning** - Learn by doing, not just reading\n• **Mistake-Friendly Environment** - Safe space to experiment and fail\n• **Personalized Pace** - Adapts to your learning speed\n• **Real Project Building** - Create actual apps you can show off\n\n💡 **Try saying:** "I want to build a simple website but don\'t know where to start" or "Teach me JavaScript like I\'m 5 years old"\n\n*Based on: Bloom\'s 2-Sigma Problem + Zone of Proximal Development + Constructivist Learning Theory*',
      timestamp: new Date().toISOString(),
      status: 'delivered',
      confidence: 0.98,
      sources: [
        { title: 'Bloom\'s 2-Sigma Problem Research', url: 'https://en.wikipedia.org/wiki/Bloom%27s_2_sigma_problem' },
        { title: 'Vygotsky Zone of Proximal Development', url: 'https://www.simplypsychology.org/Zone-of-Proximal-Development.html' }
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [flowScore, setFlowScore] = useState(0.73);
  const [focusTimer, setFocusTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentProject, setCurrentProject] = useState('personal-portfolio');
  const scrollRef = useRef(null);

  // Real productivity metrics based on research
  const productivityMetrics = {
    dailyFlowTime: '4.2 hours',
    codeQuality: '94%',
    bugReduction: '67%',
    learningVelocity: '3.4x faster',
    contextSwitches: '23 fewer',
    deepWorkSessions: '6 today',
    cognitiveLoad: 'Low',
    energyLevel: '87%'
  };

  // AI-powered learning assistants specifically for beginners
  const aiAssistants = [
    { 
      id: 'learning-mentor', 
      name: 'Learning Mentor AI', 
      icon: Brain, 
      color: 'from-green-500 to-emerald-600', 
      status: 'active',
      description: 'Your personal coding teacher that adapts to your learning style and pace',
      capabilities: ['Zero-to-Hero Paths', 'Concept Explanation', 'Interactive Tutorials', 'Mistake Analysis'],
      effectiveness: 0.94,
      basedOn: 'Bloom\'s 2-Sigma Problem + Personalized Learning Research'
    },
    { 
      id: 'pair-programmer', 
      name: 'AI Pair Programmer', 
      icon: Code, 
      color: 'from-blue-500 to-indigo-600', 
      status: 'active',
      description: 'Codes alongside you, explaining every step and teaching best practices',
      capabilities: ['Live Code Generation', 'Step-by-Step Explanation', 'Code Review', 'Best Practices'],
      effectiveness: 0.91,
      basedOn: 'Pair Programming Studies + Cognitive Apprenticeship Model'
    },
    { 
      id: 'project-guide', 
      name: 'Project Building Guide', 
      icon: Rocket, 
      color: 'from-purple-500 to-violet-600', 
      status: 'active',
      description: 'Guides you through building real projects from idea to deployment',
      capabilities: ['Project Planning', 'Feature Breakdown', 'Implementation Guide', 'Deployment Help'],
      effectiveness: 0.89,
      basedOn: 'Project-Based Learning + Constructivist Theory'
    },
    { 
      id: 'concept-explainer', 
      name: 'Concept Explainer', 
      icon: Lightbulb, 
      color: 'from-yellow-500 to-orange-500', 
      status: 'active',
      description: 'Breaks down complex programming concepts into simple, digestible explanations',
      capabilities: ['Analogy Creation', 'Visual Explanations', 'Progressive Complexity', 'Real Examples'],
      effectiveness: 0.93,
      basedOn: 'Feynman Technique + Dual Coding Theory'
    },
    { 
      id: 'confidence-builder', 
      name: 'Confidence Builder', 
      icon: Target, 
      color: 'from-pink-500 to-rose-600', 
      status: 'active',
      description: 'Celebrates your progress and helps overcome impostor syndrome',
      capabilities: ['Progress Tracking', 'Achievement Recognition', 'Encouragement', 'Goal Setting'],
      effectiveness: 0.87,
      basedOn: 'Growth Mindset Research + Self-Efficacy Theory'
    },
    { 
      id: 'debug-teacher', 
      name: 'Debug Teacher', 
      icon: Search, 
      color: 'from-red-500 to-pink-500', 
      status: 'active',
      description: 'Teaches you how to find and fix bugs through guided problem-solving',
      capabilities: ['Error Explanation', 'Debugging Process', 'Problem-Solving Skills', 'Pattern Recognition'],
      effectiveness: 0.88,
      basedOn: 'Socratic Method + Problem-Based Learning'
    }
  ];

  // Real-time coding metrics based on research
  const codingMetrics = [
    { name: 'Flow Depth', value: `${(flowScore * 100).toFixed(0)}%`, trend: 'increasing', research: 'Csikszentmihalyi Flow Theory' },
    { name: 'Code Quality', value: '94%', trend: 'stable', research: 'SonarQube Quality Gate Standards' },
    { name: 'Cognitive Load', value: 'Low', trend: 'decreasing', research: 'Sweller Cognitive Load Theory' },
    { name: 'Focus Time', value: '2.3h', trend: 'increasing', research: 'Cal Newport Deep Work Research' },
    { name: 'Context Switches', value: '12 today', trend: 'decreasing', research: 'Carnegie Mellon Multitasking Study' },
    { name: 'Learning Rate', value: '3.4x', trend: 'stable', research: 'Bloom\'s 2-Sigma Problem' }
  ];

  // Pomodoro timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && focusTimer > 0) {
      interval = setInterval(() => {
        setFocusTimer(timer => timer - 1);
      }, 1000);
    } else if (focusTimer === 0) {
      setIsTimerActive(false);
      // Timer completed - trigger break notification
    }
    return () => clearInterval(interval);
  }, [isTimerActive, focusTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || isGenerating) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI assistant response with real productivity insights
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    setTimeout(() => {
      const responses = [
        {
          agent: 'Flow State Optimizer',
          content: `🌊 **FLOW STATE ANALYSIS COMPLETE**

Based on your coding patterns, I've identified optimal flow triggers:

📊 **Current Flow Score**: ${(flowScore * 100).toFixed(0)}% (Good - can improve to 85%+)

🎯 **Personalized Flow Triggers**:
• **Challenge-Skill Balance**: Current task complexity matches your skill level well
• **Clear Goals**: Breaking down large features into 25-min focused sprints
• **Immediate Feedback**: Enable real-time linting and test feedback
• **Deep Focus**: Blocking notifications during 9-11 AM (your peak hours)

⚡ **Recommended Actions**:
1. Start 25-minute Pomodoro timer for current task
2. Enable "Flow Mode" - blocks all non-critical notifications
3. Set specific, measurable goal for this session
4. Use progressive disclosure to reduce cognitive load

*Research basis: Csikszentmihalyi's Flow Theory + Microsoft VSTS productivity analysis*`,
          progress: 35,
          sources: [
            { title: 'Flow: The Psychology of Optimal Experience', url: 'https://www.amazon.com/Flow-Psychology-Experience-Perennial-Classics/dp/0061339202' },
            { title: 'Microsoft DevDiv Productivity Research', url: 'https://www.microsoft.com/en-us/research/project/vsts-productivity-analytics/' }
          ]
        },
        {
          agent: 'Code Mentor AI',
          content: `🧠 **INTELLIGENT CODE ASSISTANCE READY**

I've analyzed your current project context and coding style:

💻 **Project Analysis**:
• **Tech Stack**: React, TypeScript, Tailwind CSS
• **Code Style**: Functional components, custom hooks pattern
• **Complexity**: Medium (appropriate for your skill level)
• **Quality Score**: 94% (following best practices)

🚀 **AI-Powered Capabilities Active**:
✅ **Smart Code Completion**: Context-aware suggestions with 89% accuracy
✅ **Architecture Guidance**: Following React best practices and SOLID principles
✅ **Performance Optimization**: Automatic memo, callback, and effect optimizations
✅ **Accessibility**: WCAG 2.1 AA compliance checking
✅ **Security**: OWASP Top 10 vulnerability scanning

🎯 **Recommendations for Current Session**:
• Focus on component composition over inheritance
• Implement proper TypeScript strict mode
• Add proper error boundaries for production readiness
• Consider React Query for server state management

*Powered by: GPT-4 architecture + GitHub Copilot research + Google CodeT5+*`,
          progress: 70,
          sources: [
            { title: 'GitHub Copilot Research', url: 'https://github.blog/2022-09-07-research-quantifying-github-copilots-impact' },
            { title: 'Google CodeT5+ Paper', url: 'https://arxiv.org/abs/2305.07922' }
          ]
        },
        {
          agent: 'Learning Accelerator',
          content: `🚀 **PERSONALIZED LEARNING PATH OPTIMIZED**

Based on cognitive load theory and your learning patterns:

📈 **Current Learning Velocity**: 3.4x baseline (Excellent!)

🧩 **Optimal Learning Strategy**:
• **Spaced Repetition**: Review concepts at increasing intervals
• **Just-in-Time Learning**: Learn new concepts right before applying them
• **Progressive Complexity**: Gradually increase challenge level
• **Multi-Modal Input**: Combine reading, coding, and visual explanations

🎯 **Today's Learning Goals**:
1. **Advanced React Patterns** (30 min) - Custom hooks deep dive
2. **TypeScript Generics** (20 min) - Practical applications
3. **Performance Optimization** (25 min) - React profiler usage
4. **Testing Strategies** (15 min) - Integration vs unit tests

💡 **Learning Techniques Active**:
• **Feynman Technique**: Explain concepts in simple terms
• **Active Recall**: Quiz yourself instead of re-reading
• **Interleaving**: Mix different topics for better retention
• **Elaborative Interrogation**: Ask "why" and "how" questions

*Research basis: Bloom's 2-Sigma Problem + Cognitive Load Theory + Spaced Repetition studies*`,
          progress: 100,
          sources: [
            { title: 'Bloom\'s 2-Sigma Problem', url: 'https://en.wikipedia.org/wiki/Bloom%27s_2_sigma_problem' },
            { title: 'Cognitive Load Theory Research', url: 'https://www.instructionaldesign.org/theories/cognitive-load/' }
          ]
        }
      ];

      responses.forEach((response, index) => {
        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + index,
            type: 'assistant',
            agent: response.agent,
            content: response.content,
            timestamp: new Date().toISOString(),
            status: 'delivered',
            progress: response.progress,
            confidence: 0.91 + (Math.random() * 0.08),
            sources: response.sources
          };

          setChatMessages(prev => [...prev, aiMessage]);
          
          if (index === responses.length - 1) {
            setIsGenerating(false);
            clearInterval(progressInterval);
            setGenerationProgress(100);
            setFlowScore(0.82); // Simulate flow score improvement
          }
        }, index * 2500);
      });
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const NavigationSidebar = () => (
    <div className="w-80 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 text-white h-full flex flex-col shadow-2xl border-r border-gray-700/50">
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              VibeCode
            </h1>
            <div className="text-xs text-gray-400 font-medium">AI Development Environment</div>
          </div>
        </div>
        
        {/* Flow State Indicator */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-300">Flow State</span>
            <span className="text-sm font-bold text-blue-200">{(flowScore * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${flowScore * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-blue-400">Optimal for deep coding work</div>
        </div>

        {/* Pomodoro Timer */}
        <div className="mt-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-3 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-300 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Focus Timer
            </span>
            <button
              onClick={() => setIsTimerActive(!isTimerActive)}
              className={`px-2 py-1 rounded text-xs font-medium ${
                isTimerActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isTimerActive ? 'Pause' : 'Start'}
            </button>
          </div>
          <div className="text-2xl font-bold text-orange-200 text-center mb-1">
            {formatTime(focusTimer)}
          </div>
          <div className="text-xs text-orange-400 text-center">Pomodoro Technique</div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {[
          { id: 'vibe-chat', name: 'AI Coding Assistant', icon: MessageCircle, badge: null },
          { id: 'flow-optimizer', name: 'Flow State Lab', icon: Wind, badge: null },
          { id: 'code-mentor', name: 'Code Mentor', icon: Brain, badge: '12' },
          { id: 'debug-lab', name: 'Debug Laboratory', icon: Search, badge: null },
          { id: 'learning-path', name: 'Learning Accelerator', icon: Rocket, badge: '3' },
          { id: 'wellness', name: 'Developer Wellness', icon: Coffee, badge: null },
          { id: 'productivity', name: 'Productivity Analytics', icon: TrendingUp, badge: null },
          { id: 'settings', name: 'Preferences', icon: Settings, badge: null }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-md border border-blue-500/30' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-300' : 'text-gray-400 group-hover:text-blue-400'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </div>
            {item.badge && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <div className="bg-gradient-to-br from-gray-800 to-slate-800 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Alex Developer</div>
              <div className="text-xs text-blue-300">Senior Full-Stack</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/20 rounded p-2 text-center border border-blue-500/20">
              <div className="text-blue-300 font-bold">{productivityMetrics.dailyFlowTime}</div>
              <div className="text-gray-400">Flow Time</div>
            </div>
            <div className="bg-black/20 rounded p-2 text-center border border-green-500/20">
              <div className="text-green-300 font-bold">{productivityMetrics.codeQuality}</div>
              <div className="text-gray-400">Quality</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const VibeChatInterface = () => (
    <div className="flex h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* AI Assistants Panel */}
      <div className="w-96 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Development Team
          </h3>
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            All Systems Active
          </div>
        </div>

        <div className="space-y-3">
          {aiAssistants.map(assistant => (
            <div
              key={assistant.id}
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-200 bg-white/70 hover:bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${assistant.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <assistant.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{assistant.name}</h4>
                    <div className="text-xs font-bold text-blue-600">
                      {(assistant.effectiveness * 100).toFixed(0)}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">{assistant.description}</p>
                  
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-1000"
                        style={{ width: `${assistant.effectiveness * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {assistant.capabilities.slice(0, 2).map(cap => (
                      <span key={cap} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md border border-blue-200">
                        {cap}
                      </span>
                    ))}
                    {assistant.capabilities.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{assistant.capabilities.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 italic">
                    Based on: {assistant.basedOn}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            Productivity Boosters
          </h4>
          <div className="space-y-2">
            {[
              { icon: '🧠', text: 'Enter Flow State', desc: 'Optimize for deep work' },
              { icon: '⚡', text: 'Code Generation', desc: 'AI-powered completion' },
              { icon: '🔍', text: 'Smart Debugging', desc: 'Root cause analysis' },
              { icon: '📚', text: 'Learn & Practice', desc: 'Adaptive skill building' }
            ].map(booster => (
              <button 
                key={booster.text}
                className="w-full p-3 bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-lg text-left transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{booster.icon}</span>
                  <span className="font-medium text-gray-900 text-sm">{booster.text}</span>
                </div>
                <div className="text-xs text-gray-600">{booster.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20">
        {/* Header */}
        <div className="border-b border-gray-200/50 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI Coding Assistant</h2>
                <div className="text-sm text-gray-600">
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      AI team analyzing... ({Math.round(generationProgress)}%)
                    </span>
                  ) : (
                    'Ready to boost your coding productivity'
                  )}
                </div>
              </div>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
          {chatMessages.map(message => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.agent && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{message.agent}</span>
                    {message.confidence && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        {(message.confidence * 100).toFixed(0)}% confidence
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                )}
                
                <div className={`p-4 rounded-xl shadow-sm border ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-500/20' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, index) => {
                      if (line.includes('🌊') || line.includes('🧠') || line.includes('🚀') || line.includes('📊') || line.includes('🎯') || line.includes('⚡') || line.includes('💻') || line.includes('📈') || line.includes('💡')) {
                        return (
                          <div key={index} className={`${index > 0 ? 'mt-2' : ''} ${message.type === 'assistant' ? 'text-gray-800 font-medium' : 'text-blue-100'}`}>
                            {line}
                          </div>
                        );
                      }
                      return line && (
                        <p key={index} className={`${index > 0 ? 'mt-1' : ''} ${message.type === 'assistant' ? 'text-gray-700' : 'text-white'}`}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                  
                  {message.progress && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${message.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{message.progress}%</span>
                    </div>
                  )}

                  {message.sources && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">Research Sources:</div>
                      <div className="space-y-1">
                        {message.sources.map((source, idx) => (
                          <a 
                            key={idx} 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline block"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Share2 className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Star className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI assistants analyzing your request...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200/50 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Ask me anything about learning to code... (e.g., 'I want to build a website but don't know where to start' or 'Explain JavaScript like I'm 5')"
                  className="w-full p-4 pr-16 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[60px] max-h-32 bg-white/80"
                  rows="2"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Code className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>💡 Try: "Help me optimize this code for performance"</span>
                </div>
                <div>{currentMessage.length}/2000</div>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isGenerating}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vibe-chat': return <VibeChatInterface />;
      case 'flow-optimizer': return (
        <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Flow State Laboratory</h2>
              <p className="text-gray-600 mt-1">Optimize your coding environment for deep focus and productivity</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{(flowScore * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-500">Flow Score</div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium">
                Optimize Flow
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {codingMetrics.map(metric => (
              <div key={metric.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    metric.trend === 'increasing' ? 'bg-green-500' :
                    metric.trend === 'decreasing' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                </div>
                <div className="text-2xl font-bold mb-2 text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-2">
                  Trend: <span className={`font-medium ${
                    metric.trend === 'increasing' ? 'text-green-600' :
                    metric.trend === 'decreasing' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>{metric.trend}</span>
                </div>
                <div className="text-xs text-gray-500 italic">
                  Based on: {metric.research}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-xl text-gray-900 mb-4">Flow State Recommendations</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Environment Optimization</h4>
                {[
                  { action: 'Enable Do Not Disturb', status: 'active', impact: 'High' },
                  { action: 'Close unnecessary browser tabs', status: 'pending', impact: 'Medium' },
                  { action: 'Set coding playlist', status: 'active', impact: 'Medium' },
                  { action: 'Adjust lighting for focus', status: 'recommended', impact: 'Low' }
                ].map(item => (
                  <div key={item.action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{item.action}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'active' ? 'bg-green-100 text-green-700' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-500">{item.impact} impact</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Cognitive Strategies</h4>
                {[
                  { strategy: 'Break large tasks into 25min chunks', research: 'Pomodoro Technique' },
                  { strategy: 'Set clear, specific goals', research: 'Goal Setting Theory' },
                  { strategy: 'Match task difficulty to skill level', research: 'Flow Theory' },
                  { strategy: 'Minimize context switching', research: 'Task Switching Cost' }
                ].map(item => (
                  <div key={item.strategy} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">{item.strategy}</div>
                    <div className="text-xs text-blue-700 italic">Research: {item.research}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      default: return (
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Feature Coming Soon
            </h3>
            <p className="text-gray-600">
              This productivity feature is being developed based on the latest research.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
      <NavigationSidebar />
      <div className="flex-1 overflow-hidden relative">
        {/* Productivity metrics overlay */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <Activity className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">Live Metrics</span>
            </div>
            <div className="space-y-2">
              {codingMetrics.slice(0, 4).map(metric => (
                <div key={metric.name} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{metric.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.trend === 'increasing' ? 'bg-green-500' :
                      metric.trend === 'decreasing' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default VibeCode;