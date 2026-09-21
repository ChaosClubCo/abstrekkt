// app.jsx — Final canvas wiring. Lays out all artboards in a DesignCanvas.

const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  const APP_W = 1440, APP_H = 900;

  return (
    <DesignCanvas>
      <DCSection id="system" title="System" subtitle="Brand tokens, type scale, components — the source-of-truth catalogue.">
        <DCArtboard id="foundations" label="Foundations · tokens & components" width={1280} height={1480}>
          <FoundationsArtboard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="auth" title="Auth" subtitle="Public entry — first impression sets the tone for everything inside.">
        <DCArtboard id="login" label="Sign in · enterprise SSO" width={APP_W} height={APP_H}>
          <LoginArtboard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="workspace" title="Workspace" subtitle="Day-to-day operator surfaces — KPIs, queue, alerts.">
        <DCArtboard id="dashboard" label="Dashboard · live overview" width={APP_W} height={APP_H}>
          <DashboardArtboard/>
        </DCArtboard>
        <DCArtboard id="projects" label="Projects · model registry" width={APP_W} height={APP_H}>
          <ProjectsArtboard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="governance" title="Governance" subtitle="Where assessments run, rules live, and the audit trail anchors.">
        <DCArtboard id="assessment" label="Assessment · A-2807 detail" width={APP_W} height={APP_H}>
          <AssessmentArtboard/>
        </DCArtboard>
        <DCArtboard id="rules" label="Rules · compliance library" width={APP_W} height={APP_H}>
          <RulesArtboard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="ops" title="Operations" subtitle="Reporting, access control, and forensic-grade history.">
        <DCArtboard id="reports" label="Reports · governance posture" width={APP_W} height={APP_H}>
          <ReportsArtboard/>
        </DCArtboard>
        <DCArtboard id="admin" label="Admin · users & roles" width={APP_W} height={APP_H}>
          <AdminArtboard/>
        </DCArtboard>
        <DCArtboard id="audit" label="Audit · tamper-evident log" width={APP_W} height={APP_H}>
          <AuditArtboard/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
