To run from Docker Hub using Docker and Docker Compose:
* Copy `example/docker-compose.yml` to you machine and fill in the ENV variables.
* Run `docker-compose up -d`
* Navigate to `http://localhost:3000`

To run from source code using Docker and Docker Compose:
* Clone this repo from GitHub
* Copy `.env.example` to `.env` and fill in the variables.
* Run `docker-compose up -d`
* Navigate to `http://localhost:3000`

To develop this app using Docker, Docker Compose, and VS Code:
* Clone this repo from GitHub
* Open the project folder in VS Code.
* Make sure you have the Remote Development extension installed.
* Copy `.env.example` to `.env` and fill in the variables.
* Press F1 and type "Reopen in container"
* VS Code will reopen and set everything up for you automatically (`npm install` and `npn run build-dev`)
* Use the debugger to start the Server
* Use the debugger to start the Client
