pipeline {
    agent any

    environment {
        GIT_USERNAME = credentials('credential-git')  // Replace with your actual credential ID
        REPO_URL = 'https://github.com/SuryaHR/insurance-company-nextapp.git'
    }
    
    stages{
    	stage('Clone Repository') {
    		steps {
    			script {
    				checkout([$class: 'GitSCM', branches: [[name: '*/devops']], userRemoteConfigs: [[url: REPO_URL, credentialsId: 'credential-git']]])
    			}
    		}
    	}
    	
    	stage('Build') {
    		steps {
    			script {
                    sh 'nvm use 20'
    				sh 'npm install'
    				sh 'npm run build'
    			}
    		}
    	}
    	
    	stage('Deploy') {
    		steps {
    			script {
    				sh 'npm install -g pm2'
    				sh 'npm run build'
    				sh 'pm2 start npm --name "insurance-company-nextapp" -- start'
    				sh 'pm2 status'
    			}
    		}
    	}
    }
}
