> Source: https://www.getcensus.com/blog/understanding-gemini-costs-and-performance-vs-gpt-and-claude-ai-columns

Get a demo  Sign in   Platform Products   Reverse ETL  Sync your data with any SaaS tool with just SQL   Audience Hub  Build dynamic audience segments without code or CSVs   Embedded  Share data with external customers & partners   Datasets  Define trusted data for collaborative transformation   AI Columns  Enrich and enhance data with AI  Features   dbt  Reuse your models in any tool to drive business impact   Observability  Monitor, troubleshoot, and create alerts for pipelines   Security  Sync with confidence with enterprise-grade security   Enrichment  Add third-party data enrichment to your warehouse  
 Integrations Popular Sources   Snowflake  Google BigQuery  Azure Synapse  Google Sheets  MySQL  Databricks  AWS Redshift  Postgres  SQL Server  Amazon S3  View all sources  chevron_right  Popular Destinations   Salesforce  Braze  Facebook Ads  Google Ads  Customer.io  HubSpot  Zendesk  Marketo  Intercom  Slack  View all destinations  chevron_right  
 Solutions By Team   Data  Connect your data models to all your apps   Marketing  Build audiences with the most complete Customer 360   Sales  Prioritize high value conversations with a Customer 360 in your CRM   Success  Proactively prevent churn with customer health scores and alerts  By Industry   Retail  Create unique brand journeys by activating first-party data   Product-Led Growth  Get product analytics into the hands of every team to drive conversions   Marketplaces  Provide frictionless experiences for both providers and consumers  
 Customers Data  Automated data workflows in Salesforce & Marketo  Prioritized 100K+ support tickets with real-time data in Zendesk  Unified siloed data from multiple sources for product-led growth   All Data Stories  chevron_right  Marketing  Personalized messages to 170M+ users with faster audience experimentation  Segmented audiences on Snowflake for unified customer experiences  Reduced CAC by 50% in 6 months by syncing predictive ads LTV   All Marketing Stories  chevron_right  Engineering  Accelerated development of native Salesforce integration by 4 months  Reached 50% adoption of new data export features within 2 weeks  Doubled repeat transaction rates and saved 6 months of dev time   All Engineering Stories  chevron_right  
 Resources Blog   What is Reverse ETL? Everything you need to know  Making real-time Reverse ETL 100x cheaper and faster  Why we built Census Embedded  Read the blog  chevron_right  Playbook   Dynamic Personalization and Segmentation  Lead scoring in your CRM  Prioritizing customer support tickets  Explore the Playbook  chevron_right  Get Involved   Events  Changelog  Product Docs  Developer Docs  Partner Programs 
 Pricing 
 Platform chevron_left back    Platform Products Reverse ETL  Sync your data with any SaaS tool with just SQL   Audience Hub  Build dynamic audience segments without code or CSVs   Embedded  Share data with external customers & partners   Datasets  Define trusted data for collaborative transformation   AI Columns  Enrich and enhance data with AI  
Features dbt  Reuse your models in any tool to drive business impact   Observability  Monitor, troubleshoot, and create alerts for pipelines   Security  Sync with confidence with enterprise-grade security   Enrichment  Add third-party data enrichment to your warehouse  
 Integrations chevron_left back    Integrations Popular Sources Snowflake  Google BigQuery  Azure Synapse  Google Sheets  MySQL  Databricks  AWS Redshift  Postgres  SQL Server  Amazon S3  View all sources  chevron_right  
Popular Destinations Salesforce  Braze  Facebook Ads  Google Ads  Customer.io  HubSpot  Zendesk  Marketo  Intercom  Slack  View all destinations  chevron_right  
 Solutions chevron_left back    Solutions By Team Data  Connect your data models to all your apps   Marketing  Build audiences with the most complete Customer 360   Sales  Prioritize high value conversations with a Customer 360 in your CRM   Success  Proactively prevent churn with customer health scores and alerts  
By Industry Retail  Create unique brand journeys by activating first-party data   Product-Led Growth  Get product analytics into the hands of every team to drive conversions   Marketplaces  Provide frictionless experiences for both providers and consumers  
 Customers chevron_left back    Customers DataAutomated data workflows in Salesforce & Marketo  Prioritized 100K+ support tickets with real-time data in Zendesk  Unified siloed data from multiple sources for product-led growth   All Data Stories  chevron_right  
MarketingPersonalized messages to 170M+ users with faster audience experimentation  Segmented audiences on Snowflake for unified customer experiences  Reduced CAC by 50% in 6 months by syncing predictive ads LTV   All Marketing Stories  chevron_right  
EngineeringAccelerated development of native Salesforce integration by 4 months  Reached 50% adoption of new data export features within 2 weeks  Doubled repeat transaction rates and saved 6 months of dev time   All Engineering Stories  chevron_right  
 Resources chevron_left back    Resources Blog What is Reverse ETL? Everything you need to know  Making real-time Reverse ETL 100x cheaper and faster  Why we built Census Embedded  Read the blog  chevron_right  
Playbook Dynamic Personalization and Segmentation  Lead scoring in your CRM  Prioritizing customer support tickets  Explore the Playbook  chevron_right  
Get Involved Events  Changelog  Product Docs  Developer Docs  Partner Programs 
 Pricing 
Sign In Get a demo  Get a demo menu  Menu  close  Close  Sign in Census Has Been Acquired by Fivetran - Read More
 keyboard_backspace   Back to Blog Product NewsUnderstanding Gemini: Costs and Performance vs GPT and Claude
Ellen Perfect 5 February 2025 
It's official: Gemini Flash and Pro are now available within Census AI columns! But with more models comes more decisions about which is right for a given use case.
Here's our breakdown of how much Gemini costs, how it performs, and the use cases it's a fit for. 
Costs: How does Gemini pricing compare to Claude and GPT?
Before we get into performance, let's take a moment to understand costs. Most LLMs charge by the token (generally about 4 characters) and charge for processing inputs (your prompt) and outputs (the response generated.)
Here's how Gemini compares to the other large-scale LLMs:
Input Cost (per million tokens)
Output Cost (per million tokens)
Claude 3.5 Sonnet
$3
$15
Claude 3.5 Haiku
$1
$5
GPT-4o
$2.5
$10
GPT-4o mini
$.15
$6
Gemini 1.5 Flash
Prompts up to 128k tokens- $0.075 
 Prompts longer than 128k-$0.15
Prompts up to 128k tokens- $0.30 
 Prompts longer than 128k- $0.60
Gemini 1.5 Pro
Prompts up to 128k tokens- $1.25 
Prompts longer than 128k- $2.50
Prompts up to 128k tokens- $2.50 
Prompts longer than 128k- $10
Breaking down costs
Gemini is the sole model here that changes its pricing based on the length of the prompt.  100k tokens equates to roughly 80,000 words , according to Google's shared estimates (this isn't perfect - a token equates to roughly 4 characters including spaces and punctuation. )
Which means that the 128k threshold gets you just about 100k words. For context, that's about the length of a short novel. 
For simple instructions, this is unlikely to be an issue. But for complex prompts that involve ingesting a lot of data, large json files, or reviewing long blocks of writing, you're likely to run up against these higher cost tiers.
Gemini Flash vs Pro
Like most of the other LLM providers, Google offers different models tuned for different needs. Here's where the models stand right now:
Flash is Google's lightweight model optimized for speed. It has a context window of 1 million tokens.
Pro is the heavyweight model optimized for performance, with a context window of 2 million tokens. 
The context window is a measure of how long of a conversation the LLM can carry out before it's unable to consider all of the information shared. Here's a quick primer if you'd like to dig deeper. 
Benchmark Performance for Gemini Models vs GPT and Claude
Let's talk numbers. To understand the use cases where Gemini will shine, we compared it to GPT and Claude across a series of leading LLM benchmarks:
Gemini 1.5 FlashGemini 1.5 ProClaude 3.5 SonnetClaude 3.5 HaikuGPT-4oGPT-4o MiniUndergraduate Level Knowledge (MMLU)78.9% (5-shot)   89.5% (5-shot)   86.8% (5-shot)   85.0% (5-shot)   86.4% (5-shot)   84.0% (5-shot)  Graduate Level Reasoning (GQPA, Diamond)39.5% (0-shot)   46.2% (0-shot)   50.4% (0-shot CoT)   48.0% (0-shot CoT)   35.7% (0-shot CoT)   33.0% (0-shot CoT)  Math Problem-Solving (MATH)54.9 (4-shot)   67.7 (4-shot)   60.1% (0-shot CoT)   58.0% (0-shot CoT)   52.9% (4-shot)   50.0% (4-shot)  Code (HumanEval)74.3% (0-shot)   84.1% (0-shot)   84.9% (0-shot)   80.0% (0-shot)   67.0% (0-shot)   65.0% (0-shot)  Reasoning Over Text (DROP, F1 Score)74.9% (variable-shot)   78.4% (variable-shot)   83.1% (3-shot)   80.0% (3-shot)   80.9% (3-shot)   78.0% (3-shot)  Mixed Evaluations (BIG-Bench-Hard)85.5% (3-shot)   89.2%. (3-shot)   86.8% (3-shot CoT)   84.0% (3-shot CoT)   83.1% (3-shot CoT)   80.0% (3-shot CoT)  Common Knowledge (HellaSwag)86.5% (10-shot)   93.3% (10-shot)   95.4% (10-shot)   93.0% (10-shot)   95.3% (10-shot)   93.0% (10-shot)  
We'll dig into what this means, but if you'd like to understand these benchmarks better, here's a quick overview of LLM benchmarks and what each one is testing for. 
Breaking down performance
The bottom line is that all of these models are highly performant. The Gemini models consistently perform close to par for their GPT counterparts for most applications across coding, general knowledge and math. However, Claude still out-performs the other models in most areas.
Gemini Flash really shines in cost-for-performance. Even cheaper than GPT 4o mini, this model is a workhorse that can really shine in small-scale applications.
So which model should I choose?
This is a complicated question. But based on our testing, we've found some key learnings:
Lightweight models like Flash and mini are excellent for internal applications: We use mini for our fit score calculations, churn prevention and other prompts that involve processing a json and writing a summary output.
More complex models are our pick for more complex or more "human" tasks:  We love smarter models like Haiku, Gemini Pro and GPT 4o for things like sentiment analysis and performance with more complex analysis tasks like PLG playbooks.
We love the most performant models for externally-facing tasks: There's no doubt that Sonnet is an incredible model. But it comes at a hefty cost. We like to reserve this model for customer-facing tasks like writing personalized outbounds. 