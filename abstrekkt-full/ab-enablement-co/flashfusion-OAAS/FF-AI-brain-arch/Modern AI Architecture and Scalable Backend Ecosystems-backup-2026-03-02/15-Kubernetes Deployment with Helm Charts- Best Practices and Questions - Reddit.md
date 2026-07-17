> Source: https://www.reddit.com/r/kubernetes/comments/1j7uypx/kubernetes_deployment_with_helm_charts_best/

Skip to main content  Open navigation  Go to Reddit Home  Log In  Log in to Reddit   Open settings menu  
Log In / Sign Up  
Advertise on Reddit  
Cookie Preferences  
Try Reddit Pro  BETA  
Reddit, Inc. © 2025. All rights reserved. Copy link 
 Copy link 
 Go to kubernetes r/kubernetes•  Mobile_Estate_9160Português (Brasil)ไทยItalianoTürkçeKubernetes Deployment with Helm Charts: Best Practices and Questions 
Hello everyone,
I'm new to Kubernetes and have just deployed an application on a Kubernetes cluster that includes the following components:
Angular front end
Spring Boot back end
SQL Server database
FastAPI web service
Redis cache
Currently, I'm deploying using  kubectl , but I'm now considering migrating to Helm charts.
Questions :
1. Directory Structure for Helm Charts
Should I place all my service definitions in the  templates/  folder of a single chart, or
Should I create separate sub-charts under a  charts/  directory and install each chart individually?
2. Using Pre-built Charts
For services like Redis and SQL Server, should I retrieve these charts from Bitnami?
Thank you in advance for your guidance!
 Share  lulzmachine •  9mo ago  separate charts for separate components.
Your frontend would be one, your spring boot would be one
Sql server is another one.
Make sure you're DON'T use helm dependencies to do things like include the DB as a dependency into the app chart. Sounds good, is terrible.
So I think in your case you'll have like 6 helm charts, and apply them with "helm deploy".
Stay away from Gitops for now. That's very enterprise.
 Mobile_Estate_9160 •  9mo ago  Thanks for your answer!
Is it close to using an umbrella chart and helpers? And when creating the folder structure (helm create myapp), should I create separate charts in charts folder for each microservice, is that what you're suggesting?
 kusalindika •  9mo ago  Resides in the main chart you can create/invoke the subcharts as you needed for your project
 Continue this thread  lulzmachine •  9mo ago  Regarding third party systems, yeah in general the bitnamu charts are very good. Sometimes there's also a good operator. For postgres I use an operator, and for redis just the bitnami chart. You'll have to do some research
 krokodilAteMyFriend •  9mo ago  If you have common config between the different services, it helps if they are in the same chart as separate templates e.g. SQL Server url can be defined once in values.yaml and reused in FASTAPI and spring boot, making sure both are using the same one
Yes, it's better if you find a supported and tested helm chart and use it as a dependency
More posts you may like
 Modern Kubernetes: Can we replace Helm? r/kubernetes  •  Modern Kubernetes: Can we replace Helm?
 upvotes  ·    comments  
 Is Kubernetes resource management really meant to work like this? Am I missing something fundamental? r/kubernetes  •  Is Kubernetes resource management really meant to work like this? Am I missing something fundamental?
 upvotes  ·    comments  
 Project to learn kubernetes r/kubernetes  •  Project to learn kubernetes
 upvotes  ·    comments  
 How do you handle automated deployments in Kubernetes when each deployment requires different dynamic steps? r/kubernetes  •  How do you handle automated deployments in Kubernetes when each deployment requires different dynamic steps?
 upvotes  ·    comments  
 How often you upgrade your Kubernetes clusters? r/kubernetes  •  How often you upgrade your Kubernetes clusters?
 upvotes  ·    comments  
 What are your best practices deploying helm charts? r/kubernetes  •  What are your best practices deploying helm charts?
 upvotes  ·    comments  
 Kubernetes 2.0, is there anything coming up? r/kubernetes  •  Kubernetes 2.0, is there anything coming up?
 comments  
 New release coming: here's how YOU can help Kubernetes r/kubernetes  •  New release coming: here's how YOU can help Kubernetes
 upvotes  ·    comments  
 Simplifying OpenTelemetry pipelines in Kubernetes r/kubernetes  •  Simplifying OpenTelemetry pipelines in Kubernetes
 upvotes  ·    comments  
 Looking for a good beginner-to-intermediate Kubernetes project ideas r/kubernetes  •  Looking for a good beginner-to-intermediate Kubernetes project ideas
 upvotes  ·    comments  
 How are teams migrating Helm charts to ArgoCD without creating orphaned Kubernetes resources? r/kubernetes  •  How are teams migrating Helm charts to ArgoCD without creating orphaned Kubernetes resources?
 upvotes  ·    comments  
 New Kubernetes docs r/kubernetes  •  New Kubernetes docs
 upvotes  ·    comments  
 Kubernetes 1.35 - Changes around security - New features and deprecations r/kubernetes  •  Kubernetes 1.35 - Changes around security - New features and deprecations
sysdig    upvotes  ·    comments  
 Simplifying Kubernetes deployments with a unified Helm chart r/kubernetes  •  Simplifying Kubernetes deployments with a unified Helm chart
 upvotes  ·    comments  
 Kubernetes 1.33 Release r/kubernetes  •  Kubernetes 1.33 Release
cloudsmith    upvotes  ·    comments  
 Running Kubernetes in the homelab r/kubernetes  •  Running Kubernetes in the homelab
 upvotes  ·    comments  
 Kubernetes at the Edge? Think Again r/kubernetes  •  Kubernetes at the Edge? Think Again
 upvotes  ·    comments  
 Kubernetes the hard way - in 2025? r/kubernetes  •  Kubernetes the hard way - in 2025?
 upvotes  ·    comments  
 How Kubernetes Runs Containers as Linux Processes — Practical Deep Dive (blog post) r/kubernetes  •  How Kubernetes Runs Containers as Linux Processes — Practical Deep Dive (blog post)
esc    upvotes  ·    comments  
 Kubernetes v1.34 is coming with some interesting security changes — what do you think will have the biggest impact? r/kubernetes  •  Kubernetes v1.34 is coming with some interesting security changes — what do you think will have the biggest impact?
armosec    upvotes  ·    comments  
 First time using Kubernetes and all pods running! r/kubernetes  •  First time using Kubernetes and all pods running!
 upvotes  ·    comments  
 Should a Kubernetes cluster be dispensable? r/kubernetes  •  Should a Kubernetes cluster be dispensable?
 upvotes  ·    comments  
 [Request] Best Practices for Hosting Multiple Streamlit Dashboards (with Various Data Sources) on Kubernetes r/StreamlitOfficial  •  [Request] Best Practices for Hosting Multiple Streamlit Dashboards (with Various Data Sources) on Kubernetes
 upvotes  ·    comments  
 For someone starting now, is Kubernetes still a smart skill to invest in? r/kubernetes  •  For someone starting now, is Kubernetes still a smart skill to invest in?
 upvotes  ·    comments  
 Managing large-scale Kubernetes across multi-cloud and on-prem — looking for advice r/kubernetes  •  Managing large-scale Kubernetes across multi-cloud and on-prem — looking for advice
 upvotes  ·    comments  
View Post in
Français 日本語 Русский 0   0  
Top Posts
 Reddit  reReddit: Top posts of March 10, 2025  
 Reddit  reReddit: Top posts of March 2025  
 Reddit  reReddit: Top posts of 2025  
Reddit RulesPrivacy PolicyUser AgreementYour Privacy ChoicesAccessibilityReddit, Inc. © 2025. All rights reserved.
Log In / Sign Up  
Advertise on Reddit  
Cookie Preferences  
Try Reddit Pro  BETA  