# FlashFusion Orchestration Deliverables

This repository contains a set of scripts, configuration templates,
documentation and test harnesses used to support the FlashFusion
orchestration strategy. The files are organized to make it easy to
validate configuration, generate AI design prompts, and run quick
checks on your environment. A veteran developer would organize
deliverables into logical groups, provide clear documentation and
simple test scripts—this package follows those conventions.

## Directory Structure

```
flashfusion_deliverables/
├── configs/                # Example configuration files
│   └── .env.example        # Sample environment variables
├── docs/                   # Documentation and prompts
│   └── figma_prompts.md    # Figma AI Make prompts for all phases
├── scripts/                # Executable Node.js scripts
│   ├── print_figma_prompts.js
│   └── recommendations.js
├── tests/                  # Test harnesses for the scripts
│   ├── test_print_prompts.sh
│   └── test_recommendations.sh
└── README.md               # This file
```

## Scripts

### `scripts/recommendations.js`

This Node.js script validates and displays key configuration values.
It expects certain environment variables to be defined (see
`configs/.env.example` for a reference). If any required variable is
missing, the script reports the missing keys and exits. When all
variables are present, it prints the values in a human‑readable
format, converting decimal values into percentages where
appropriate.

**Required environment variables:**

- `YEAR1_TARGET` – projected number of users after one year.
- `YEAR3_TARGET` – projected number of users after three years.
- `CHURN_RATE_TARGET` – target monthly churn rate (decimal).
- `MRR_GROWTH_TARGET` – target monthly MRR growth rate (decimal).
- `LTV_CAC_RATIO_TARGET` – lifetime value to customer acquisition cost ratio.
- `NPS_TARGET` – Net Promoter Score target.
- `COMPLIANCE_FRAMEWORKS` – comma‑separated list of compliance frameworks.
- `MAX_TEAM_SIZE` – maximum number of members per agile team.

Run this script manually with:

```bash
node scripts/recommendations.js
```

or via the test harness:

```bash
./tests/test_recommendations.sh
```

### `scripts/print_figma_prompts.js`

This Node.js script reads the Markdown file containing AI prompts for
Figma and writes the contents to standard output. It is useful when
you want to quickly view or pipe the prompts into another tool.

Invoke it directly:

```bash
node scripts/print_figma_prompts.js
```

or use the test harness:

```bash
./tests/test_print_prompts.sh
```

## Configuration

### `configs/.env.example`

An example environment file providing recommended starting values for
scalability targets, business metrics, compliance frameworks, and
team structure. Copy this file to `.env` in the root of your project
and adjust the values to suit your needs. The `test_recommendations.sh`
script uses this file to populate the environment before invoking
`recommendations.js`.

## Documentation

### `docs/figma_prompts.md`

A comprehensive list of natural‑language prompts for Figma’s AI Make
tool, organized by project phase and immediate priority. These
prompts describe the desired outputs (persona cards, dashboards,
boards, timelines, etc.) that align with the FlashFusion
orchestration strategy. Paste the prompts into Figma to generate
visual assets.

## Tests

### `tests/test_recommendations.sh`

This shell script exports environment variables from
`configs/.env.example` and runs `scripts/recommendations.js`. It
ensures that all required variables are present and prints the
configuration values. Use this script to verify that your `.env`
file is correctly populated.

### `tests/test_print_prompts.sh`

This shell script invokes `scripts/print_figma_prompts.js` and
verifies that the prompts file is non‑empty. It prints the contents
of the prompts file to standard output.

## Usage

1. **Install dependencies (optional)** – If your project uses
   additional Node.js packages (e.g. `dotenv`), install them with
   `npm install`. The provided scripts require only the built‑in
   `fs` and `path` modules.
2. **Create a `.env` file** – Copy `configs/.env.example` to `.env`
   and adjust the values to match your targets and compliance
   requirements.
3. **Run the tests** – Make the test scripts executable and run
   them:

   ```bash
   chmod +x tests/test_*.sh
   ./tests/test_recommendations.sh
   ./tests/test_print_prompts.sh
   ```

4. **Use the prompts** – Open `docs/figma_prompts.md` in your
   editor or run `node scripts/print_figma_prompts.js`, then copy
   and paste the relevant prompt into Figma Make.

## Packaging

To create a zip archive of these deliverables for distribution, run

```bash
zip -r flashfusion_deliverables.zip flashfusion_deliverables
```

This will produce a `flashfusion_deliverables.zip` file containing
the entire folder structure. You can then share the zip file with
your team or include it in a CI/CD pipeline.

---

These deliverables provide a clean and organized foundation for
FlashFusion’s orchestration strategy. Feel free to extend or modify
them as your project evolves.