To run this app in production using Docker and Docker Compose:
* Copy `.env.example` to `.env` and fill in the variables.
* Run `docker-compose up -d`
* Navigate to `http://localhost:3000`

To develop this app using Docker, Docker Compose, and VS Code:
* Open the project folder in VS Code.
* Make sure you have the Remote Development extension installed.
* Copy `.env.example` to `.env` and fill in the variables.
* Press F1 and type "Reopen in container"
* VS Code will reopen and set everything up for you (`npm install` and `npn run build-dev`)
* Use the debugger to start the Server
* Use the debugger to start the Client
