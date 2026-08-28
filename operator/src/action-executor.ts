export type ExecutorId = "gabriel" | "todoist" | "codex" | "manual" | "other";

export interface ActionProposalV1<TPayload = unknown> {
  schema: "ActionProposal/v1";
  proposalId: string;
  taskId: string;
  executor: ExecutorId;
  action: string;
  resources: string[];
  risk: "low" | "medium" | "high" | "critical" | "external_side_effect";
  simulationRequired: boolean;
  approvalRequired: boolean;
  payload: TPayload;
  payloadHash: `sha256:${string}`;
  idempotencyKey?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface SimulationResult {
  proposalId: string;
  payloadHash: `sha256:${string}`;
  status: "safe" | "unsafe" | "blocked";
  summary: string;
  evidenceRefs: string[];
}

export interface ApprovalV1 {
  approvalId: string;
  proposalId: string;
  payloadHash: `sha256:${string}`;
  approvedBy: string;
  approvedAt: string;
}

export interface ApprovedActionProposal<TPayload = unknown> {
  proposal: ActionProposalV1<TPayload>;
  approval: ApprovalV1;
  simulation?: SimulationResult;
}

export interface ExecutionReceiptV1 {
  schema: "ExecutionReceipt/v1";
  receiptId: string;
  taskId: string;
  executor: string;
  supervisor?: string | null;
  candidateRevision?: string | null;
  status: "passed" | "failed" | "blocked" | "cancelled";
  checks: Array<{
    name: string;
    status: "passed" | "failed" | "skipped" | "blocked";
    evidenceRef?: string;
  }>;
  proposalId?: string;
  proposalPayloadHash?: `sha256:${string}`;
  approvalRef?: string;
  artifactManifestRef?: string;
  idempotencyKey?: string;
  startedAt: string;
  completedAt: string;
}

export interface ActionExecutor {
  readonly id: ExecutorId;
  simulate<TPayload>(proposal: ActionProposalV1<TPayload>): Promise<SimulationResult>;
  execute<TPayload>(approved: ApprovedActionProposal<TPayload>): Promise<ExecutionReceiptV1>;
}

export class AuthorityBoundaryError extends Error {
  readonly code = "AUTHORITY_BOUNDARY";

  constructor(message: string) {
    super(message);
    this.name = "AuthorityBoundaryError";
  }
}

export function assertApprovalMatchesProposal<TPayload>(
  approved: ApprovedActionProposal<TPayload>,
): void {
  const { proposal, approval, simulation } = approved;

  if (approval.proposalId !== proposal.proposalId) {
    throw new AuthorityBoundaryError("Approval proposalId does not match proposal.");
  }

  if (approval.payloadHash !== proposal.payloadHash) {
    throw new AuthorityBoundaryError("Approval payloadHash does not match proposal payloadHash.");
  }

  if (proposal.simulationRequired) {
    if (!simulation) {
      throw new AuthorityBoundaryError("Required simulation evidence is missing.");
    }
    if (simulation.proposalId !== proposal.proposalId || simulation.payloadHash !== proposal.payloadHash) {
      throw new AuthorityBoundaryError("Simulation evidence does not match the approved proposal.");
    }
    if (simulation.status !== "safe") {
      throw new AuthorityBoundaryError(`Simulation status is ${simulation.status}; execution is not permitted.`);
    }
  }
}

export class DisabledActionExecutor implements ActionExecutor {
  readonly id: ExecutorId;

  constructor(id: ExecutorId = "other") {
    this.id = id;
  }

  async simulate<TPayload>(proposal: ActionProposalV1<TPayload>): Promise<SimulationResult> {
    return {
      proposalId: proposal.proposalId,
      payloadHash: proposal.payloadHash,
      status: "blocked",
      summary: "Live execution adapter is disabled.",
      evidenceRefs: [],
    };
  }

  async execute<TPayload>(approved: ApprovedActionProposal<TPayload>): Promise<ExecutionReceiptV1> {
    assertApprovalMatchesProposal(approved);
    throw new AuthorityBoundaryError("Live execution adapter is disabled.");
  }
}
