pipeline {
  agent any

  triggers {
    pollSCM('H/2 * * * *')
  }

  environment {
    COMPOSE_HTTP_TIMEOUT = 200
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Prepare .env') {
      steps {
        sh '''
          set -e
          if [ ! -f .env ]; then
            cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-rootpassword123}
MYSQL_DATABASE=${MYSQL_DATABASE:-personal_task_db}
MYSQL_USER=${MYSQL_USER:-u6703466}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-6703466}
DB_HOST=${DB_HOST:-mysql}
DB_USER=${DB_USER:-u6703466}
DB_PASSWORD=${DB_PASSWORD:-6703466}
DB_NAME=${DB_NAME:-personal_task_db}
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:5000}
JWT_SECRET=${JWT_SECRET:-default_secret_key}
EOF
            echo ".env created"
          else
            echo ".env already present"
          fi
        '''
      }
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
