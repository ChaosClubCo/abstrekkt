export function ArtifactCard({path,status}:{path:string;status:'pending'|'passed'|'failed'|'warning'}){return <article><h2>{path}</h2><p>Validation status: {status}</p></article>}
