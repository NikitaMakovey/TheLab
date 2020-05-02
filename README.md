# TheLab

Для билда проекта выполнить следующую команду в папке app 

` docker build -t vuejs-cookbook/dockerize-vuejs-app . `

Для запуска контейнера выполнить следующую команду в папке app

` docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app `

Проект будет расположен на ` localhost:8080 `
