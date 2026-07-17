> Source: https://shunya-vichaar.medium.com/guide-to-deploying-fastapi-with-helm-on-kubernetes-6529cdd147e5

SitemapOpen in app
Sign in
Medium LogoWriteSearch
Sign in
Guide to Deploying FastAPI with Helm on Kubernetes
Shunya Vichaar4 min read · Feb 22, 2025--
Press enter or click to view image in full size
Deploying applications on Kubernetes can be complex, requiring intricate configurations for scalability, service discovery, and management. Helm, a package manager for Kubernetes, simplifies these processes by templating Kubernetes manifests and providing version control for deployments. This guide presents a detailed, technical walkthrough for deploying a FastAPI application using Helm on Kubernetes.
Setting Up the FastAPI Application
Before deploying to Kubernetes, we need to containerize a simple FastAPI application using Docker.
Application Code ( app/main.py )
from fastapi import FastAPI  app = FastAPI()  @app.get("/")  def read_root():   return {"message": "Hello, World!"}
This FastAPI application provides a simple API that returns a JSON message.
Dependencies ( app/requirements.txt )
fastapi  uvicorn
This file defines the application dependencies, where FastAPI serves as the framework and Uvicorn as the ASGI server.
Docker
FROM python:3.10-slim  WORKDIR /app  COPY requirements.txt .  RUN pip install --no-cache-dir -r requirements.txt  COPY . .  EXPOSE 8000  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
The Dockerfile specifies a lightweight Python environment, installs dependencies, and runs the FastAPI application with Uvicorn.
Once the Docker image is built using:
docker build -t fastapi-app .
It can be tested locally before proceeding with Kubernetes deployment.
Why Use Helm for Kubernetes Deployment?
Helm streamlines Kubernetes deployments by managing configurations, templates, and updates efficiently. It offers:
Template-based YAML generation — Eliminates redundant manual configurations.
Environment-specific overrides — Handles multiple environments with  values.yaml .
Version control & rollbacks — Enables tracking changes and reverting to stable versions.
Dependency management — Supports sub-charts for modular applications.
Efficient scaling — Modifies resource limits dynamically.
Project Directory Structure
After setting up Helm, the project will have the following structure:
hello-world-fastapi/  ├── chart/  │ ├── Chart.yaml  │ ├── values.yaml  │ ├── templates/  │ │ ├── deployment.yaml  │ │ ├── service.yaml  │ │ ├── _helpers.tpl  │ │ └── NOTES.txt  ├── app/  │ ├── main.py  │ ├── Dockerfile  │ ├── requirements.txt
chart/ : Helm configuration files.
templates/ : YAML templates for Kubernetes resources.
values.yaml : Defines customizable variables for deployments.
Creating a Helm Chart for FastAPI
Helm Chart Metadata ( Chart.yaml )
apiVersion: v2  name: hello-world-fastapi  description: A Helm chart for FastAPI application  type: application  version: 0.1.0  appVersion: "1.0.0"
This defines Helm metadata, including the application version and chart details.
Configuring Helm Variables ( values.yaml )
replicaCount: 2  image:   repository: fastapi-app   tag: latest   pullPolicy: IfNotPresent  service:   type: NodePort   port: 80   targetPort: 8000   nodePort: 30000  resources:   limits:   cpu: "500m"   memory: "512Mi"   requests:   cpu: "250m"   memory: "256Mi"  ingress:   enabled: false 
This configuration file allows customization of deployments through Helm commands.
Defining Kubernetes Resources in Helm
Deployment Template ( deployment.yaml )
apiVersion: apps/v1  kind: Deployment  metadata:   name: {{ .Release.Name }}-deployment   labels:   app: {{ .Chart.Name }}  spec:   replicas: {{ .Values.replicaCount }}   selector:   matchLabels:   app: {{ .Chart.Name }}   template:   metadata:   labels:   app: {{ .Chart.Name }}   spec:   containers:   - name: {{ .Chart.Name }}   image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"   ports:   - containerPort: {{ .Values.service.targetPort }}   resources:   limits:   cpu: {{ .Values.resources.limits.cpu }}   memory: {{ .Values.resources.limits.memory }}   requests:   cpu: {{ .Values.resources.requests.cpu }}   memory: {{ .Values.resources.requests.memory }}
This Helm template dynamically injects values from  values.yaml  to define a Kubernetes Deployment.
Service Template ( service.yaml )
apiVersion: v1  kind: Service  metadata:   name: {{ .Release.Name }}-service  spec:   type: {{ .Values.service.type }}   ports:   - port: {{ .Values.service.port }}   targetPort: {{ .Values.service.targetPort }}   nodePort: {{ .Values.service.nodePort }}   selector:   app: {{ .Chart.Name }}
This template defines how Kubernetes exposes the FastAPI application.
Deploying the FastAPI Application Using Helm
1. Validate the Helm Chart
Check for errors in the Helm configuration:
helm lint chart/
2. Install the Helm Chart
Deploy the application using:
helm install hello-world ./chart
3. Verify Deployment
Confirm the Pods and services are running:
kubectl get pods  kubectl get service
4. Access the Application
Use Minikube to expose the service:
minikube service hello-world-service
Alternatively, use port forwarding:
kubectl port-forward service/hello-world-service 8080:80
The application should now be accessible at  http://localhost:8080 .
Managing Updates and Rollbacks with Helm
Upgrading the Deployment
Modify  values.yaml  and apply changes:
helm upgrade hello-world ./chart
Rolling Back to a Previous Version
To revert to a stable version:
helm rollback hello-world <revision-number>
Adding New Features
Environment Variables
Update values.yaml:
env:   - name: API_KEY   value: "my-secret-key"
Modify deployment.yaml to include environment variables:
env:   {{- with .Values.env }}   {{- toYaml . | nindent 8 }}   {{- end }}
After updating, upgrade the Helm chart:
helm upgrade hello-world ./chart
Conclusion
Deploying FastAPI with Helm on Kubernetes provides a scalable, maintainable, and reproducible workflow. Helm simplifies configuration management, deployment automation, and version control, making it an essential tool for Kubernetes deployments. This guide covered setting up a FastAPI application, defining Kubernetes configurations, and using Helm for deployment and lifecycle management.
With Helm and Kubernetes, your FastAPI application is production-ready, scalable, and resilient. This methodology can be further extended with Ingress Controllers, CI/CD pipelines, and autoscaling for robust, cloud-native applications.
MlopsKubernetesHelmFastapiDeployment
Written by  Shunya Vichaar
34 followers·12 followingImagination + Science = Discovery
No responses yet
Help
Status
About
Careers
Press
Blog
Privacy
Rules
Terms
Text to speech