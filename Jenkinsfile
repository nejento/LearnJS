pipeline {
  agent any
  stages {
    stage('Instalace knihoven') {
      steps {
        sh 'npm install'
      }
    }
    stage('Sestaven� aplikace') {
      steps {
        sh 'electron-packager . LearnJS --platform=win32 --icon=favicon.ico'
      }
    }
  }
}