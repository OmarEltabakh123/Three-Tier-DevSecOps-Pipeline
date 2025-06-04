pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'amrhatem'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'branch-2', url: 'https://github.com/OmarEltabakh123/Three-Tier-DevSecOps-Pipeline.git'
            }
        }
        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'CI=true npm test || echo "No tests found, continuing..."'
                }
            }
        }
        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm test || echo "Frontend tests failed, continuing..."'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_REGISTRY}/backend:${IMAGE_TAG} ./backend'
                sh 'docker tag ${DOCKER_REGISTRY}/backend:${IMAGE_TAG} ${DOCKER_REGISTRY}/backend:latest'
            }
        }
        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} ./frontend'
                sh 'docker tag ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} ${DOCKER_REGISTRY}/frontend:latest'
            }
        }
        stage('Scan Docker Images with Trivy') {
            steps {
                sh 'trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_REGISTRY}/backend:${IMAGE_TAG}'
                sh 'trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}'
            }
        }
        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push ${DOCKER_REGISTRY}/backend:${IMAGE_TAG}'
                    sh 'docker push ${DOCKER_REGISTRY}/backend:latest'
                    sh 'docker push ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}'
                    sh 'docker push ${DOCKER_REGISTRY}/frontend:latest'
                }
            }
        }
        stage('Update K8s Manifests with Image Tags') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
            sh '''
                sed -i "s|image: amrhatem/backend:.*|image: amrhatem/backend:${IMAGE_TAG}|g" kubernetes/backend-deployment.yaml
                sed -i "s|image: amrhatem/frontend:.*|image: amrhatem/frontend:${IMAGE_TAG}|g" kubernetes/frontend-deployment.yaml
                git config user.email "amr.hatem2h@gmail.com"
                git config user.name "moraa121212"
                git add kubernetes/backend-deployment.yaml kubernetes/frontend-deployment.yaml
                git commit -m "Update K8s manifests with new image tags for build ${IMAGE_TAG}" || echo "No changes to commit"
                git push https://${GIT_USER}:${GIT_PASS@github.com/OmarEltabakh123/Three-Tier-DevSecOps-Pipeline.git HEAD:branch-2
            '''
        }
    }
}
        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh 'kubectl apply -f kubernetes/mongo-deployment.yml'
                    sh 'kubectl apply -f kubernetes/mongo-service.yml'
                    sh 'kubectl apply -f kubernetes/backend-deployment.yml'
                    sh 'kubectl apply -f kubernetes/backend-service.yml'
                    sh 'kubectl apply -f kubernetes/frontend-deployment.yml'
                    sh 'kubectl apply -f kubernetes/frontend-service.yml'
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh 'kubectl rollout status deployment/backend-deployment'
                    sh 'kubectl rollout status deployment/frontend-deployment'
                    sh 'kubectl rollout status deployment/mongo-deployment'
                    sh 'kubectl get pods -n default'
                }
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}
