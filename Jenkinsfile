pipeline {
    agent any

    environment {
        GIT_USERNAME = credentials('git-credentials')  // Replace with your actual credential ID
        REPO_URL = 'https://github.com/SuryaHR/insurance-company-nextapp.git'
    }
    
    stages{
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
				sh 'export NVM_DIR="$HOME/.nvm"
				[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
				[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion'
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
