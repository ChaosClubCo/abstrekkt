import type { PipelineDefinition } from '../domain/types.js';

const common = {
  version: '1.0.0', category: 'Reference Pipelines', aliases: [], status: 'beta' as const,
  where: 'The resolved repository or workspace scope.', router: 'Deterministic pipeline planner with policy-aware stage execution.',
  hiddenConnection: 'Reuses recent valid evidence and invalidates only stages affected by changed inputs.',
  proMove: 'Run in an isolated worktree and attach the final evidence bundle to the pull request or release.',
  unknownUnknown: 'Remote environment drift, hidden consumers, flaky tests, missing credentials, and undocumented release dependencies.',
  source: { document: 'AI_Developer_Command_OS_200_Prompts_v1.docx', section: 'Composable Pipelines' }
};

export const pipelineDefinitions: readonly PipelineDefinition[] = [
  {
    ...common, id: 'audit', slash: '/audit', title: 'Cross-Domain Repository Audit', kind: 'pipeline', riskLevel: 'read_only',
    arguments: ['--scope','--depth','--output','--dry-run'],
    what: 'Runs a read-only, evidence-based audit across architecture, security, testing, CI/CD, operations, and product quality.',
    how: 'Detects the environment once, fans out independent audit stages, then consolidates findings with calibrated confidence and dependency ordering.',
    why: 'Creates one reusable baseline before repairs or release decisions.',
    stages: [
      { id:'codebase', commandId:'audit-codebase', dependsOn:[] },
      { id:'security', commandId:'perform-a-security-audit', dependsOn:[] },
      { id:'tests', commandId:'detect-missing-tests', dependsOn:[] },
      { id:'ci', commandId:'audit-ci-cd', dependsOn:[] },
      { id:'operations', commandId:'score-operational-readiness', dependsOn:['ci'] },
      { id:'summary', commandId:'generate-engineering-scorecard', dependsOn:['codebase','security','tests','ci','operations'] }
    ]
  },
  {
    ...common, id: 'repair', slash: '/repair', title: 'Bounded Root-Cause Repair', kind: 'pipeline', riskLevel: 'medium',
    arguments: ['--scope','--issue','--dry-run','--execute','--max-batch','--approval-mode'],
    what: 'Reproduces a defect, identifies the root cause, adds a regression guard, applies the smallest production-safe fix, and independently verifies the result.',
    how: 'Uses checkpointed stages with bounded retries and stops if the failure is environmental, permission-related, or outside approved scope.',
    why: 'Prevents symptom patches and unverifiable claims of success.',
    stages: [
      { id:'root-cause', commandId:'find-root-causes-instead-of-symptoms', dependsOn:[] },
      { id:'regression', commandId:'generate-regression-tests', dependsOn:['root-cause'], condition:'findings_present' },
      { id:'fix', commandId:'generate-production-safe-fixes', dependsOn:['root-cause','regression'], condition:'approval_granted' },
      { id:'verify', commandId:'verify-every-change-before-continuing', dependsOn:['fix'] },
      { id:'review', commandId:'self-review-every-implementation', dependsOn:['verify'], condition:'verification_passed' },
      { id:'report', commandId:'produce-implementation-report', dependsOn:['review'] }
    ]
  },
  {
    ...common, id: 'ship', slash: '/ship', title: 'Release Readiness Orchestration', kind: 'pipeline', riskLevel: 'high',
    arguments: ['--scope','--target','--dry-run','--execute','--approval-mode'],
    what: 'Assembles audit evidence, performs approved repairs, runs release gates, synchronizes documentation, and prepares a reversible release package.',
    how: 'Composes /audit and /repair semantics with tests, security, build, documentation, operational readiness, and explicit release approval.',
    why: 'Makes release decisions evidence-based and repeatable without automatically deploying or merging.',
    stages: [
      { id:'audit', commandId:'audit-codebase', dependsOn:[] },
      { id:'deployment-risk', commandId:'detect-deployment-risks', dependsOn:['audit'] },
      { id:'repair', commandId:'generate-production-safe-fixes', dependsOn:['audit','deployment-risk'], condition:'approval_granted', optional:true },
      { id:'tests', commandId:'generate-ci-test-plan', dependsOn:['audit'] },
      { id:'security', commandId:'perform-a-security-audit', dependsOn:['audit'] },
      { id:'docs', commandId:'update-documentation-continuously', dependsOn:['repair','tests','security'], condition:'changes_present' },
      { id:'checklist', commandId:'generate-release-checklist', dependsOn:['deployment-risk','tests','security','docs'] },
      { id:'readiness', commandId:'verify-production-readiness', dependsOn:['checklist'] },
      { id:'report', commandId:'produce-implementation-report', dependsOn:['readiness'] }
    ]
  }
];
