pipeline {
  agent any

  environment {
    COMPOSE_HTTP_TIMEOUT = 200
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker Compose Config') {
      steps {
        sh 'docker compose config'
      }
    }

    stage('Build & Deploy') {
      steps {
        // optionally stop previous containers (keeps volumes)
        sh 'docker compose down || true'
        sh 'docker compose build --parallel --no-cache'
        sh 'docker compose up -d'
      }
    }

    stage('Wait for services') {
      steps {
        // sleep a bit for DB + API to come up
        sh 'sleep 12'
      }
    }

    stage('Health check API') {
      steps {
        retry(3) {
          sh '''
            set -e
            curl -fS http://localhost:5000/health || (echo "API not healthy yet"; exit 1)
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Deployment completed."
    }
    failure {
      echo "Deployment failed. Collecting logs..."
      sh 'docker compose logs --tail=200'
    }
  }
}
