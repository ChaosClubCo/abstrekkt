import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Zap, Calendar, BarChart3, ExternalLink } from 'lucide-react';

const AcademySimulator = () => {
  const [courses, setCourses] = useState(() => {
    // Load from localStorage or initialize
    const stored = localStorage.getItem('academy-progress');
    return stored ? JSON.parse(stored) : initialCourses;
  });
  
  const [view, setView] = useState('kanban'); // 'kanban' or 'timeline'

  const initialCourses = [
    // PRIORITY COURSES (Kyle's pre-HumanX focus)
    {
      id: 'cc-101',
      name: 'Claude Code 101',
      url: 'https://anthropic.skilljar.com/claude-code-101',
      status: 'not-started', // 'not-started' | 'in-progress' | 'completed'
      priority: 'critical',
      estimatedHours: 3,
      category: 'Developer',
      lessons: 5,
      completedLessons: 0,
    },
    {
      id: 'agent-skills',
      name: 'Introduction to agent skills',
      url: 'https://anthropic.skilljar.com/introduction-to-agent-skills',
      status: 'not-started',
      priority: 'critical',
      estimatedHours: 4,
      category: 'Developer',
      lessons: 6,
      completedLessons: 0,
    },
    {
      id: 'subagents',
      name: 'Introduction to subagents',
      url: 'https://anthropic.skilljar.com/introduction-to-subagents',
      status: 'not-started',
      priority: 'critical',
      estimatedHours: 3,
      category: 'Developer',
      lessons: 5,
      completedLessons: 0,
    },
    {
      id: 'mcp-intro',
      name: 'Introduction to Model Context Protocol',
      url: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol',
      status: 'not-started',
      priority: 'critical',
      estimatedHours: 4,
      category: 'Developer',
      lessons: 6,
      completedLessons: 0,
    },
    {
      id: 'mcp-advanced',
      name: 'Model Context Protocol: Advanced Topics',
      url: 'https://anthropic.skilljar.com/model-context-protocol-advanced-topics',
      status: 'not-started',
      priority: 'critical',
      estimatedHours: 5,
      category: 'Developer',
      lessons: 7,
      completedLessons: 0,
    },
    {
      id: 'api-course',
      name: 'Building with the Claude API',
      url: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api',
      status: 'not-started',
      priority: 'critical',
      estimatedHours: 5,
      category: 'Developer',
      lessons: 8,
      completedLessons: 0,
    },
    // SECONDARY COURSES
    {
      id: 'claude-101',
      name: 'Claude 101',
      url: 'https://anthropic.skilljar.com/claude-101',
      status: 'not-started',
      priority: 'recommended',
      estimatedHours: 2,
      category: 'Fundamentals',
      lessons: 4,
      completedLessons: 0,
    },
    {
      id: 'cowork-intro',
      name: 'Introduction to Claude Cowork',
      url: 'https://anthropic.skilljar.com/introduction-to-claude-cowork',
      status: 'not-started',
      priority: 'recommended',
      estimatedHours: 3,
      category: 'Developer',
      lessons: 5,
      completedLessons: 0,
    },
    {
      id: 'cc-action',
      name: 'Claude Code in Action',
      url: 'https://anthropic.skilljar.com/claude-code-in-action',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 2,
      category: 'Developer',
      lessons: 3,
      completedLessons: 0,
    },
    {
      id: 'ai-fluency-core',
      name: 'AI Fluency: Framework & Foundations',
      url: 'https://anthropic.skilljar.com/ai-fluency-framework-foundations',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 3,
      category: 'Fundamentals',
      lessons: 5,
      completedLessons: 0,
    },
    {
      id: 'ai-cap-lim',
      name: 'AI Capabilities and Limitations',
      url: 'https://anthropic.skilljar.com/ai-capabilities-and-limitations',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 2,
      category: 'Fundamentals',
      lessons: 3,
      completedLessons: 0,
    },
    {
      id: 'bedrock',
      name: 'Claude with Amazon Bedrock',
      url: 'https://anthropic.skilljar.com/claude-in-amazon-bedrock',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 3,
      category: 'Deployment',
      lessons: 4,
      completedLessons: 0,
    },
    {
      id: 'vertex',
      name: 'Claude with Google Cloud\'s Vertex AI',
      url: 'https://anthropic.skilljar.com/claude-with-google-vertex',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 3,
      category: 'Deployment',
      lessons: 4,
      completedLessons: 0,
    },
    {
      id: 'ai-fluency-educators',
      name: 'AI Fluency for educators',
      url: 'https://anthropic.skilljar.com/ai-fluency-for-educators',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 2,
      category: 'Educational',
      lessons: 3,
      completedLessons: 0,
    },
    {
      id: 'ai-fluency-students',
      name: 'AI Fluency for students',
      url: 'https://anthropic.skilljar.com/ai-fluency-for-students',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 2,
      category: 'Educational',
      lessons: 3,
      completedLessons: 0,
    },
    {
      id: 'teaching-ai-fluency',
      name: 'Teaching AI Fluency',
      url: 'https://anthropic.skilljar.com/teaching-ai-fluency',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 2,
      category: 'Educational',
      lessons: 3,
      completedLessons: 0,
    },
    {
      id: 'ai-fluency-nonprofits',
      name: 'AI Fluency for nonprofits',
      url: 'https://anthropic.skilljar.com/ai-fluency-for-nonprofits',
      status: 'not-started',
      priority: 'optional',
      estimatedHours: 2,
      category: 'Educational',
      lessons: 3,
      completedLessons: 0,
    },
  ];

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('academy-progress', JSON.stringify(courses));
  }, [courses]);

  // Calculations
  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const inProgressCourses = courses.filter(c => c.status === 'in-progress').length;
  const notStartedCourses = courses.filter(c => c.status === 'not-started').length;
  const completionPercent = Math.round((completedCourses / totalCourses) * 100);
  
  const priorityCourses = courses.filter(c => c.priority === 'critical');
  const priorityCompleted = priorityCourses.filter(c => c.status === 'completed').length;
  const priorityPercent = Math.round((priorityCompleted / priorityCourses.length) * 100);

  const totalHours = courses.reduce((sum, c) => sum + c.estimatedHours, 0);
  const completedHours = courses
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.estimatedHours, 0);

  // HumanX deadline
  const humanXDate = new Date('2026-04-06');
  const today = new Date();
  const daysRemaining = Math.ceil((humanXDate - today) / (1000 * 60 * 60 * 24));
  const hoursPerDay = daysRemaining > 0 ? (totalHours - completedHours) / daysRemaining : 0;

  const toggleStatus = (id) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const currentStatus = c.status;
        let newStatus;
        if (currentStatus === 'not-started') newStatus = 'in-progress';
        else if (currentStatus === 'in-progress') newStatus = 'completed';
        else newStatus = 'not-started';
        return { ...c, status: newStatus, completedLessons: newStatus === 'completed' ? c.lessons : c.completedLessons };
      }
      return c;
    }));
  };

  const renderCourseCard = (course) => {
    const isPriority = course.priority === 'critical';
    return (
      <div
        key={course.id}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          isPriority ? 'border-red-500 bg-red-50 hover:bg-red-100' : 'border-gray-200 bg-white hover:bg-gray-50'
        } ${course.status === 'completed' ? 'opacity-70' : ''}`}
        onClick={() => toggleStatus(course.id)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {course.status === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : course.status === 'in-progress' ? (
              <Circle className="w-6 h-6 text-blue-600 border-2 border-blue-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold text-sm ${course.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {course.name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded ${isPriority ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                {isPriority ? '🔥 Critical' : course.priority === 'recommended' ? '⭐ Recommended' : '◦ Optional'}
              </span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{course.estimatedHours}h</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">{course.lessons} lessons</div>
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Open course <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Kanban view
  const kanbanView = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Not Started */}
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-gray-300">
          <Circle className="w-5 h-5 text-gray-400" />
          <h2 className="font-bold text-gray-700">Not Started</h2>
          <span className="ml-auto text-sm font-semibold text-gray-600">{notStartedCourses}</span>
        </div>
        <div className="space-y-3">
          {courses.filter(c => c.status === 'not-started').map(renderCourseCard)}
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-blue-300">
          <Zap className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-blue-700">In Progress</h2>
          <span className="ml-auto text-sm font-semibold text-blue-600">{inProgressCourses}</span>
        </div>
        <div className="space-y-3">
          {courses.filter(c => c.status === 'in-progress').map(renderCourseCard)}
        </div>
      </div>

      {/* Completed */}
      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-green-300">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <h2 className="font-bold text-green-700">Completed</h2>
          <span className="ml-auto text-sm font-semibold text-green-600">{completedCourses}</span>
        </div>
        <div className="space-y-3">
          {courses.filter(c => c.status === 'completed').map(renderCourseCard)}
        </div>
      </div>
    </div>
  );

  // Timeline view
  const timelineView = (
    <div className="space-y-6">
      {/* Deadline countdown */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-6 h-6" />
          <h2 className="text-2xl font-bold">HumanX Conference Countdown</h2>
        </div>
        <p className="text-lg opacity-90 mb-4">April 6-9, 2026 • Moscone Center South, San Francisco</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-sm opacity-80">Days Remaining</div>
            <div className="text-4xl font-bold">{daysRemaining > 0 ? daysRemaining : '🚀'}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-sm opacity-80">Hours/Day Required</div>
            <div className="text-3xl font-bold">{hoursPerDay.toFixed(1)}h</div>
          </div>
        </div>
      </div>

      {/* Priority courses timeline */}
      <div className="bg-white rounded-lg border-2 border-red-300 p-6">
        <h3 className="text-lg font-bold text-red-700 mb-4">🔥 Critical Path (Pre-Conference)</h3>
        <div className="space-y-3">
          {priorityCourses.map(course => (
            <div key={course.id} className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex-shrink-0 cursor-pointer" onClick={() => toggleStatus(course.id)}>
                {course.status === 'completed' ? (
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                ) : course.status === 'in-progress' ? (
                  <Circle className="w-7 h-7 text-blue-600 border-2 border-blue-600" />
                ) : (
                  <Circle className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{course.name}</div>
                <div className="text-xs text-gray-600">{course.lessons} lessons • {course.estimatedHours}h</div>
              </div>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs"
              >
                Open
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Optional courses */}
      <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">◦ Optional / Post-Conference</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Complete these if time permits, or after HumanX:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {courses.filter(c => c.priority === 'optional').map(c => (
              <li key={c.id}>{c.name} ({c.estimatedHours}h)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Anthropic Academy Master Simulator</h1>
          <p className="text-gray-300">Track your path to Staff Engineer mastery · 17 courses · {totalHours}h total</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-lg border border-white/20 p-4 text-white">
            <div className="text-sm text-gray-300 mb-1">Overall Progress</div>
            <div className="text-3xl font-bold">{completionPercent}%</div>
            <div className="text-xs text-gray-400 mt-1">{completedCourses}/{totalCourses} courses</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg border border-white/20 p-4 text-white">
            <div className="text-sm text-gray-300 mb-1">Critical Path</div>
            <div className="text-3xl font-bold">{priorityPercent}%</div>
            <div className="text-xs text-gray-400 mt-1">{priorityCompleted}/{priorityCourses.length} critical</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg border border-white/20 p-4 text-white">
            <div className="text-sm text-gray-300 mb-1">Hours Invested</div>
            <div className="text-3xl font-bold">{completedHours}h</div>
            <div className="text-xs text-gray-400 mt-1">of {totalHours}h total</div>
          </div>
          <div className={`backdrop-blur rounded-lg border p-4 text-white ${daysRemaining > 10 ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
            <div className="text-sm text-gray-300 mb-1">HumanX Deadline</div>
            <div className="text-3xl font-bold">{daysRemaining}d</div>
            <div className="text-xs text-gray-400 mt-1">April 6 · {hoursPerDay.toFixed(1)}h/day pace</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('kanban')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              view === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              view === 'timeline'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Timeline
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-8">
          {view === 'kanban' ? kanbanView : timelineView}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Click any course to cycle: Not Started → In Progress → Completed</p>
          <p className="mt-2">Progress auto-saves to your browser. All links open Anthropic Academy courses.</p>
        </div>
      </div>
    </div>
  );
};

export default AcademySimulator;
