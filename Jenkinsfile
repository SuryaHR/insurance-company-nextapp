pipeline {
    agent any

    environment {
        GIT_USERNAME = credentials('git-credentials')  // Replace with your actual credential ID
        REPO_URL = 'https://github.com/SuryaHR/insurance-company-nextapp.git'
        NODE_VERSION = '18.0.0'
        NODE_HOME = "${WORKSPACE}/node-${NODE_VERSION}"
        PATH = "${NODE_HOME}/bin:${PATH}"
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: '*/devops']], userRemoteConfigs: [[url: REPO_URL, credentialsId: 'git-credentials']]])
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Install Node.js and npm packages
                    sh "curl -sL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz | tar -xz -C ${WORKSPACE}"
                    sh "ln -s ${NODE_HOME}/bin/node /usr/local/bin/node"
                    sh "ln -s ${NODE_HOME}/bin/npm /usr/local/bin/npm"
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Install pm2 and run as a daemon process
                    sh 'npm install -g pm2'
                    sh 'pm2 start npm --name "insurance-company-nextapp" -- start'
                    sh 'pm2 status'
                }
            }
        }
    }
}
