> Source: https://dev.to/alexmercedcoder/using-helm-with-kubernetes-a-guide-to-helm-charts-and-their-implementation-8dg

 Forem Feed 
 Follow new Subforems to improve your feed DEV Community
 A space to discuss and keep up software development and manage your software career 
Future
 News and discussion of science and technology such as AI, VR, cryptocurrency, quantum computing, and more. 
Open Forem
 A general discussion space for the Forem community. If it doesn't have a home elsewhere, it belongs here 
Gamers Forem
 An inclusive community for gaming enthusiasts 
Music Forem
 From composing and gigging to gear, hot music takes, and everything in between. 
Vibe Coding Forem
 Discussing AI software development, and showing off what we're building. 
Popcorn Movies and TV
 Movie and TV enthusiasm, criticism and everything in-between. 
DUMB DEV Community
 Memes and software development shitposting 
Design Community
 Web design, graphic design and everything in-between 
Security Forem
 Your central hub for all things security. From ethical hacking and CTFs to GRC and career development, for beginners and pros alike 
Golf Forem
 A community of golfers and golfing enthusiasts 
Scale Forem
 For engineers building software at scale. We discuss architecture, cloud-native, and SRE—the hard-won lessons you can't just Google 
Crypto Forem
 A collaborative community for all things Crypto—from Bitcoin to protocol development and DeFi to NFTs and market analysis. 
Forem Core
 Discussing the core forem open source software project — features, bugs, performance, self-hosting. 
Parenting
 A place for parents to the share the joys, challenges, and wisdom that come from raising kids. We're here for them and for each other. 
Maker Forem
 A community for makers, hobbyists, and professionals to discuss Arduino, Raspberry Pi, 3D printing, and much more. 
HMPL.js Forem
 For developers using HMPL.js to build fast, lightweight web apps. A space to share projects, ask questions, and discuss server-driven templating 
Dropdown menu  Dropdown menu  Skip to content Powered by Algolia  Search   Log in  Create account DEV Community
 Add reaction   Like   Unicorn   Exploding Head   Raised Hands   Fire  Copied to Clipboard   Share to X  Share to LinkedIn  Share to Facebook  Share to Mastodon Share Post via...Report AbuseAlex Merced Posted on  Feb 20  
 Using Helm with Kubernetes: A Guide to Helm Charts and Their Implementation 
 Free Resources 
Free Apache Iceberg Course
Free Copy of “Apache Iceberg: The Definitive Guide”
2025 Apache Iceberg Architecture Guide
How to Join the Iceberg Community
Iceberg Lakehouse Engineering Video Playlist
Ultimate Apache Iceberg Resource Guide
Managing applications in Kubernetes can be complex, requiring multiple YAML files to define resources such as Deployments, Services, ConfigMaps, and Secrets. As applications scale, maintaining and updating these configurations manually becomes cumbersome and error-prone. This is where Helm comes in.
Helm is a package manager for Kubernetes that simplifies deployment by bundling application configurations into reusable, version-controlled Helm charts. With Helm, you can deploy applications with a single command, manage updates seamlessly, and roll back to previous versions if needed.
Why Use Helm?
Simplifies Deployments – Deploy complex applications with a single command instead of managing multiple YAML files.
Parameterization & Reusability – Configure deployments dynamically using  values.yaml , making it easy to manage multiple environments (dev, staging, prod).
Version Control & Rollbacks – Helm tracks deployments, allowing you to roll back to previous versions in case of failures.
Dependency Management – Install and manage application dependencies effortlessly.
Integration with CI/CD & GitOps – Automate deployments with tools like ArgoCD, FluxCD, and GitHub Actions.
What You'll Learn in This Guide
In this blog, we’ll cover:
What Helm is and how it works – Understanding its architecture and components.
Installing and configuring Helm – Setting up Helm for your Kubernetes cluster.
Understanding Helm charts – Exploring chart structure, templates, and values.
Writing your own Helm chart – Step-by-step guide to creating a custom chart.
Deploying applications with Helm – Installing, upgrading, and rolling back releases.
Best practices for Helm in production – Security, GitOps integration, and monitoring.
By the end of this guide, you'll have a strong foundation in Helm and be able to deploy, manage, and scale Kubernetes applications efficiently.
 Understanding Helm: The Package Manager for Kubernetes 
 What is Helm? 
Helm is a package manager for Kubernetes that helps deploy, configure, and manage applications in a Kubernetes cluster. Instead of manually writing and applying multiple Kubernetes YAML manifests, Helm allows you to package them into reusable Helm Charts, simplifying deployment and maintenance.
 Why Use Helm? 
Managing Kubernetes resources can become complex, especially when deploying applications with multiple components (Deployments, Services, ConfigMaps, Secrets, etc.). Helm provides several advantages:
Simplifies Deployments – Automates the process of applying multiple YAML files.
Versioning & Rollbacks – Tracks different versions of deployments and allows rollback if necessary.
Parameterization & Reusability – Uses a templating system ( values.yaml ) to customize deployments.
Dependency Management – Simplifies installing and upgrading application dependencies.
Consistent Configuration Across Environments – Makes it easy to manage different configurations for dev, staging, and production.
 How Does Helm Compare to Traditional Kubernetes Manifests? 
Feature   Kubernetes YAML Manifests   Helm Charts   Management   Requires manually applying multiple YAML files   Uses a single Helm command   Configuration   Static YAML definitions   Dynamic templating via  values.yaml   Version Control   Difficult to track changes manually   Built-in versioning & rollback   Reusability   Limited; each deployment needs its own YAML   Reusable and configurable charts   Dependencies   Managed manually   Handled via  requirements.yaml  (deprecated) or  Chart.yaml  
 How Helm Works 
 Helm Components and Architecture 
Helm follows a client-only architecture in Helm v3, where it directly interacts with the Kubernetes API server without requiring a backend component like Tiller (which was used in Helm v2). Below are the core components of Helm:
Helm CLI – The command-line interface used to manage Helm charts, releases, and repositories.
Helm Charts – Packaged Kubernetes applications that define resources like Deployments, Services, ConfigMaps, and Secrets.
Helm Repository – A collection of Helm charts stored in a remote or local location (e.g., Artifact Hub).
Helm Release – A deployed instance of a Helm chart, stored as metadata inside the Kubernetes cluster.
Kubernetes API Server – Helm interacts with the Kubernetes API to apply resources as defined in the chart.
 Helm Workflow: How Helm Manages Deployments 
Fetching Charts – Helm can pull pre-built charts from repositories using  helm repo add  and  helm search repo .
Templating and Rendering – Helm dynamically replaces values in the YAML templates using the  values.yaml  file before applying them.
Creating a Release – When a Helm chart is installed, Helm assigns it a unique release name and applies the rendered templates to the Kubernetes cluster.
Versioning and Rollbacks – Helm maintains a history of releases, allowing easy upgrades ( helm upgrade ) and rollbacks ( helm rollback ).
Uninstalling Releases – Helm can remove all associated Kubernetes resources using  helm uninstall .
 Helm Command Lifecycle 
Command   Purpose   helm repo add <repo-name> <repo-url>   Adds a Helm chart repository   helm search repo <keyword>   Searches for a chart in repositories   helm install <release-name> <chart-name>   Installs a Helm chart and creates a release   helm list   Lists all active Helm releases   helm status <release-name>   Shows details of a deployed release   helm upgrade <release-name> <chart-name>   Upgrades an existing release to a new chart version   helm rollback <release-name> <revision>   Rolls back a release to a previous version   helm uninstall <release-name>   Deletes a release and removes associated resources  
 Helm in Action: A Simple Example 
Let's say you want to deploy NGINX using Helm. You can do this with a single command: 
helm repo add bitnami https://charts.bitnami.com/bitnami helm  install  my-nginx bitnami/nginx  Enter fullscreen mode   Exit fullscreen mode  
This command:
Adds the Bitnami Helm repository.
Installs the NGINX Helm chart from the Bitnami repository.
Creates a Helm release named my-nginx in the cluster.
To check the status of the deployment: 
helm list helm status my-nginx  Enter fullscreen mode   Exit fullscreen mode  
To uninstall the release: 
helm uninstall my-nginx  Enter fullscreen mode   Exit fullscreen mode  
 Installing and Configuring Helm 
Before using Helm, you need to install it on your local machine and configure it to work with your Kubernetes cluster. This section will walk through the installation process and initial setup.
Prerequisites
A Kubernetes cluster running locally (e.g., Minikube, Kind) or in the cloud (e.g., AKS, GKE, EKS).
kubectl  installed and configured to communicate with your cluster.
Installing Helm
Helm can be installed on macOS, Linux, and Windows using various package managers.
macOS (Using Homebrew)
brew  install  helm  Enter fullscreen mode   Exit fullscreen mode  
 Linux (Using Script) 
curl  -fsSL  https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash  Enter fullscreen mode   Exit fullscreen mode  
 Windows (Using Chocolatey) 
choco  install  kubernetes-helm  Enter fullscreen mode   Exit fullscreen mode  
 Verifying the Installation 
After installation, verify that Helm is installed correctly by running: 
helm version  Enter fullscreen mode   Exit fullscreen mode  
You should see output similar to: 
version . BuildInfo { Version : " v3.x.x " ,   GitCommit : " ... " ,   GitTreeState : " clean " ,   GoVersion : " ... " }   Enter fullscreen mode   Exit fullscreen mode  
 Configuring Helm 
 Adding a Helm Repository 
Helm uses repositories to store charts. You can add a popular repository, such as the Bitnami Helm charts, using: 
helm repo add bitnami https://charts.bitnami.com/bitnami  Enter fullscreen mode   Exit fullscreen mode  
To confirm the repository has been added: 
helm repo list  Enter fullscreen mode   Exit fullscreen mode  
 Updating Helm Repositories 
To fetch the latest charts from all added repositories, run: 
helm repo update  Enter fullscreen mode   Exit fullscreen mode  
 Searching for Helm Charts 
To search for a specific application within your configured repositories: 
helm search repo nginx  Enter fullscreen mode   Exit fullscreen mode  
 Installing a Helm Chart 
Once Helm is set up, you can deploy an application. For example, to deploy NGINX using the Bitnami Helm chart: 
helm  install  my-nginx bitnami/nginx  Enter fullscreen mode   Exit fullscreen mode  
This will:
Download the NGINX chart.
Deploy the necessary Kubernetes resources.
Assign the release name my-nginx.
 Checking the Installation 
List all active Helm releases: 
helm list  Enter fullscreen mode   Exit fullscreen mode  
Check the status of a specific release: 
helm status my-nginx  Enter fullscreen mode   Exit fullscreen mode  
 Uninstalling a Helm Release 
To remove the my-nginx release and all associated resources: 
helm uninstall my-nginx  Enter fullscreen mode   Exit fullscreen mode  
 Understanding Helm Charts 
 What is a Helm Chart? 
A Helm chart is a packaged application definition that contains Kubernetes resource templates and default configuration values. It allows you to deploy complex applications with a single command while keeping configurations modular and reusable.
Each chart defines:
What Kubernetes resources to deploy (e.g., Deployments, Services, ConfigMaps).
How those resources should be configured using a parameterized values file ( values.yaml ).
Dependencies and metadata required for installation.
 Structure of a Helm Chart 
When you create a Helm chart, it follows a specific directory structure: 
mychart/ │── charts/ # Directory for chart dependencies (other charts) │── templates/ # Contains Kubernetes YAML templates │ ├── deployment.yaml │ ├── service.yaml │ ├── ingress.yaml │ ├── _helpers.tpl # Contains reusable template functions │── Chart.yaml # Metadata about the chart (name, version, description) │── values.yaml # Default configuration values for the chart │── README.md # Documentation about the chart  Enter fullscreen mode   Exit fullscreen mode  
Each file in this structure serves a specific purpose:
Chart.yaml – Contains metadata such as chart name, version, and description.
values.yaml – Defines default values that can be overridden during installation.
templates/ – Holds Kubernetes manifest templates using Helm’s templating syntax.
charts/ – Stores dependencies (other charts required for deployment).
README.md – Documents how to use the chart.
 Example:  Chart.yaml  
The  Chart.yaml  file provides information about the chart: 
apiVersion :   v2   name :   mychart   description :   A sample Helm chart for Kubernetes   type :   application   version :   1.0.0   appVersion :   1.16.0   name :   The chart's name.   description :   A brief description of what the chart does.   version :   The chart version (used for versioning updates).   appVersion :   The application version the chart deploys.   Enter fullscreen mode   Exit fullscreen mode  
 Example:  values.yaml  
The values.yaml file defines default configuration values: 
replicaCount :   2   image :   repository :   nginx   tag :   latest   pullPolicy :   IfNotPresent   service :   type :   ClusterIP   port :   80   Enter fullscreen mode   Exit fullscreen mode  
These values can be overridden when installing the chart using the  --set  flag or a custom values file.
 Example:  templates/deployment.yaml  
A sample Kubernetes Deployment template using Helm's templating syntax: 
apiVersion :   apps/v1   kind :   Deployment   metadata :   name :   {{   .Release.Name   }} -nginx   spec :   replicas :   {{   .Values.replicaCount   }}   selector :   matchLabels :   app :   nginx   template :   metadata :   labels :   app :   nginx   spec :   containers :   -   name :   nginx   image :   " {{   .Values.image.repository   }}:{{   .Values.image.tag   }}"   imagePullPolicy :   {{   .Values.image.pullPolicy   }}   ports :   -   containerPort :   {{   .Values.service.port   }}   Enter fullscreen mode   Exit fullscreen mode  
In this template:
{{ .Release.Name }}  dynamically sets the release name.
{{ .Values.replicaCount }}  pulls values from values.yaml.
{{ .Values.image.repository }}:{{ .Values.image.tag }}  sets the container image dynamically.
 Rendering Helm Templates 
Before applying a Helm chart, you can preview how the templates will render using: 
helm template mychart  Enter fullscreen mode   Exit fullscreen mode  
 Writing Your Own Helm Chart 
Now that we understand Helm charts and their structure, let’s walk through the process of creating a custom Helm chart from scratch.
Step 1: Create a New Helm Chart
To generate a new Helm chart, use the following command: 
helm create mychart  Enter fullscreen mode   Exit fullscreen mode  
This command creates a new directory mychart/ with the standard Helm chart structure.
Step 2: Modify values.yaml
Open  values.yaml  and update it with custom values. Let’s modify it to deploy an NGINX web server with a LoadBalancer service: 
replicaCount :   3   image :   repository :   nginx   tag :   latest   pullPolicy :   IfNotPresent   service :   type :   LoadBalancer   port :   80   Enter fullscreen mode   Exit fullscreen mode  
replicaCount: Defines how many replicas the deployment will create.
image: Configures the container image.
service: Sets the service type and port.
 Step 3: Customize Deployment Template 
Edit  templates/deployment.yaml  to use Helm’s templating syntax: 
apiVersion :   apps/v1   kind :   Deployment   metadata :   name :   {{   .Release.Name   }} -nginx   labels :   app :   nginx   spec :   replicas :   {{   .Values.replicaCount   }}   selector :   matchLabels :   app :   nginx   template :   metadata :   labels :   app :   nginx   spec :   containers :   -   name :   nginx   image :   " {{   .Values.image.repository   }}:{{   .Values.image.tag   }}"   imagePullPolicy :   {{   .Values.image.pullPolicy   }}   ports :   -   containerPort :   {{   .Values.service.port   }}   {{   .Release.Name   }}   dynamically assigns the release name.   {{   .Values.replicaCount   }}   references values from values.yaml.   {{   .Values.image.repository   }} :{{ .Values.image.tag }} configures the image dynamically.   Enter fullscreen mode   Exit fullscreen mode  
 Step 4: Customize the Service Template 
Edit  templates/service.yaml  to configure the service: 
apiVersion :   v1   kind :   Service   metadata :   name :   {{   .Release.Name   }} -nginx   spec :   type :   {{   .Values.service.type   }}   selector :   app :   nginx   ports :   -   protocol :   TCP   port :   {{   .Values.service.port   }}   targetPort :   {{   .Values.service.port   }}   Enter fullscreen mode   Exit fullscreen mode  
 Step 5: Package the Helm Chart 
Once you've modified the necessary files, package the chart: 
helm package mychart  Enter fullscreen mode   Exit fullscreen mode  
This creates a  .tgz  archive of the chart, making it ready for distribution.
 Step 6: Install the Chart 
Deploy the chart to your Kubernetes cluster: 
helm  install  my-nginx ./mychart  Enter fullscreen mode   Exit fullscreen mode  
This:
Parses templates.
Replaces placeholders with values from values.yaml.
Applies the resources to Kubernetes.
 Step 7: Verify the Deployment 
Check the deployed resources: 
helm list kubectl get pods kubectl get svc  Enter fullscreen mode   Exit fullscreen mode  
 Step 8: Uninstall the Chart 
To remove the deployment, use: 
helm uninstall my-nginx  Enter fullscreen mode   Exit fullscreen mode  
 Deploying Applications with Helm 
Once you've created or downloaded a Helm chart, you can use Helm to deploy and manage applications in your Kubernetes cluster. This section will walk through the deployment process, including installation, upgrades, rollbacks, and uninstallation.
Step 1: Installing a Helm Chart
To deploy an application using Helm, use the  helm install  command: 
helm  install  my-nginx ./mychart  Enter fullscreen mode   Exit fullscreen mode  
my-nginx  is the release name (a unique identifier for this deployment).
./mychart  is the path to the Helm chart.
If you are installing a chart from a repository, such as Bitnami, use: 
helm repo add bitnami https://charts.bitnami.com/bitnami helm  install  my-nginx bitnami/nginx  Enter fullscreen mode   Exit fullscreen mode  
This command:
Pulls the nginx chart from the Bitnami repository.
Deploys NGINX to the Kubernetes cluster.
Creates a Helm release named my-nginx.
 Step 2: Verifying the Deployment 
Once the chart is installed, verify that the release is active: 
helm list  Enter fullscreen mode   Exit fullscreen mode  
This will output something like: 
NAME NAMESPACE REVISION UPDATED STATUS CHART APP VERSION my-nginx default 1 2024-02-16 10:00:00 deployed nginx-1.2.3 1.21.6  Enter fullscreen mode   Exit fullscreen mode  
You can check the detailed status of a release: 
helm status my-nginx  Enter fullscreen mode   Exit fullscreen mode  
To view the created Kubernetes resources: 
kubectl get pods kubectl get svc  Enter fullscreen mode   Exit fullscreen mode  
 Step 3: Customizing Helm Releases 
Helm allows you to override default values using the  --set  flag or a custom values file.
 Using the  --set  Flag 
You can override individual values like this: 
helm  install  my-nginx bitnami/nginx  --set   replicaCount = 3  Enter fullscreen mode   Exit fullscreen mode  
 Using a Custom values.yaml File 
To provide multiple custom values, create a  my-values.yaml  file: 
replicaCount :   3   service :   type :   LoadBalancer   port :   8080   Enter fullscreen mode   Exit fullscreen mode  
Then, deploy the chart with: 
helm  install  my-nginx bitnami/nginx  -f  my-values.yaml  Enter fullscreen mode   Exit fullscreen mode  
 Step 4: Upgrading a Helm Release 
If you need to modify a running deployment, use the helm upgrade command: 
helm upgrade my-nginx bitnami/nginx  --set   replicaCount = 5  Enter fullscreen mode   Exit fullscreen mode  
To upgrade using a modified values file: 
helm upgrade my-nginx bitnami/nginx  -f  my-values.yaml  Enter fullscreen mode   Exit fullscreen mode  
This updates the deployment while keeping existing resources intact.
 Step 5: Rolling Back to a Previous Version 
Helm maintains a history of releases, allowing you to roll back if needed.
List the release history: 
helm  history  my-nginx  Enter fullscreen mode   Exit fullscreen mode  
Roll back to a specific revision: 
helm rollback my-nginx 1  Enter fullscreen mode   Exit fullscreen mode  
 Step 6: Uninstalling a Helm Release 
To remove a Helm deployment and all its associated resources, run: 
helm uninstall my-nginx  Enter fullscreen mode   Exit fullscreen mode  
To confirm deletion: 
helm list kubectl get all  Enter fullscreen mode   Exit fullscreen mode  
 Helm Best Practices 
Using Helm effectively requires following best practices to ensure maintainability, security, and scalability of deployments. This section outlines key strategies for optimizing Helm usage in production environments.
1. Organizing Values in  values.yaml  for Clarity
A well-structured  values.yaml  file improves readability and maintainability.
 ✅ Good Example: Structured and Documented
replicaCount :   3   # Number of replicas for high availability   image :   repository :   nginx   tag :   latest   pullPolicy :   IfNotPresent   # Pull policy to optimize image fetching   service :   type :   LoadBalancer   port :   80   # Publicly exposed service port   resources :   limits :   cpu :   500m   memory :   256Mi   requests :   cpu :   250m   memory :   128Mi   Enter fullscreen mode   Exit fullscreen mode  
 ❌ Bad Example: Unstructured and Unclear 
replicaCount :   3   image :   nginx:latest   serviceType :   LoadBalancer   port :   80   cpu :   500m   memory :   256Mi   Enter fullscreen mode   Exit fullscreen mode  
No clear nesting.
Missing descriptions for future maintainers.
Harder to override values at a granular level.
 2. Using helm dependency for Managing Dependencies 
If your chart depends on other charts (e.g., a database), declare them in Chart.yaml: 
dependencies :   -   name :   postgresql   version :   " 12.1.3"   repository :   " https://charts.bitnami.com/bitnami"   Enter fullscreen mode   Exit fullscreen mode  
Then, update dependencies before installing: 
helm dependency update  Enter fullscreen mode   Exit fullscreen mode  
This ensures that all required subcharts are installed and properly versioned.
 3. Leveraging helm secrets for Sensitive Values 
Avoid storing credentials in values.yaml. Instead, use Helm Secrets to encrypt sensitive values.
Install the Helm Secrets plugin: 
helm plugin  install  https://github.com/zachomedia/helm-secrets  Enter fullscreen mode   Exit fullscreen mode  
Encrypt sensitive values using SOPS: 
sops  --encrypt   --in-place  my-values.yaml  Enter fullscreen mode   Exit fullscreen mode  
Install a chart using encrypted values: 
helm  install  my-app ./mychart  -f  my-values.yaml  Enter fullscreen mode   Exit fullscreen mode  
This ensures secrets are not stored in plaintext inside version control.
 4. Automating Helm Deployments in CI/CD Pipelines 
Integrate Helm with CI/CD tools like GitHub Actions, GitLab CI/CD, or ArgoCD to automate deployments.
 Example GitHub Actions Workflow for Helm 
name :   Deploy Helm Chart   on :   push :   branches :   -   main   jobs :   deploy :   runs-on :   ubuntu-latest   steps :   -   name :   Checkout repository   uses :   actions/checkout@v3   -   name :   Install Helm   run :   |   curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash   -   name :   Deploy to Kubernetes   run :   |   helm upgrade --install my-app ./mychart --namespace prod   Enter fullscreen mode   Exit fullscreen mode  
This automates deployments whenever code is pushed to the main branch.
 5. Keeping Charts Versioned and Documented 
Use semantic versioning in  Chart.yaml  (version: 1.2.0).
Document all available values in  README.md . Maintain a  CHANGELOG.md  to track modifications.
 #6. Managing Multiple Environments (Dev, Staging, Prod) 
Helm allows environment-specific values with separate values files: 
helm  install  my-app ./mychart  -f  values-dev.yaml helm  install  my-app ./mychart  -f  values-prod.yaml  Enter fullscreen mode   Exit fullscreen mode  
This ensures different configurations for testing and production.
 7. Helm Security Considerations 
Avoid running Helm with cluster-wide privileges.
Restrict Helm Release Names to prevent namespace conflicts.
Use RBAC policies to limit Helm access. Regularly update Helm and chart dependencies to patch vulnerabilities.
 Summary 
Organize values.yaml clearly for maintainability.
Use helm dependency to manage subcharts.
Secure sensitive values with helm secrets and encryption.
Automate Helm deployments using CI/CD.
Maintain versioning, documentation, and separate environments.
Follow security best practices to protect Kubernetes resources.
In the next section, we’ll discuss Helm’s role in large-scale production deployments and how to integrate it with GitOps tools like ArgoCD and Flux.
 Helm in Production: Managing Complexity at Scale 
As organizations scale their Kubernetes deployments, managing Helm charts effectively in production becomes crucial. This section explores how Helm integrates with GitOps tools, supports multi-environment management, and follows best practices for high availability and security.
1. Using GitOps with Helm (ArgoCD & Flux)
GitOps enables declarative infrastructure management, where Helm charts are stored in Git repositories and automatically deployed using tools like ArgoCD and Flux.
Deploying Helm Charts with ArgoCD
ArgoCD monitors a Git repository and applies changes automatically.
Install ArgoCD: 
 kubectl create namespace argocd kubectl apply  -n  argocd  -f  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml  Enter fullscreen mode   Exit fullscreen mode  
Deploy a Helm Chart with ArgoCD: 
apiVersion :   argoproj.io/v1alpha1   kind :   Application   metadata :   name :   my-helm-app   namespace :   argocd   spec :   project :   default   source :   repoURL :   https://github.com/my-org/helm-charts.git   targetRevision :   main   path :   mychart   helm :   valueFiles :   -   values-prod.yaml   destination :   server :   https://kubernetes.default.svc   namespace :   prod   Enter fullscreen mode   Exit fullscreen mode  
Apply the application manifest: 
kubectl apply  -f  my-helm-app.yaml  Enter fullscreen mode   Exit fullscreen mode  
ArgoCD will now continuously sync the Helm chart with the Kubernetes cluster.
 Using FluxCD for Helm Deployments 
FluxCD can also automate Helm deployments: 
flux create  source  git my-helm-repo  \   --url = https://github.com/my-org/helm-charts.git  \   --branch = main flux create helmrelease my-app  \   --source = GitRepository/my-helm-repo  \   --chart = mychart  \   --namespace = prod  Enter fullscreen mode   Exit fullscreen mode  
GitOps ensures:
Automated rollouts & rollbacks when changes are pushed to Git.
Version-controlled infrastructure for reproducibility.
Improved collaboration by managing Helm charts as code.
 2. Managing Multi-Cluster Deployments 
For enterprises running multiple Kubernetes clusters (e.g., dev, staging, prod), Helm enables consistent deployments across environments.
 Option 1: Context Switching with kubectl 
kubectl config use-context dev-cluster helm  install  my-app ./mychart  --namespace  dev kubectl config use-context prod-cluster helm  install  my-app ./mychart  --namespace  prod  Enter fullscreen mode   Exit fullscreen mode  
 Option 2: Using Helmfile for Multi-Cluster Deployments 
Helmfile allows managing multiple Helm releases in a declarative format.
Example helmfile.yaml: 
releases :   -   name :   my-app-dev   namespace :   dev   chart :   ./mychart   values :   -   values-dev.yaml   -   name :   my-app-prod   namespace :   prod   chart :   ./mychart   values :   -   values-prod.yaml   Enter fullscreen mode   Exit fullscreen mode  
Deploy all environments at once: 
helmfile apply  Enter fullscreen mode   Exit fullscreen mode  
 3. Ensuring High Availability and Reliability 
Use Helm Hooks: Automate pre-install and post-install tasks. 
annotations :   " helm.sh/hook" :   pre-install   Enter fullscreen mode   Exit fullscreen mode  
Enable Readiness and Liveness Probes to ensure application health: 
readinessProbe :   httpGet :   path :   /   port :   80   initialDelaySeconds :   5   periodSeconds :   10   Enter fullscreen mode   Exit fullscreen mode  
Use Rolling Updates with strategy to prevent downtime: 
strategy :   type :   RollingUpdate   rollingUpdate :   maxUnavailable :   1   maxSurge :   1   Enter fullscreen mode   Exit fullscreen mode  
 4. Helm Security Best Practices for Production 
Restrict Helm Permissions using Role-Based Access Control (RBAC): 
kind :   Role   apiVersion :   rbac.authorization.k8s.io/v1   metadata :   namespace :   prod   name :   helm-user   rules :   -   apiGroups :   [ " *" ]   resources :   [ " deployments" ,   " services" ]   verbs :   [ " get" ,   " list" ,   " create" ,   " update" ,   " delete" ]   Enter fullscreen mode   Exit fullscreen mode  
 Avoid Storing Secrets in values.yaml: 
Use Kubernetes Secrets and refer to them in Helm templates. En- crypt secrets with SOPS or use External Secrets Operator.
 Implement Image Scanning: 
Use tools like Trivy or Anchore to scan Helm charts and container images.
 Regularly Update Helm and Charts: 
Ensure Helm CLI and chart dependencies are up to date.
Use helm dependency update to pull the latest versions.
 5. Monitoring and Logging Helm Deployments 
Track Helm Releases: 
helm list  --all-namespaces   Enter fullscreen mode   Exit fullscreen mode  
Monitor Deployments with Prometheus & Grafana:
Install Prometheus using Helm: 
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts helm  install  prometheus prometheus-community/prometheus  Enter fullscreen mode   Exit fullscreen mode  
 Integrate with Grafana for dashboard visualization. 
Use Helm Logs to Debug Issues: 
helm get manifest my-app helm get values my-app helm get notes my-app  Enter fullscreen mode   Exit fullscreen mode  
 Summary 
GitOps tools (ArgoCD, Flux) enable automated Helm deployments.
Multi-cluster management can be streamlined with Helmfile or Helm contexts.
High availability practices ensure smooth rolling updates and failovers.
Security best practices include using RBAC, encrypted secrets, and image scanning.
Monitoring tools like Prometheus and Grafana help track Helm deployments.
 9. Conclusion and Next Steps 
Helm simplifies Kubernetes application deployment, making it easier to manage complex workloads with reusable, version-controlled charts. By leveraging Helm, teams can standardize configurations, automate deployments, and integrate with GitOps workflows to achieve reliable and scalable Kubernetes operations.
Key Takeaways
Helm is the Kubernetes Package Manager – It streamlines application deployments by packaging Kubernetes resources into reusable Helm charts.
Charts Provide Flexibility – Using  values.yaml , teams can easily override configurations without modifying templates.
Helm Supports Versioning & Rollbacks – The ability to upgrade and roll back releases ensures stability and rapid recovery.
Automation & CI/CD Integration – Helm works seamlessly with GitOps tools like ArgoCD and FluxCD to automate deployments.
Security & Best Practices Matter – Implement RBAC, use secrets management, and ensure chart dependencies are up to date to maintain a secure and efficient Helm workflow.
Monitoring & Debugging Are Essential – Use Prometheus, Grafana, and Helm’s built-in commands ( helm list ,  helm get ) to track deployments and troubleshoot issues.
Next Steps: Continue Learning Helm
Now that you understand Helm’s capabilities, here are some next steps to deepen your knowledge and practical experience:
Explore Official Helm Documentation 📌 Helm Docs
Deploy Real-World Applications with Helm
Try deploying WordPress, PostgreSQL, or Redis with Helm charts from Artifact Hub.
Example: 
 helm repo add bitnami https://charts.bitnami.com/bitnami helm  install  my-wordpress bitnami/wordpress 
Experiment with Custom Helm Charts
Modify an existing chart or build one from scratch.
Deploy it to different environments using separate  values.yaml  files.
Integrate Helm with a CI/CD Pipeline
Set up GitHub Actions, GitLab CI/CD, or Jenkins to automate Helm deployments.
Learn Advanced Helm Features
Helm Hooks: Automate tasks before/after deployments.
Helm Subcharts: Manage dependencies efficiently.
Helm Secrets: Encrypt sensitive configurations.
Follow Helm & Kubernetes Communities
Join the CNCF Slack (#helm-users channel).
Follow Kubernetes and Helm GitHub discussions for the latest updates.
Final Thoughts
Helm is an essential tool for Kubernetes administrators and DevOps teams looking to optimize deployment workflows. Whether you are deploying simple microservices or complex cloud-native applications, Helm provides the flexibility, automation, and reliability needed to scale efficiently.
Start experimenting with Helm today and take your Kubernetes skills to the next level!
Additional Resources
Helm Charts Repository: Artifact Hub
Kubernetes Documentation: Kubernetes.io
ArgoCD for Helm: ArgoCD Docs
FluxCD for Helm: FluxCD Docs
Helm Security Best Practices: Helm Security Guide
 Top comments  (0)  
Subscribe   Create template Templates let you quickly answer FAQs or store snippets for re-use.
Dismiss Are you sure you want to hide this comment? It will become hidden in your post, but will still be visible via the comment's permalink. 
Hide child comments as well
For further actions, you may consider blocking this person and/or reporting abuse
 Alex Merced  I like to code, teach and promote. Subscribe to the Web Dev 101 and Datanation podcasts. Blogs and videos at devNursery.com and GrokOverflow.com. Find everything at AlexMerced.com 
 Location   Orlando, FL 
 Work   Head of DevRel @ Dremio 
 Joined  Dec 8, 2019  
 More from Alex Merced
 Apache Dev List Digest: Iceberg, Polaris, Arrow & Parquet (Dec 9th - Dec15th, 2025)  # dataengineering   # news   # opensource   Apache Dev List Digest: Iceberg, Polaris, Arrow & Parquet (Nov 24-Dec 8, 2025)  # dataengineering   # opensource   # architecture   # community   dremioframe & iceberg: Pythonic interfaces for Dremio and Apache Iceberg  # python   # tooling   # database   # dataengineering  
Google AI is the official AI Model and Platform Partner of DEV
Neon is the official database partner of DEV
Algolia is the official search partner of DEV
DEV Community — A space to discuss and keep up software development and manage your software career 
 Home 
 DEV++ 
 Podcasts 
 Videos 
 DEV Education Tracks 
 DEV Challenges 
 DEV Help 
 Advertise on DEV 
 DEV Showcase 
 About 
 Contact 
 Free Postgres Database 
 Software comparisons 
 Forem Shop 
 Code of Conduct 
 Privacy Policy 
 Terms of Use 
Built on Forem — the open source software that powers DEV and other inclusive communities.
Made with love and Ruby on Rails. DEV Community  ©  2016 - 2025.
 We're a place where coders share, stay up-to-date and grow their careers. 