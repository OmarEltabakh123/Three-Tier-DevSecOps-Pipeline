pipeline {
  agent any

  environment {
    IMAGE = 'omareltabakh/backend-app'
    TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/omareltabakh/three-tier-app.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'cd backend && npm install'
      }
    }

    stage('Code Quality') {
      steps {
        sh 'cd backend && sonar-scanner'
      }
    }

    stage('Trivy File Scan') {
      steps {
        sh 'cd backend && trivy fs .'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'cd backend && docker build -t $IMAGE:$TAG .'
      }
    }

    stage('Trivy Image Scan') {
      steps {
        sh 'trivy image $IMAGE:$TAG'
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'PASS')]) {
          sh '''
            echo $PASS | docker login -u omareltabakh --password-stdin
            docker push $IMAGE:$TAG
          '''
        }
      }
    }

    stage('Update Helm & Git Commit') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
          sh '''
            sed -i "s/tag: .*/tag: \\"$TAG\\"/" backend/values.yaml
            git config user.name "$GIT_USER"
            git config user.email "jenkins@example.com"
            git add backend/values.yaml
            git commit -m "Update backend image tag to $TAG"
            git push https://$GIT_USER:$GIT_PASS@github.com/omareltabakh/three-tier-app.git HEAD:main
          '''
        }
      }
    }
  }
}
