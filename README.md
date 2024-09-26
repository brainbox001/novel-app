# novel-app
An app where authors and story writers can upload their stories for others to read.

**Setup**:

This application runs on a docker container. All dependency images like redis, mongodb, mongo-express can be seen in the [compose file](https://github.com/brainbox001/novel-app/blob/master/compose.yaml).

Fork the repo and clone it, open your cmd and navigate to the project folder, then run the "docker-compose up --build" command (assuming you have docker installed on your system) to build the containers and get the application started.

If the "docker-compose up --build" command doesn't work at first, build the app's Dockerfile with "docker build -t 'image-name' ." command, once the build is complete, run the "docker-compose up" command to get the application started. **The server is started at http://localhost:3001**.

Go through the [package.json](https://github.com/brainbox001/novel-app/blob/master/app/package.json) file to see the project dependencies(would be installed by docker during the build).

The application is built with typescript, so do well to go through the [ts-config file](https://github.com/brainbox001/novel-app/blob/master/app/tsconfig.json).


