pipeline {
    agent any

    environment {
        GIT_USERNAME = credentials('credential-git')  // Replace with your actual credential ID
        REPO_URL = 'https://github.com/SuryaHR/insurance-company-nextapp.git'
    }

    tools {
        nodejs 'Nodejs20'  // Use the name you provided in the NodeJS configuration
    }
    
    stages{
    	stage('Clone Repository') {
    		steps {
    			script {
    				checkout([$class: 'GitSCM', branches: [[name: '*/devops']], userRemoteConfigs: [[url: REPO_URL, credentialsId: 'credential-git']]])
    			}
    		}
    	}

		stage('Content Replacement') {
            steps {
                script {
                    // Execute content replacements using the provided configuration
                    contentReplace(configs: [
                        fileContentReplaceConfig(
                            configs: [
                                fileContentReplaceItemConfig(
                                    search: 'INSURANCE_CARRIER',
                                    replace: '"The-Next-Insurance-Company"',
                                    matchCount: 1,
                                    verbose: false
                                ),
                                fileContentReplaceItemConfig(
                                    search: 'SERVER_ADDRESS_KEY',
                                    replace: '"http://173.255.198.245:8080"',
                                    matchCount: 1,
                                    verbose: false
                                ),
                                fileContentReplaceItemConfig(
                                    search: 'XORIGINATOR_KEY',
                                    replace: '"http://173.255.198.245:8080/next"',
                                    matchCount: 1,
                                    verbose: false
                                )
                            ],
                            fileEncoding: 'UTF-8',
                            lineSeparator: 'Unix',
                            filePath: '.env.production'
                        )
                    ])
                }
            }
        }
    	
    	stage('Build') {
    		steps {
    			script {
    				sh 'npm install'
                    sh 'npm install -g pm2'
    				sh 'npm run build'
    			}
    	    }
        }
    	
    	stage('Deploy') {
    		steps {
    			script {
    				sh 'npm install -g pm2'
    				sh 'npm run build'
    				sh 'pm2 start npm -- start'
    				sh 'pm2 status'
                }
    		}
    	}
    }
}
