# MTH 142 School Files

> Provenance: [SOURCED] — FinalExamOutline + Group Quiz 2 (Kyle Rosebrook). Evidence of return-to-school coursework.
> Archived from session dump 2026-07-08. Raw extract, unedited. Contradictions preserved per project rule: do not resolve.

---

## Final Exam Outline

FinalExamOutline
MTH 142
Final Exam Outline
150 points
Overview
-1 hour and 50 minutes
-Multiple choice, fill in blank, and short “essay” (long 10 or more point problems) on Chapter 9 and 10 only
Chapter 1:
• Parameter vs Statistic
• Population vs Sample
• Qualitative vs Quantitative
• Continuous vs Discrete
Chapter 2:
• Create a frequency distribution
• Pareto Chart
• Pie Chart
• Histogram
Chapter 3:
• Mean vs median
• Standard deviation vs variance
• Quartiles vs Percentiles
• Z-score
Chapter 4:
• Sample Space
• Classical probability vs Empirical probability
• Addition rule: P(A or B)
• Complement Rule: P(A’) = 1 – P(A)
• P(A and B) = P(A)*P(B | A)
Chapter 5:
• Probability distribution rules
• Binomial distribution X~B(n, p) o Mean and standard deviation o Probability rules
Chapter 6:
• X~U(a, b)
• Find mean
• Find standard deviation
• Find probability (Area = Base *height)
Chapter 7:
• X~N(µ, σ)
• Normalcdf (lower, upper, µ, σ)
• Invnorm (area to left, µ, σ) Chapter 8:
• 3 rules of central limit theorem
• Normalcdf(lower, upper, 𝜇𝜇𝑥𝑥̅, 𝜎𝜎𝑥𝑥̅)
Chapter 9:
• Zinterval vs Tinterval
• 1propZint
• Finding n
• Writing confidence interval answers
Chapter 10:
• Ztest vs Ttest
• 1propZtest
• P-value
• Write all 5 steps of hypothesis testing
Chapter 13:
• Scatterplot
• Line of best fit (equation)
• Slope interpretation
• Prediction
• Residual
• r correlation

---

## Group Quiz 2

MTH 142
Group Quiz 2
Use the table to the right for problems 1 to 4
• State the class width.
29
• What is the upper boundary of the 4th class
157
• What is the lower limit of the 2nd class
140
• What is the relative frequency of the 1st class
14%
• A meteorologist records the number of clear days in a given year in each of 24 different US cities. He results are show below. Create a grouped frequency distribution using 6 classes.
52 55 59 60 71 72 74 76 83 84 86 90 98 99 100 101 104 105 120 121 125 130 143 168
Classes
f
52-71
5
72-91
6
92-111
4
112-131
4
132-151
3
152-171
2
• Let’s assume you are in charge of creating a 3-question survey that deals with music. The population is students from ABC middle school (6th to 8th grade).
• Create a question that will result in qualitative data.
What is your favorite Genre of music?
• Create a question that will result in quantitative continuous data.
How many hours a week do you spend listening to music?
• Create a question that will result in quantitative discrete data.
How many different musical instruments do you play?
Here's a breakdown of what I notice
Here's a breakdown of what I noticed the big players doing with their system prompts (Perplexity, Copilot leaked prompts)
I was blown away by these leaked prompts. Not just the prompts themselves but also the prompt injection techniques used to leak them.
I learned a lot from looking at the prompts themselves though, and I've been using these techniques in my own AI projects.
For this post, I drafted up an example prompt for a copywriting AI bot named ChadGPT [source code on GitHub]
So let's get right into it. Here's some big takeaways:
🔹 Be Specific About Role and Goals
Set expectations for tone, audience, and context, e.g.
You are ChadGPT, a writing assistant for Chad Technologies Inc. You help marketing teams write clear, engaging content for SaaS audiences.
Both Perplexity and Copilot prompts start like this.
🔹 Structure Matters (Use HTML and Markdown!)
Use HTML and Markdown to group and format context. Here's a basic prompt skeleton:
You are...
Your task is to...
Output everything in markdown with H2 headings and bullet points.
DO NOT include any financial or legal advice.
🔹 Teach the Model How to Think
Use chain-of-thought-style instructions:
Before writing, plan your response in bullet points. Then write the final version.
It helps with clarity, especially for long or multi-step tasks.
🔹 Include Examples—But Tell the Model Not to Copy
Include examples of how to respond to certain types of questions, and also how "not to" respond.
I noticed Copilot doing this. They also made it clear that "you should never use this exact wording".
🔹 Define The Modes and Flow
You can list different modes and give mini-guides for each, e.g.
## Writing Modes
- **Blog Post**: Casual, friendly, 500–700 words. Start with a hook, include headers.
- **Press Release**: Formal, third-person, factual. No fluff.
...
Then instruct the model to identify the mode and continue the flow, e.g.
When drafting a response:
1. Identify the content type (e.g., email, blog, tweet).
2. Refer to the appropriate section in .
3. Apply style rules from .
...
🔹 Set Session Context
Systems prompts are provided with session context, like information about the user preferences, location.
At the very least, tell the model what day it is.
- Current Date: March 8, 2025
- User Preferences:
- Prefers concise responses.
- Uses American English spelling.
