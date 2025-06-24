pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'SonarScanner'
        DOCKER_IMAGE = 'flipkart-mern'
        DOCKER_REGISTRY = 'your-docker-registry' // Replace with your registry URL
    }

    stages {
        stage('Git Checkout') {
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
                sh 'trivy fs .'
            }
        }

        stage('Docker Build Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                }
            }
        }

        stage('Trivy Scan Image') {
            steps {
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${env.BUILD_ID}"
            }
        }

        stage('Docker Tag Image & Push Image') {
            steps {
                script {
                    docker.withRegistry('https://${DOCKER_REGISTRY}', 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE}:${env.BUILD_ID}").push()
                        docker.image("${DOCKER_IMAGE}:${env.BUILD_ID}").push('latest')
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // Example: Verify by checking running containers or making HTTP requests
                    sh "docker ps | grep ${DOCKER_IMAGE}"
                    // Or use curl to verify endpoint
                    // sh 'curl -sSf http://your-deployment-url/health'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up injected .env files...'
            sh 'rm -f .env frontend/.env'
            
            // Clean up Docker images to save disk space
            sh "docker rmi ${DOCKER_IMAGE}:${env.BUILD_ID} || true"
        }
    }
}