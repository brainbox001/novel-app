# novel-app
An app where authors and story writers can upload their stories for others to read.

**Setup**:

This application runs on a docker container. All dependency images like redis, mongodb, mongo-express can be seen in the [compose file](https://github.com/brainbox001/novel-app/blob/master/compose.yaml).
Fork the repo and clone it, open your cmd and navigate to the project, the run the "docker-compose up --build" (assuming you have docker installed on your system) to build the containers and get the application started.
Go through the [package.json](https://github.com/brainbox001/novel-app/blob/master/app/package.json) file to see the project dependencies(would be installed by docker during the build)
