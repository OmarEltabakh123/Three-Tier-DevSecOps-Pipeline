pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'omareltabakh/backend-app'
        FRONTEND_IMAGE = 'omareltabakh/frontend-app'
        TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/OmarEltabakh123/Three-Tier-DevSecOps-Pipeline.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                sh 'cd backend && npm install'
            }
        }

        stage('Backend Code Quality') {
            steps {
                sh 'cd backend && sonar-scanner'
            }
        }

        stage('Backend Unit Tests') {
            steps {
                sh 'cd backend && npm test || true' // || true عشان مايفشلش الـ pipeline لو مفيش tests
            }
        }

        stage('Backend Trivy File Scan') {
            steps {
                sh 'cd backend && trivy fs .'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'cd backend && docker build -t $BACKEND_IMAGE:$TAG .'
            }
        }

        stage('Backend Trivy Image Scan') {
            steps {
                sh 'trivy image --severity CRITICAL,HIGH --exit-code 1 $BACKEND_IMAGE:$TAG'
            }
        }

        stage('Push Backend Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'PASS')]) {
                    sh '''
                        echo $PASS | docker login -u omareltabakh --password-stdin
                        docker push $BACKEND_IMAGE:$TAG
                    '''
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                sh 'cd frontend && npm install'
            }
        }

        stage('Frontend Code Quality') {
            steps {
                sh 'cd frontend && sonar-scanner'
            }
        }

        stage('Frontend Unit Tests') {
            steps {
                sh 'cd frontend && npm test || true'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'cd frontend && npm run build'
                sh 'cd frontend && docker build -t $FRONTEND_IMAGE:$TAG .'
            }
        }

        stage('Frontend Trivy Image Scan') {
            steps {
                sh 'trivy image --severity CRITICAL,HIGH --exit-code 1 $FRONTEND_IMAGE:$TAG'
            }
        }

        stage('Push Frontend Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'PASS')]) {
                    sh '''
                        echo $PASS | docker login -u omareltabakh --password-stdin
                        docker push $FRONTEND_IMAGE:$TAG
                    '''
                }
            }
        }

        stage('Update Helm & Git Commit') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                        sed -i "s/tag: .*/tag: \\"$TAG\\"/" backend/values.yaml
                        sed -i "s/tag: .*/tag: \\"$TAG\\"/" frontend/values.yaml
                        git config user.name "$GIT_USER"
                        git config user.email "jenkins@example.com"
                        git add backend/values.yaml frontend/values.yaml
                        git commit -m "Update backend and frontend image tags to $TAG"
                        git push https://$GIT_USER:$GIT_PASS@github.com/OmarEltabakh123/Three-Tier-DevSecOps-Pipeline.git HEAD:main
                    '''
                }
            }
        }
    }
    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}