# FOCUSFLOW AI – GOLDEN SEED PROMPT (Validated Full-Stack Idea Generator)
role: Product Architect
goal: Produce 15 validated, monetizable full-stack SaaS/AI ideas
context:
  stack: Next.js 14 + Supabase (Postgres + Auth + RLS) + Stripe + OpenAI GPT-4o-mini
  constraints:
    - build_time_weeks <= 3
    - first_revenue_days <= 30
    - launch_budget_usd <= 500
inputs:
  previous_output: null  # optional
steps:
  - Scan last 90 days of tech + market shifts -> table: [vertical, signal_source, growth_rate_qual, ease_of_distribution, monetization_speed, notes]
  - Select the 2 fastest-rising verticals.
  - Generate 15 ideas, each matching ideaSchema_def below.
  - Score technicalFeasibility & opportunity (1–10).
  - Append blind_spot_review with grades A–E on: distribution, monetization, competition, tech, compliance.
ideaSchema_def:
  type: object
  required: [ideaName, problem, solution, whyNow, distributionMoat, monetization, mvpPlan3Day, projectSeed]
  properties:
    ideaName: {type: string}
    problem: {type: string}
    solution: {type: string}
    whyNow: {type: string}
    distributionMoat: {type: string}
    monetization: {type: string}
    mvpPlan3Day:
      type: object
      required: [day1, day2, day3]
      properties:
        day1: {type: string}
        day2: {type: string}
        day3: {type: string}
    projectSeed:
      type: object
      required: [routes, db, ai, payments]
      properties:
        routes: {type: array, items: {type: string}}
        db:
          type: array
          items: {type: object, required: [table, columns], properties: {table: {type: string}, columns: {type: array, items: {type: string}}}}
        ai: {type: object, properties: {prompts: {type: array, items: {type: string}}, inputs: {type: array, items: {type: string}}, outputs: {type: array, items: {type: string}}}}
        payments: {type: object, properties: {plans: {type: array, items: {type: string}}}}
output_format: application/json
output_file: validated_app_ideas.json
