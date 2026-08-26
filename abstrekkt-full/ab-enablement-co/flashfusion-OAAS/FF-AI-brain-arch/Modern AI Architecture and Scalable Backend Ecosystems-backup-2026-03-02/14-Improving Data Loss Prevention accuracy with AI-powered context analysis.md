> Source: https://blog.cloudflare.com/improving-data-loss-prevention-accuracy-with-ai-context-analysis/

Get Started Free|Contact Sales|The Cloudflare Blog
Subscribe to receive notifications of new posts:
AIDevelopersRadarProduct NewsSecurityPolicy & LegalZero TrustSpeed & ReliabilityLife at CloudflarePartnersImproving Data Loss Prevention accuracy with AI-powered context analysis
2025-03-21
Warnessa Weaver
Tom Shen
Joshua Johnson
5 min read This post is also available in 简体中文 and 日本語.
We are excited to announce our latest innovation to Cloudflare’s Data Loss Prevention (DLP) solution: a self-improving AI-powered algorithm that adapts to your organization’s unique traffic patterns to reduce false positives. 
Many customers are plagued by the shapeshifting task of identifying and protecting their sensitive data as it moves within and even outside of their organization. Detecting this data through deterministic means, such as regular expressions, often fails because they cannot identify details that are categorized as personally identifiable information (PII) nor intellectual property (IP). This can generate a high rate of false positives, which contributes to noisy alerts that subsequently may lead to review fatigue. Even more critically, this less than ideal experience can turn users away from relying on our DLP product and result in a reduction in their overall security posture. 
Built into Cloudflare’s DLP Engine, AI enables us to intelligently assess the contents of a document or HTTP request in parallel with a customer’s historical reports to determine context similarity and draw conclusions on data sensitivity with increased accuracy.
In this blog post, we’ll explore DLP AI Context Analysis, its implementation using Workers AI and Vectorize, and future improvements we’re developing. 
Understanding false positives and their impact on user confidence
Data Loss Prevention (DLP) at Cloudflare detects sensitive information by scanning potential sources of data leakage across various channels such as web, cloud, email, and SaaS applications. While we leverage several detection methods, pattern-based methods like regular expressions play a key role in our approach. This method is effective for many types of sensitive data. However, certain information can be challenging to classify solely through patterns. For instance, U.S. Social Security Numbers (SSNs), structured as AAA-GG-SSSS, sometimes with dashes omitted, are often confused with other similarly formatted data, such as U.S. taxpayer identification numbers, bank account numbers, or phone numbers. 
Since announcing our DLP product, we have introduced new capabilities like confidence thresholds to reduce the number of false positives users receive. This method involves examining the surrounding context of a pattern match to assess Cloudflare’s confidence in its accuracy. With confidence thresholds, users specify a threshold (low, medium, or high) to signify a preference for how tolerant detections are to false positives. DLP uses the chosen threshold as a minimum, surfacing only those detections with a confidence score that meets or exceeds the specified threshold. 
However, implementing context analysis is also not a trivial task. A straightforward approach might involve looking for specific keywords near the matched pattern, such as "SSN" near a potential SSN match, but this method has its limitations. Keyword lists are often incomplete, users may make typographical errors, and many true positives do not have any identifying keywords nearby (e.g., bank accounts near routing numbers or SSNs near names).
Leveraging AI/ML for enhanced detection accuracy
To address the limitations of a hardcoded strategy for context analysis, we have developed a dynamic, self-improving algorithm that learns from customer feedback to further improve their future experience. Each time a customer reports a false positive via decrypted payload logs, the system reduces its future confidence for hits in similar contexts. Conversely, reports of true positives increase the system's confidence for hits in similar contexts. 
To determine context similarity, we leverage Workers AI. Specifically, a pretrained language model that converts the text into a high-dimensional vector (i.e. text embedding). These embeddings capture the meaning of the text, ensuring that two sentences with the same meaning but different wording map to vectors that are close to each other. 
When a pattern match is detected, the system uses the AI model to compute the embedding of the surrounding context. It then performs a nearest neighbor search to find previously logged false or true positives with similar meanings. This allows the system to identify context similarities even if the exact wording differs, but the meaning remains the same. 
In our experiments using Cloudflare employee traffic, this approach has proven robust, effectively handling new pattern matches it hadn't encountered before. When the DLP admin reports false and true positives through the Cloudflare dashboard while viewing the payload log of a policy match, it helps DLP continue to improve, leading to a significant reduction in false positives over time. 
Seamless integration with Workers AI and Vectorize
In developing this new feature, we used components from Cloudflare's developer platform — Workers AI and Vectorize — which helps simplify our design. Instead of managing the underlying infrastructure ourselves, we leveraged Cloudflare Workers as the foundation, using Workers AI for text embedding, and Vectorize as the vector database. This setup allows us to focus on the algorithm itself without the overhead of provisioning underlying resources. 
Thanks to Workers AI, converting text into embeddings couldn’t be easier. With just a single line of code we can transform any text into its corresponding vector representation.
const result = await env.AI.run(model, {text: [text]}).data;  
This handles everything from tokenization to GPU-powered inference, making the process both simple and scalable.
The nearest neighbor search is equally straightforward. After obtaining the vector from Workers AI, we use Vectorize to quickly find similar contexts from past reports. In the meantime, we store the vector for the current pattern match in Vectorize, allowing us to learn from future feedback. 
To optimize resource usage, we’ve incorporated a few more clever techniques. For example, instead of storing every vector from pattern hits, we use online clustering to group vectors into clusters and store only the cluster centroids along with counters for tracking hits and reports. This reduces storage needs and speeds up searches. Additionally, we’ve integrated Cloudflare Queues to separate the indexing process from the DLP scanning hot path, ensuring a robust and responsive system.
Privacy is a top priority. We redact any matched text before conversion to embeddings, and all vectors and reports are stored in customer-specific private namespaces across Vectorize, D1, and Workers KV. This means each customer’s learning process is independent and secure. In addition, we implement data retention policies so that vectors that have not been accessed or referenced within 60 days are automatically removed from our system. 
Limitations and continuous improvements
AI-driven context analysis significantly improves the accuracy of our detections. However, this comes at the cost of some increase in latency for the end user experience. For requests that do not match any enabled DLP entries, there will be no latency increase. However, requests that match an enabled entry in a profile with AI context analysis enabled will typically experience an increase in latency of about 400ms. In rare extreme cases, for example requests that match multiple entries, that latency increase could be as high as 1.5 seconds. We are actively working to drive the latency down, ideally to a typical increase of 250ms or better. 
Another limitation is that the current implementation supports English exclusively because of our choice of the language model. However, Workers AI is developing a multilingual model which will enable DLP to increase support across different regions and languages.
Looking ahead, we also aim to enhance the transparency of AI context analysis. Currently, users have no visibility on how the decisions are made based on their past false and true positive reports. We plan to develop tools and interfaces that provide more insight into how confidence scores are calculated, making the system more explainable and user-friendly. 
With this launch, AI context analysis is only available for Gateway HTTP traffic. By the end of 2025, AI context analysis will be available in both CASB and Email Security so that customers receive the same AI enhancements across their entire data landscape.
Unlock the benefits: start using AI-powered detection features today
DLP’s AI context analysis is in closed beta. Sign up here for early access to experience immediate improvements to your DLP HTTP traffic matches. More updates are coming soon as we approach general availability!
To get access to DLP via Cloudflare One, contact your account manager.
Cloudflare's connectivity cloud protects entire corporate networks, helps customers build Internet-scale applications efficiently, accelerates any website or Internet application, wards off DDoS attacks, keeps hackers at bay, and can help you on your journey to Zero Trust. 
 Visit 1.1.1.1 from any device to get started with our free app that makes your Internet faster and safer. 
 To learn more about our mission to help build a better Internet, start here. If you're looking for a new career direction, check out our open positions.  Security WeekZero TrustDLPSASEData ProtectionCloudflare OneWorkers AIFollow on X
Cloudflare |@cloudflareRelated posts
December 01, 2025 6:00 AM
Why Replicate is joining Cloudflare
Today, we’re excited to announce that Replicate is officially part of Cloudflare. We wanted to share a bit about our journey and why we made this decision.  ...
By  Andreas Jansson, 
Ben Firshman
AI ,Workers AI ,Developers ,AcquisitionsNovember 25, 2025 12:00 AM
Partnering with Black Forest Labs to bring FLUX.2 [dev] to Workers AI
FLUX.2 [dev] by Black Forest Labs is now on Workers AI! This advanced open-weight image model offers superior photorealism, multi-reference inputs, and granular control with JSON prompting. ...
By  Michelle Chen, 
David Liu
AI ,Workers AI ,DevelopersSeptember 29, 2025 2:00 PM
15 years of helping build a better Internet: a look back at Birthday Week 2025
Rust-powered core systems, post-quantum upgrades, developer access for students, PlanetScale integration, open-source partnerships, and our biggest internship program ever — 1,111 interns in 2026. ...
By  Nikita Cano, 
Korinne Alpers
Birthday Week ,Partners ,Developer Platform ,Workers Launchpad ,Performance ,Security ,Cache ,Speed ,Developers ,AI ,1.1.1.1 ,Application Security ,Application Services ,Bots ,CDN ,Cloudflare for Startups ,Cloudflare One ,Cloudflare Zero Trust ,Cloudflare WorkersSeptember 24, 2025 1:00 PM
Securing today for the quantum future: WARP client now supports post-quantum cryptography (PQC)
To prepare for a future where powerful quantum computers come online, we've upgraded our WARP client with post-quantum cryptography. ...
By  Sharon Goldberg, 
Tochukwu Nkemdilim (Toks), 
Koko Uko
Birthday Week ,Post-Quantum ,Zero Trust ,Cryptography ,WARP ,Cloudflare Zero Trust ,SASE ,Cloudflare One ,1.1.1.1