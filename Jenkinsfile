pipeline {
    agent any

    environment {
        GIT_USERNAME = credentials('git-credentials')  // Replace with your actual credential ID
        REPO_URL = 'https://github.com/SuryaHR/insurance-company-nextapp.git'
        NVM_DIR = "${WORKSPACE}/.nvm"
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
                withEnv(["NVM_DIR=$NVM_DIR"]) {
    			    script {
                        		sh 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash'
                        		sh "[ -s $NVM_DIR/nvm.sh ] && . $NVM_DIR/nvm.sh"
                        		sh 'nvm install 20'
                        		sh 'nvm use 20'
    				    	sh 'npm install'
    				    	sh 'npm run build'
    			    }
    		    }
    	    }
        }
    	
    	stage('Deploy') {
    		steps {
                	withEnv(["NVM_DIR=$NVM_DIR"]) {
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
}
