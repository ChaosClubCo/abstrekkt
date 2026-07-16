import { LucideIcon } from 'lucide-react';

export type Section = 
  | 'overview' 
  | 'baseline' 
  | 'features' 
  | 'tools' 
  | 'roles' 
  | 'best-practices' 
  | 'faq' 
  | 'deployment';

export type Role = 
  | 'All' 
  | 'Finance' 
  | 'Sales' 
  | 'Engineering' 
  | 'Marketing' 
  | 'Operations' 
  | 'HR'
  | 'Product Management'
  | 'Legal'
  | 'Customer Support'
  | 'Data Science'
  | 'Executive / Leadership'
  | 'QA / Testing';

export type FeatureType = 
  | 'web-search' 
  | 'memory' 
  | 'artifacts' 
  | 'code-execution' 
  | 'files' 
  | 'vision' 
  | 'voice-mode' 
  | 'projects' 
  | 'team-collaboration' 
  | 'api-integration';

export type FAQLevel = 'beginner' | 'intermediate' | 'advanced';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  section: Section;
  path: string[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface BaselineOption {
  id: string;
  name: string;
  version: string;
  date: string;
  sections: {
    coreDirective: string;
    identity: string[];
    allowed: string[];
    notAllowed: string[];
    securityBehaviors: {
      title: string;
      icon: string;
      color: string;
      rules: string[];
      example?: string;
    }[];
    escalationTriggers: {
      trigger: string;
      action: string;
    }[];
    communicationStandards: string[];
  };
}

export interface FeatureData {
  id: FeatureType;
  name: string;
  description: string;
  whenToUse: string[];
  whenNotToUse: string[];
  bestPractices: {
    id: string;
    title: string;
    description: string;
    examples?: {
      bad?: string;
      good?: string;
    };
  }[];
  examples: {
    id: string;
    title: string;
    description: string;
    code?: string;
    output?: string;
  }[];
  limitations?: string[];
}

export interface BestPracticeData {
  prompting: {
    id: string;
    title: string;
    description: string;
    examples?: {
      bad?: string;
      good: string | React.ReactNode;
    }[];
  }[];
  advanced_techniques?: {
    id: string;
    title: string;
    description: string;
    examples?: {
      good: string;
    }[];
  }[];
  security: {
    id: string;
    title: string;
    description: string;
    examples?: {
      bad?: string;
      good?: string;
    }[];
    tips?: string[];
  }[];
  workflow: {
    id: string;
    title: string;
    description: string;
    approach?: string[];
    process?: string[];
    example?: string;
  }[];
  collaboration?: {
    id: string;
    title: string;
    description: string;
    examples?: {
      good: string;
    }[];
  }[];
  troubleshooting?: {
    id: string;
    title: string;
    description: string;
    actions?: string[];
    reason?: string;
  }[];
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'development' | 'communication' | 'design' | 'other';
  roles: string[];
  useCases: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  level: FAQLevel;
  tags: string[];
  relatedQuestions?: string[];
}

export interface DeploymentTask {
  id: string;
  description: string;
  owner?: string;
}

export interface DeploymentStep {
  id: string;
  title: string;
  week: number;
  criticalPath: boolean;
  dependencies?: string[];
  tasks: DeploymentTask[];
}

export interface TutorialScenario {
  title: string;
  problem: string;
  goal: string;
  initialState: string;
  validation: {
    type: 'keyword' | 'structure';
    pattern: string | string[];
    feedback: string;
  };
  successResponse: {
    thinking: string;
    output: string;
    explanation: string;
  };
}

export interface TechniqueTutorial {
  techniqueId: string;
  title: string;
  scenarios: TutorialScenario[];
}
