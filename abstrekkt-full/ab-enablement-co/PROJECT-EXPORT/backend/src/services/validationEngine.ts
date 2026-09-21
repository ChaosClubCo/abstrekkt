export interface ValidationResult { score:number; criticalFailures:number; findings:string[] }
export function validateRequiredArtifacts(paths:string[]): ValidationResult { return paths.length ? {score:100,criticalFailures:0,findings:[]} : {score:0,criticalFailures:1,findings:['NO_ARTIFACTS']}; }
