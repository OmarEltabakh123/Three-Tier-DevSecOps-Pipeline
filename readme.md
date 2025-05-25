# 🛠️ Three-Tier Node.js App with Full DevOps Pipeline

## 📦 Backend Microservice

A simple Express.js backend application containerized with Docker, deployed on Kubernetes using Helm, with a complete CI/CD pipeline powered by Jenkins, SonarQube, Trivy, and ArgoCD.

---

## 🧱 Project Structure

three-tier/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── helm-chart/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── Jenkinsfile
└── README.md

---

## 🚀 Features

- **Jenkins**: Automates CI pipeline (build, test, scan, push).
- **SonarQube**: Code quality analysis.
- **Trivy**: Security scanning for files and Docker images.
- **Docker**: Containerization.
- **Helm**: Kubernetes deployment templating.
- **ArgoCD**: GitOps-based CD pipeline.
- **Prometheus**: Monitoring (with optional Grafana).

---

## 🔁 CI/CD Pipeline Flow

1. Push code to GitHub → triggers Jenkins via webhook.
2. Jenkins pipeline:
   - Installs dependencies
   - Runs SonarQube scan
   - Runs Trivy scan (filesystem and Docker image)
   - Builds and pushes Docker image
   - Updates Helm chart image tag (e.g., using `sed` or a Helm plugin)
   - Pushes updated Helm chart to GitHub
3. ArgoCD detects Helm chart change in GitHub and deploys to Kubernetes cluster.

---

## 🐳 Docker

```bash
docker build -t omareltabakh/backend-app .
docker push omareltabakh/backend-app


🧪 Running Locally

### 🔹 Backend
```bash
cd backend
npm install
npm start


👨‍💻 Developers
Name: Omar Eltabakh
GitHub: https://github.com/OmarEltabakh123
Name: Amr Hatem
GitHub: https://github.com/moraa121212

📄 License
This project is licensed under the MIT License.

```bash
git add README.md
git commit -m "Add project README"
git push origin main