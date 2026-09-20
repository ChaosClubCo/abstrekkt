/*
 * FlashFusion configuration validation and display script
 *
 * This Node.js program reads a set of required configuration values from
 * environment variables, validates that they are all defined, and then
 * prints each value in a human–readable format. If any required
 * variable is missing, the script reports which variables are
 * undefined and exits with a non‑zero status. See the accompanying
 * `.env.example` file for sample values and environment variable names.
 */

// List of required environment variable names. Adjust this list if
// additional configuration keys are needed.
const REQUIRED_VARS = [
  'YEAR1_TARGET',
  'YEAR3_TARGET',
  'CHURN_RATE_TARGET',
  'MRR_GROWTH_TARGET',
  'LTV_CAC_RATIO_TARGET',
  'NPS_TARGET',
  'COMPLIANCE_FRAMEWORKS',
  'MAX_TEAM_SIZE',
];

// Determine which variables are missing from the environment.
const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// Helper to convert a decimal number into a percentage string. Values that
// cannot be parsed as numbers are returned unchanged.
function formatPercent(value) {
  const num = parseFloat(value);
  return Number.isNaN(num) ? value : `${(num * 100).toFixed(2)}%`;
}

// Display the configuration values with descriptive labels. This format
// makes it clear to the user what each variable represents.
console.log(`Year‑1 scalability target (users): ${process.env.YEAR1_TARGET}`);
console.log(`Year‑3 scalability target (users): ${process.env.YEAR3_TARGET}`);
console.log(`Churn rate target: ${formatPercent(process.env.CHURN_RATE_TARGET)}`);
console.log(`MRR growth target (monthly): ${formatPercent(process.env.MRR_GROWTH_TARGET)}`);
console.log(`LTV/CAC ratio target: ${process.env.LTV_CAC_RATIO_TARGET}×`);
console.log(`Net Promoter Score (NPS) target: ≥ ${process.env.NPS_TARGET}`);
console.log(`Compliance frameworks: ${process.env.COMPLIANCE_FRAMEWORKS}`);
console.log(`Maximum team size per agile team: ${process.env.MAX_TEAM_SIZE}`);