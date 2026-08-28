import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ControlApiError } from './api';

const STAGES = [
  ['DISCOVERY_ACTIVE', 'Discover'],
  ['CURRENT_WORKFLOW_APPROVED', 'Workflow'],
  ['SOP_APPROVED', 'SOP'],
  ['BASELINE_LOCKED', 'Baseline'],
  ['CHANGE_ACTIVE', 'Change'],
  ['OBSERVATION_COMPLETE', 'Observe'],
  ['RECEIPT_ISSUED', 'Receipt'],
] as const;

type Notice = { kind: 'error' | 'info' | 'success'; text: string } | null;

function pct(value: number | undefined) {
  return typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : '—';
}

export default function App() {
  const [pilotBundle, setPilotBundle] = useState<any>(null);
  const [head, setHead] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [receipt, setReceipt] = useState<any>(null);
  const [integrity, setIntegrity] = useState<any>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [offline, setOffline] = useState(false);

  const refresh = useCallback(async () => {
    const [pilot, streamHead, history] = await Promise.all([
      api.readPilot(),
      api.readStreamHead(),
      api.readStream(),
    ]);
    setPilotBundle(pilot);
    setHead(streamHead);
    setRecords(history.records ?? []);
    setOffline(false);
    if (streamHead.latestReceiptId) {
      const loaded = await api.readReceipt(streamHead.latestReceiptId);
      setReceipt(loaded.signedReceipt);
    } else {
      setReceipt(null);
      setIntegrity(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await api.health();
        await refresh();
      } catch (error) {
        setOffline(true);
        setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Canonical service unavailable.' });
      }
    })();
  }, [refresh]);

  const pilot = pilotBundle?.pilot;
  const stage = pilot?.stage;
  const currentIndex = Math.max(0, STAGES.findIndex(([id]) => id === stage));

  const handleError = useCallback(async (error: unknown) => {
    if (error instanceof ControlApiError && error.status === 409 && error.code === 'STALE_VERSION') {
      await refresh();
      setNotice({ kind: 'info', text: 'Pilot state changed while you were working. The latest server state has been loaded. Review it before retrying.' });
      return;
    }
    if (error instanceof ControlApiError && error.status === 409 && error.code === 'DUPLICATE_MUTATION') {
      await refresh();
      setNotice({ kind: 'info', text: 'This operation may already have been committed. Server state has been refreshed.' });
      return;
    }
    if (error instanceof TypeError) setOffline(true);
    setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Canonical operation failed.' });
  }, [refresh]);

  const mutate = useCallback(async (label: string, operation: () => Promise<any>) => {
    setPending(label);
    setNotice(null);
    try {
      await operation();
      await refresh();
      setNotice({ kind: 'success', text: `${label} committed by the canonical service.` });
    } catch (error) {
      await handleError(error);
    } finally {
      setPending(null);
    }
  }, [handleError, refresh]);

  const completeObservation = useCallback(async () => {
    if (!pilot) return;
    setPending('Complete observation');
    setNotice(null);
    try {
      const first = await api.appendPrimaryEvidence(pilot.version);
      const nextVersion = first.pilot.version;
      await api.appendGuardrailEvidence(nextVersion);
      await refresh();
      setNotice({ kind: 'success', text: 'Post-change evidence committed and observation marked complete.' });
    } catch (error) {
      await handleError(error);
    } finally {
      setPending(null);
    }
  }, [handleError, pilot, refresh]);

  const runVerification = useCallback(async () => {
    if (!pilot) return;
    setPending('Run verification');
    setNotice(null);
    try {
      const result = await api.commitVerification(pilot.version);
      setReceipt(result.signedReceipt);
      setIntegrity(result.signatureVerification);
      await refresh();
      setNotice({ kind: 'success', text: `Verification committed: ${result.signedReceipt.receipt.verdict}.` });
    } catch (error) {
      await handleError(error);
    } finally {
      setPending(null);
    }
  }, [handleError, pilot, refresh]);

  const verifyIntegrity = useCallback(async () => {
    const receiptId = receipt?.receipt?.receiptId;
    if (!receiptId) return;
    setPending('Verify integrity');
    try {
      setIntegrity(await api.verifyReceipt(receiptId));
    } catch (error) {
      await handleError(error);
    } finally {
      setPending(null);
    }
  }, [handleError, receipt]);

  const resetView = useCallback(async () => {
    setNotice(null);
    setIntegrity(null);
    setReceipt(null);
    setPending(null);
    try {
      await refresh();
      setNotice({ kind: 'info', text: 'View reset. Canonical history was not changed.' });
    } catch (error) {
      await handleError(error);
    }
  }, [handleError, refresh]);

  const stagePanel = useMemo(() => {
    if (!pilot) return null;
    const disabled = Boolean(pending) || offline;
    switch (stage) {
      case 'DISCOVERY_ACTIVE':
        return <Panel eyebrow="01 · Discover" title="Current workflow" action="Approve workflow" disabled={disabled} pending={pending} onAction={() => mutate('Approve workflow', () => api.approveWorkflow(pilot.version))}>
          <p className="lede">Review what happens from the moment a customer asks for service until dispatch can assign the work.</p>
          <DefinitionList items={[
            ['Trigger', pilot.workflowProposal.document.trigger],
            ['Roles', pilot.workflowProposal.document.roles.join(' · ')],
            ['Systems', pilot.workflowProposal.document.systems.join(' · ')],
            ['Decision', pilot.workflowProposal.document.decisions[0]],
            ['Exceptions', pilot.workflowProposal.document.exceptions[0]],
          ]} />
        </Panel>;
      case 'CURRENT_WORKFLOW_APPROVED':
        return <Panel eyebrow="02 · Standardize" title="Approve the operating procedure" action="Approve SOP" disabled={disabled} pending={pending} onAction={() => mutate('Approve SOP', () => api.approveSop(pilot.version))}>
          <p className="lede">The SOP is derived from the approved workflow. Approval records actor, time, version, and source evidence on the server.</p>
          <ol className="procedure">{pilot.sopProposal.document.procedure.map((x: string) => <li key={x}>{x}</li>)}</ol>
        </Panel>;
      case 'SOP_APPROVED':
        return <Panel eyebrow="03 · Measure" title="Freeze the baseline" action="Lock baseline" disabled={disabled} pending={pending} onAction={() => mutate('Lock baseline', () => api.lockBaseline(pilot.version))}>
          <MetricGrid values={[['Primary metric', 'Complete at handoff'], ['Baseline', '12 / 20 · 60%'], ['Absolute target', '≥ 90%'], ['Relative improvement', '≥ 25%'], ['Guardrail', 'Assignment time ≤ 10% worse'], ['Samples', '20 baseline / 20 post']]} />
          <p className="fine">Locking prevents criteria from silently changing after results are known.</p>
        </Panel>;
      case 'BASELINE_LOCKED':
        return <Panel eyebrow="04 · Change" title="Approve one process change" action="Approve change" disabled={disabled} pending={pending} onAction={() => mutate('Approve change', () => api.approveChange(pilot.version))}>
          <p className="lede">Require customer ID, service location, issue category, and equipment identifier before READY_FOR_ASSIGNMENT.</p>
          <DefinitionList items={[["Expected result", 'Complete-at-handoff ≥ 90%'], ['Rollback', 'Disable required-field validation and restore prior intake behavior.'], ['Baseline lock', pilot.baselineLockHash ?? 'Server locked']]} />
        </Panel>;
      case 'CHANGE_ACTIVE':
        return <Panel eyebrow="05 · Observe" title="Collect post-change evidence" action="Complete demo observation" disabled={disabled} pending={pending} onAction={completeObservation}>
          <MetricGrid values={[['Primary sample', '20 requests'], ['Primary observed', '19 complete'], ['Guardrail baseline', '25 min'], ['Guardrail post', '26 min']]} />
          <p className="fine">This action appends two aggregate evidence records sequentially. The browser never marks observation complete by itself.</p>
        </Panel>;
      case 'OBSERVATION_COMPLETE':
        return <Panel eyebrow="06 · Verify" title="Run deterministic verification" action="Run verification" disabled={disabled} pending={pending} onAction={runVerification}>
          <MetricGrid values={[['Baseline', '60%'], ['Observed', '95%'], ['Relative improvement', '+58.3%'], ['Guardrail change', '+4%']]} />
          <p className="fine">The browser sends measurements only. Verdict, hashes, receipt identity, signature, and canonical stream version are derived server-side.</p>
        </Panel>;
      case 'RECEIPT_ISSUED':
        return <ReceiptPanel signedReceipt={receipt} integrity={integrity} pending={pending} onVerify={verifyIntegrity} />;
      default:
        return <Panel eyebrow="Pilot" title={String(stage)}><p>Server state loaded.</p></Panel>;
    }
  }, [completeObservation, integrity, mutate, offline, pending, pilot, receipt, runVerification, stage, verifyIntegrity]);

  return <main className="appShell">
    <header className="topbar">
      <div><div className="brand">LOXIHART</div><div className="product">Pilot Console</div></div>
      <div className="topActions"><span className={`authority ${offline ? 'bad' : ''}`}>{offline ? 'Authority unavailable' : 'Server authority'}</span><button className="ghost" onClick={resetView}>Reset View</button></div>
    </header>

    <section className="hero">
      <div><p className="kicker">Lakeview HVAC Services</p><h1>Customer Request → Ready for Assignment</h1><p className="sub">One approved workflow. One measurable change. One signed answer.</p></div>
      <div className="headStats"><Stat label="Pilot version" value={pilot?.version ?? '—'} /><Stat label="Canonical stream" value={head?.currentVersion ?? '—'} /><Stat label="Latest verdict" value={head?.latestVerdict ?? 'Not issued'} /></div>
    </section>

    {notice && <div className={`notice ${notice.kind}`}>{notice.text}</div>}
    {offline && <div className="offline">Canonical service unavailable. Approval and verification actions are disabled. No local fallback will advance this pilot.</div>}

    <div className="workspace">
      <aside className="rail">
        <p className="railLabel">Pilot lifecycle</p>
        {STAGES.map(([id, label], index) => <div className={`railItem ${index < currentIndex ? 'done' : ''} ${id === stage ? 'current' : ''}`} key={id}><span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b></div>)}
      </aside>
      <section className="mainPanel">{pilot ? stagePanel : <div className="loading">Loading canonical pilot…</div>}</section>
      <aside className="evidencePanel">
        <p className="railLabel">Evidence & receipts</p>
        <Stat label="Evidence items" value={pilot?.evidence?.length ?? '—'} />
        <Stat label="Latest receipt" value={head?.latestReceiptId ? head.latestReceiptId.slice(0, 14) + '…' : 'None'} />
        <div className="history">
          <p className="railLabel">Canonical history</p>
          {records.length === 0 ? <p className="muted">No signed verification records yet.</p> : records.map((record: any) => <div className="historyRow" key={`${record.pilot_id}-${record.version}`}><b>v{record.version}</b><span>{record.signed_receipt?.receipt?.verdict ?? '—'}</span><small>{record.signed_receipt?.receipt?.receiptId ?? record.mutation_id}</small></div>)}
        </div>
      </aside>
    </div>
  </main>;
}

function Panel({ eyebrow, title, children, action, disabled, pending, onAction }: any) {
  return <section className="card"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><div className="cardBody">{children}</div>{action && <button className="primary" disabled={disabled} onClick={onAction}>{pending ? 'Working…' : action}</button>}</section>;
}
function Stat({ label, value }: { label: string; value: any }) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div>; }
function DefinitionList({ items }: { items: [string, string][] }) { return <dl className="definitions">{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>; }
function MetricGrid({ values }: { values: [string, string][] }) { return <div className="metricGrid">{values.map(([k, v]) => <div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>; }
function ReceiptPanel({ signedReceipt, integrity, pending, onVerify }: any) {
  const r = signedReceipt?.receipt;
  const s = signedReceipt?.signature;
  if (!r) return <Panel eyebrow="07 · Receipt" title="Loading signed receipt"><p>Reading the canonical receipt…</p></Panel>;
  return <section className="card receiptCard"><div className="receiptTop"><div><p className="eyebrow">07 · ChangeReceipt</p><h2>{r.verdict}</h2></div><span className={`verdict ${String(r.verdict).toLowerCase()}`}>{r.verdict}</span></div><p className="lede">{r.reason}</p><MetricGrid values={[['Baseline', pct(r.baseline?.value)], ['Post-change', pct(r.postChange?.value)], ['Sample', String(r.postChange?.sampleSize ?? '—')], ['Criteria', r.criteriaVersion ?? '—']]} /><DefinitionList items={[["Receipt ID", r.receiptId], ['Payload hash', r.receiptPayloadHash], ['Criteria hash', r.criteriaHash], ['Evidence hash', r.evidenceManifestHash], ['Signature', `${s?.algorithm ?? '—'} · ${s?.keyId ?? '—'}`], ['Signed hash', s?.signedHash ?? '—']]} /><div className={`integrity ${integrity?.valid === true ? 'valid' : integrity?.valid === false ? 'invalid' : ''}`}><b>Integrity</b><span>{integrity?.valid === true ? 'VERIFIED' : integrity?.valid === false ? 'VERIFICATION FAILED' : 'NOT CHECKED'}</span>{integrity?.errors?.length ? <small>{integrity.errors.join(' · ')}</small> : null}</div><button className="primary" disabled={Boolean(pending)} onClick={onVerify}>{pending ? 'Working…' : 'Verify integrity'}</button></section>;
}
