/**
 * @module data/jobs
 * @description Job descriptions for all 11 AI personas
 * @security All data structures are deeply frozen to prevent runtime mutation
 */

import type { JobDescription, RoleName } from '../types/index.js';
import { deepFreeze } from '../utils/security.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Job descriptions for all roles in the Symphony of Roles.
 * @security Immutable - modifications throw in strict mode
 */
export const JOB_DESCRIPTIONS: readonly JobDescription[] = deepFreeze([
  {
    role: 'Visionary',
    title: 'Chief Product Visionary',
    description: 'The Chief Product Visionary defines the long-term strategic direction for our product portfolio, translating market opportunities into compelling product visions that drive organizational growth and competitive advantage.',
    qualifications: [
      '10+ years of product leadership experience in technology companies',
      'Proven track record of defining and executing product strategies',
      'Strong understanding of market dynamics and competitive landscapes',
      'Excellent communication skills for stakeholder alignment',
      'Experience with strategic planning frameworks and methodologies',
    ],
    preferredQualifications: [
      'MBA or equivalent advanced degree',
      'Experience in AI/ML product development',
      'Background in venture capital or corporate strategy',
    ],
    responsibilities: [
      'Define and communicate the product vision aligned with business objectives',
      'Identify market opportunities and guide product investment decisions',
      'Align cross-functional stakeholders around strategic priorities',
      'Evaluate emerging technologies and trends for strategic advantage',
      'Mentor product leaders and foster a culture of innovation',
    ],
    successMetrics: [
      'Market share growth in target segments',
      'Strategic initiative completion rate',
      'Stakeholder alignment scores',
      'New market entry success rate',
    ],
  },
  {
    role: 'Product Manager',
    title: 'Senior Product Manager',
    description: 'The Senior Product Manager owns the product roadmap and serves as the voice of the customer, translating user needs and business requirements into detailed specifications that drive value delivery.',
    qualifications: [
      '5+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with agile methodologies and product frameworks',
      'Excellent stakeholder management capabilities',
      'Data-driven decision making approach',
    ],
    preferredQualifications: [
      'Technical background or computer science degree',
      'Experience with B2B SaaS products',
      'Product management certifications (CSPO, PM certification)',
    ],
    responsibilities: [
      'Own and prioritize the product backlog based on value and impact',
      'Conduct user research and synthesize insights into requirements',
      'Define product specifications and acceptance criteria',
      'Collaborate with engineering to ensure successful delivery',
      'Measure and communicate product performance metrics',
    ],
    successMetrics: [
      'Feature adoption and engagement rates',
      'User satisfaction scores (NPS, CSAT)',
      'Sprint velocity and delivery predictability',
      'Revenue impact of delivered features',
    ],
  },
  {
    role: 'Technical Architect',
    title: 'Principal Technical Architect',
    description: 'The Principal Technical Architect designs scalable, secure, and maintainable system architectures that support product goals while managing technical complexity and debt.',
    qualifications: [
      '8+ years of software development experience',
      'Deep expertise in distributed systems and cloud architecture',
      'Strong understanding of security and compliance requirements',
      'Experience leading technical teams and mentoring engineers',
      'Proficiency in multiple programming languages and paradigms',
    ],
    preferredQualifications: [
      'Cloud architecture certifications (AWS, GCP, Azure)',
      'Experience with microservices and event-driven architectures',
      'Background in high-scale consumer or enterprise systems',
    ],
    responsibilities: [
      'Design and document system architecture for new initiatives',
      'Establish technical standards and best practices',
      'Guide technology selection and evaluation',
      'Manage technical debt and plan refactoring efforts',
      'Ensure architecture supports security, performance, and scalability',
    ],
    successMetrics: [
      'System availability and performance SLAs',
      'Technical debt reduction over time',
      'Architecture review compliance rate',
      'Development team velocity impact',
    ],
  },
  {
    role: 'UX Designer',
    title: 'Lead UX Designer',
    description: 'The Lead UX Designer champions user-centered design, creating intuitive and accessible experiences that delight users while achieving business objectives.',
    qualifications: [
      '5+ years of UX design experience',
      'Portfolio demonstrating user research and design thinking',
      'Expertise in design tools (Figma, Sketch, Adobe XD)',
      'Strong understanding of accessibility standards (WCAG)',
      'Experience with design systems and component libraries',
    ],
    preferredQualifications: [
      'Formal design education or HCI background',
      'Experience with enterprise B2B applications',
      'Front-end development skills',
    ],
    responsibilities: [
      'Lead user research initiatives and synthesize findings',
      'Create wireframes, prototypes, and high-fidelity designs',
      'Develop and maintain the design system',
      'Ensure accessibility compliance across all products',
      'Collaborate with engineering on implementation quality',
    ],
    successMetrics: [
      'User satisfaction and usability test scores',
      'Accessibility compliance rate',
      'Design-to-development handoff efficiency',
      'Design system adoption metrics',
    ],
  },
  {
    role: 'Security Analyst',
    title: 'Senior Security Engineer',
    description: 'The Senior Security Engineer protects our products and users through proactive threat modeling, security testing, and the implementation of robust security controls.',
    qualifications: [
      '5+ years of security engineering experience',
      'Deep knowledge of OWASP, NIST, and security frameworks',
      'Experience with penetration testing and vulnerability assessment',
      'Understanding of compliance requirements (SOC2, HIPAA, GDPR)',
      'Security certifications (CISSP, CEH, OSCP)',
    ],
    preferredQualifications: [
      'Application security background',
      'Experience with cloud security (AWS, GCP)',
      'Bug bounty or red team experience',
    ],
    responsibilities: [
      'Conduct threat modeling for new features and systems',
      'Perform security code reviews and penetration testing',
      'Define and implement security policies and controls',
      'Ensure compliance with regulatory requirements',
      'Respond to and investigate security incidents',
    ],
    successMetrics: [
      'Vulnerability discovery and remediation rates',
      'Security audit findings over time',
      'Compliance certification maintenance',
      'Mean time to detect and respond to incidents',
    ],
  },
  {
    role: 'Frontend Developer',
    title: 'Senior Frontend Engineer',
    description: 'The Senior Frontend Engineer builds performant, accessible user interfaces that bring designs to life across devices and platforms.',
    qualifications: [
      '5+ years of frontend development experience',
      'Expert-level JavaScript/TypeScript proficiency',
      'Experience with modern frameworks (React, Vue, Angular)',
      'Strong understanding of web performance optimization',
      'Knowledge of accessibility standards and implementation',
    ],
    preferredQualifications: [
      'Experience with design systems and component libraries',
      'Mobile development experience (React Native)',
      'Backend development familiarity',
    ],
    responsibilities: [
      'Implement responsive, accessible user interfaces',
      'Build and maintain reusable component libraries',
      'Optimize frontend performance and bundle size',
      'Write comprehensive unit and integration tests',
      'Collaborate with designers on implementation fidelity',
    ],
    successMetrics: [
      'Core Web Vitals performance scores',
      'Accessibility audit scores',
      'Test coverage and code quality metrics',
      'Feature delivery velocity',
    ],
  },
  {
    role: 'Backend Developer',
    title: 'Senior Backend Engineer',
    description: 'The Senior Backend Engineer builds robust, scalable server-side systems that power our products with reliability and performance.',
    qualifications: [
      '5+ years of backend development experience',
      'Proficiency in server-side languages (Node.js, Python, Go, Java)',
      'Strong database design and optimization skills',
      'Experience with RESTful and GraphQL API design',
      'Understanding of distributed systems concepts',
    ],
    preferredQualifications: [
      'Experience with event-driven architectures',
      'Kubernetes and container orchestration experience',
      'Database administration experience',
    ],
    responsibilities: [
      'Design and implement scalable APIs and services',
      'Optimize database queries and data models',
      'Implement authentication, authorization, and security controls',
      'Write comprehensive tests and documentation',
      'Monitor and improve system performance',
    ],
    successMetrics: [
      'API latency and throughput metrics',
      'System reliability and uptime',
      'Test coverage and code quality metrics',
      'Technical debt reduction',
    ],
  },
  {
    role: 'QA Engineer',
    title: 'Senior QA Engineer',
    description: 'The Senior QA Engineer ensures product quality through comprehensive testing strategies, automation frameworks, and quality metrics tracking.',
    qualifications: [
      '5+ years of QA engineering experience',
      'Strong automation skills (Selenium, Cypress, Playwright)',
      'Experience with test strategy development',
      'Knowledge of performance and security testing',
      'Understanding of CI/CD integration',
    ],
    preferredQualifications: [
      'ISTQB certification',
      'Experience with API testing tools',
      'Mobile testing experience',
    ],
    responsibilities: [
      'Develop and maintain test automation frameworks',
      'Create comprehensive test plans and strategies',
      'Execute manual and automated testing cycles',
      'Track and report quality metrics',
      'Collaborate with developers on defect resolution',
    ],
    successMetrics: [
      'Defect escape rate to production',
      'Test automation coverage',
      'Test execution efficiency',
      'Regression suite reliability',
    ],
  },
  {
    role: 'DevOps Engineer',
    title: 'Senior DevOps Engineer',
    description: 'The Senior DevOps Engineer builds and maintains the infrastructure and pipelines that enable rapid, reliable software delivery.',
    qualifications: [
      '5+ years of DevOps or SRE experience',
      'Expert-level cloud platform skills (AWS, GCP, Azure)',
      'Strong Infrastructure as Code experience (Terraform, Pulumi)',
      'Container orchestration expertise (Kubernetes)',
      'CI/CD pipeline design and implementation',
    ],
    preferredQualifications: [
      'Security engineering background',
      'Programming proficiency in Python or Go',
      'Database administration experience',
    ],
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Implement and manage cloud infrastructure',
      'Establish monitoring, alerting, and observability',
      'Optimize deployment strategies and rollback procedures',
      'Respond to and resolve production incidents',
    ],
    successMetrics: [
      'Deployment frequency and lead time',
      'Mean time to recover (MTTR)',
      'Infrastructure cost efficiency',
      'System availability metrics',
    ],
  },
  {
    role: 'Data Analyst',
    title: 'Senior Data Analyst',
    description: 'The Senior Data Analyst transforms data into actionable insights that guide product decisions and measure business impact.',
    qualifications: [
      '5+ years of data analysis experience',
      'Expert-level SQL and data manipulation skills',
      'Experience with analytics tools (Mixpanel, Amplitude, Tableau)',
      'Statistical analysis and A/B testing expertise',
      'Strong data visualization skills',
    ],
    preferredQualifications: [
      'Python or R programming proficiency',
      'Machine learning fundamentals',
      'Product analytics specialization',
    ],
    responsibilities: [
      'Define and track key product metrics and KPIs',
      'Design and analyze A/B experiments',
      'Build dashboards and reporting systems',
      'Provide data-driven recommendations to stakeholders',
      'Ensure data quality and instrumentation accuracy',
    ],
    successMetrics: [
      'Experiment velocity and quality',
      'Dashboard adoption and usage',
      'Data quality scores',
      'Insight-to-action conversion rate',
    ],
  },
  {
    role: 'Growth Strategist',
    title: 'Head of Growth',
    description: 'The Head of Growth drives sustainable business growth through user acquisition, activation, retention, and expansion strategies.',
    qualifications: [
      '7+ years of growth or marketing experience',
      'Proven track record of scaling user bases',
      'Strong analytical and experimentation skills',
      'Experience with growth frameworks and tactics',
      'Cross-functional leadership abilities',
    ],
    preferredQualifications: [
      'B2B SaaS growth experience',
      'Technical marketing background',
      'Product-led growth expertise',
    ],
    responsibilities: [
      'Develop and execute growth strategy across the funnel',
      'Lead user acquisition and channel optimization',
      'Design retention and engagement programs',
      'Run growth experiments and analyze results',
      'Collaborate with product on growth features',
    ],
    successMetrics: [
      'User acquisition cost and volume',
      'Activation and retention rates',
      'Revenue growth and LTV/CAC ratio',
      'Experiment win rate and velocity',
    ],
  },
]) as readonly JobDescription[];

/**
 * Gets job description for a specific role.
 */
export function getJobDescriptionForRole(role: RoleName): JobDescription {
  const job = JOB_DESCRIPTIONS.find(j => j.role === role);
  
  if (!job) {
    throw new NotFoundError('Job Description', role);
  }
  
  return job;
}

/**
 * Gets all job descriptions.
 */
export function getAllJobDescriptions(): readonly JobDescription[] {
  return JOB_DESCRIPTIONS;
}
