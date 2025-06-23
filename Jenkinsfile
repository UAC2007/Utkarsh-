pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'SonarScanner'
    }

    stages {
        stage('Clone Repo & Prepare Env') {
            steps {
                git url: 'https://github.com/Hamza844/flipkart-mern.git'

                withCredentials([
                    file(credentialsId: 'backend-env', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'frontend-env', variable: 'FRONTEND_ENV')
                ]) {
                    sh '''
                        echo "Injecting environment files..."
                        cp "$BACKEND_ENV" .env
                        cp "$FRONTEND_ENV" frontend/.env
                    '''
                }
            }
        }

        // Rest of your pipeline remains the same...
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('My Sonar') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            ${SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectKey=flipkart-mern \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://34.202.228.82:9000 \
                            -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs --exit-code 1 --severity HIGH,CRITICAL .'
            }
        }

        stage('Build & Tag Images') {
            steps {
                sh 'docker compose build'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up injected .env files...'
            sh 'rm -f .env frontend/.env'
        }
    }
}