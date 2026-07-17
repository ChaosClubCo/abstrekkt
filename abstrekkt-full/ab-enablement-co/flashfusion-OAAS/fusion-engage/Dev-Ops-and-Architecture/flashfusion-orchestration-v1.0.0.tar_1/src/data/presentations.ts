/**
 * @module data/presentations
 * @description Presentation templates for stakeholder communication
 * @security All data structures are deeply frozen to prevent runtime mutation
 */

import type { PresentationTemplate, PresentationSlide } from '../types/index.js';
import { deepFreeze } from '../utils/security.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Presentation templates for various stakeholder communications.
 * @security Immutable - modifications throw in strict mode
 */
export const PRESENTATION_TEMPLATES: readonly PresentationTemplate[] = deepFreeze([
  {
    id: 'exec-summary',
    name: 'Executive Summary',
    audience: 'C-Suite executives and board members',
    purpose: 'High-level overview of product strategy, progress, and key decisions',
    slides: [
      {
        id: 'exec-1',
        title: 'Executive Summary',
        type: 'title',
        content: '# Product Strategy Update\n\n**Q{{quarter}} {{year}}**\n\nPresented by: {{presenter}}',
        notes: 'Keep this slide brief. Set expectations for the presentation duration.',
      },
      {
        id: 'exec-2',
        title: 'Key Highlights',
        type: 'content',
        content: '## Key Highlights\n\n- **Revenue Impact**: {{revenue_impact}}\n- **User Growth**: {{user_growth}}\n- **Strategic Milestones**: {{milestones_completed}} of {{total_milestones}} completed\n- **Key Risks**: {{risk_summary}}',
        notes: 'Focus on metrics that matter to executives. Be prepared to drill down on any metric.',
      },
      {
        id: 'exec-3',
        title: 'Strategic Priorities',
        type: 'content',
        content: '## Strategic Priorities\n\n1. {{priority_1}}\n2. {{priority_2}}\n3. {{priority_3}}\n\n**Resource Allocation**: {{resource_summary}}',
        notes: 'Align priorities with company OKRs. Be clear about trade-offs.',
      },
      {
        id: 'exec-4',
        title: 'Decisions Required',
        type: 'content',
        content: '## Decisions Required\n\n{{decisions_list}}\n\n**Recommendation**: {{recommendation}}',
        notes: 'Be specific about what you need from leadership. Come prepared with recommendations.',
      },
      {
        id: 'exec-5',
        title: 'Next Steps',
        type: 'summary',
        content: '## Next Steps\n\n- {{next_step_1}}\n- {{next_step_2}}\n- {{next_step_3}}\n\n**Next Review**: {{next_review_date}}',
        notes: 'End with clear action items and timeline.',
      },
    ],
  },
  {
    id: 'sprint-review',
    name: 'Sprint Review',
    audience: 'Product team and stakeholders',
    purpose: 'Demo completed work and gather feedback for upcoming sprints',
    slides: [
      {
        id: 'sprint-1',
        title: 'Sprint Review',
        type: 'title',
        content: '# Sprint {{sprint_number}} Review\n\n**{{sprint_dates}}**\n\nTeam: {{team_name}}',
      },
      {
        id: 'sprint-2',
        title: 'Sprint Goals',
        type: 'content',
        content: '## Sprint Goals\n\n{{sprint_goals}}\n\n**Completion Rate**: {{completion_rate}}%',
        notes: 'Review original goals and how they were met.',
      },
      {
        id: 'sprint-3',
        title: 'Completed Work',
        type: 'content',
        content: '## Completed Work\n\n{{completed_items}}\n\n**Story Points Delivered**: {{story_points}}',
        notes: 'Demo each completed item. Gather feedback.',
      },
      {
        id: 'sprint-4',
        title: 'Metrics & Quality',
        type: 'content',
        content: '## Metrics & Quality\n\n- **Velocity**: {{velocity}}\n- **Bug Rate**: {{bug_rate}}\n- **Test Coverage**: {{test_coverage}}%\n- **Performance**: {{performance_summary}}',
      },
      {
        id: 'sprint-5',
        title: 'Upcoming Sprint',
        type: 'summary',
        content: '## Sprint {{next_sprint_number}} Preview\n\n{{upcoming_work}}\n\n**Sprint Goal**: {{next_sprint_goal}}',
      },
    ],
  },
  {
    id: 'architecture-review',
    name: 'Architecture Review',
    audience: 'Engineering team and technical leadership',
    purpose: 'Present and validate architectural decisions',
    slides: [
      {
        id: 'arch-1',
        title: 'Architecture Review',
        type: 'title',
        content: '# {{system_name}} Architecture\n\n**Technical Design Review**\n\nArchitect: {{architect_name}}',
      },
      {
        id: 'arch-2',
        title: 'Problem Statement',
        type: 'content',
        content: '## Problem Statement\n\n{{problem_description}}\n\n**Requirements**:\n{{requirements_list}}',
        notes: 'Clearly define the problem before presenting solutions.',
      },
      {
        id: 'arch-3',
        title: 'Proposed Architecture',
        type: 'content',
        content: '## Proposed Architecture\n\n{{architecture_diagram}}\n\n**Key Components**:\n{{components_list}}',
        notes: 'Include a clear diagram. Explain each component.',
      },
      {
        id: 'arch-4',
        title: 'Trade-offs & Alternatives',
        type: 'content',
        content: '## Trade-offs & Alternatives\n\n**Chosen Approach**: {{chosen_approach}}\n\n**Alternatives Considered**:\n{{alternatives_list}}\n\n**Trade-offs**:\n{{tradeoffs_list}}',
        notes: 'Be transparent about trade-offs. Show you considered alternatives.',
      },
      {
        id: 'arch-5',
        title: 'Security Considerations',
        type: 'content',
        content: '## Security Considerations\n\n**Threat Model**:\n{{threat_model}}\n\n**Mitigations**:\n{{security_mitigations}}',
        notes: 'Security should be a first-class concern in architecture reviews.',
      },
      {
        id: 'arch-6',
        title: 'Implementation Plan',
        type: 'summary',
        content: '## Implementation Plan\n\n{{implementation_phases}}\n\n**Timeline**: {{timeline}}\n\n**Open Questions**: {{open_questions}}',
      },
    ],
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    audience: 'All company stakeholders',
    purpose: 'Announce and celebrate product launch',
    slides: [
      {
        id: 'launch-1',
        title: 'Product Launch',
        type: 'title',
        content: '# Introducing {{product_name}}\n\n**{{tagline}}**\n\n{{launch_date}}',
      },
      {
        id: 'launch-2',
        title: 'The Problem',
        type: 'content',
        content: '## The Problem We Solved\n\n{{problem_narrative}}\n\n**User Pain Points**:\n{{pain_points}}',
      },
      {
        id: 'launch-3',
        title: 'Our Solution',
        type: 'content',
        content: '## {{product_name}}\n\n{{solution_description}}\n\n**Key Features**:\n{{features_list}}',
      },
      {
        id: 'launch-4',
        title: 'Demo',
        type: 'section',
        content: '## Live Demo\n\n{{demo_script}}',
        notes: 'Practice the demo multiple times. Have a backup video.',
      },
      {
        id: 'launch-5',
        title: 'Impact & Metrics',
        type: 'content',
        content: '## Expected Impact\n\n{{impact_metrics}}\n\n**Success Criteria**:\n{{success_criteria}}',
      },
      {
        id: 'launch-6',
        title: 'Go-to-Market',
        type: 'content',
        content: '## Go-to-Market Plan\n\n{{gtm_summary}}\n\n**Launch Timeline**:\n{{launch_timeline}}',
      },
      {
        id: 'launch-7',
        title: 'Thank You',
        type: 'summary',
        content: '## Thank You!\n\n**Team Credits**:\n{{team_credits}}\n\n**Questions?**',
      },
    ],
  },
]) as readonly PresentationTemplate[];

/**
 * Gets a presentation template by ID.
 */
export function getPresentationById(id: string): PresentationTemplate {
  const template = PRESENTATION_TEMPLATES.find(t => t.id === id);
  
  if (!template) {
    throw new NotFoundError('Presentation Template', id);
  }
  
  return template;
}

/**
 * Gets all presentation templates.
 */
export function getAllPresentations(): readonly PresentationTemplate[] {
  return PRESENTATION_TEMPLATES;
}

/**
 * Gets presentations by audience type.
 */
export function getPresentationsByAudience(audienceKeyword: string): readonly PresentationTemplate[] {
  const keyword = audienceKeyword.toLowerCase();
  return PRESENTATION_TEMPLATES.filter(t => 
    t.audience.toLowerCase().includes(keyword)
  );
}

/**
 * Gets a specific slide from a presentation.
 */
export function getSlide(presentationId: string, slideId: string): PresentationSlide {
  const presentation = getPresentationById(presentationId);
  const slide = presentation.slides.find(s => s.id === slideId);
  
  if (!slide) {
    throw new NotFoundError('Slide', slideId);
  }
  
  return slide;
}
