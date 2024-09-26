# novel-app
An app where authors and story writers can upload their stories for others to read.

**Setup**:

This application runs on a docker container. All dependency images like redis, mongodb, mongo-express can be seen in the [compose file](https://github.com/brainbox001/novel-app/blob/master/compose.yaml).

Fork the repository and clone it, 

Open your cmd and navigate to the project folder, 

Run the **docker build -t 'image-name' .** command to build the app's image with its Dockerfile (all the app's dependencies should be installed during the build).

Once the build is complete, open a new cmd interface, navigate to the app directory of the project's root directory, and build the javascript files with the **npx tsc** command.

If the command throws an error, manually install typescript, run the **npm install typescript --save-dev** to install typescript as a development dependency, then rebuild the javascript files (assuming you have node installed on your system).

Run the **docker-compose up** command to get the application started. **The server is started at http://localhost:3001**.

Go through the [package.json](https://github.com/brainbox001/novel-app/blob/master/app/package.json) file to see the project dependencies(would be installed by docker during the build).

The application is built with typescript, so do well to go through the [ts-config file](https://github.com/brainbox001/novel-app/blob/master/app/tsconfig.json) also.

**Features**:

A user authentication system, the application has two users;

The unverified user - user details are stored in redis, to be deleted after 30 days. Uses a redis session.

The verfied user - details stored permamently to the database, uses the jwt session.

If you're testing the user routes(register, login, verify-email, logout), you must override the user-agent header with **novel-app/check**, this ensures a script can't be used to register or login user. The [userAgent](https://github.com/brainbox001/novel-app/blob/master/app/src/middlewares/user.ts) function enforces this.

User password is hashed before being stored in the database.

Once you've been registered, check you email for a verification code, use it to verify your email.

The [tokenCheck](https://github.com/brainbox001/novel-app/blob/master/app/src/middlewares/tokenCheck.ts) middleware checks for expired or invalid tokens and revoke such requests.

View all the routes assiocated with users - [userRoutes](https://github.com/brainbox001/novel-app/blob/master/app/src/routers/userRoute.ts).

The [novel middleware](https://github.com/brainbox001/novel-app/blob/master/app/src/middlewares/novel.ts#L9) has the isAuthenticated functionality that allows only authenticated users to upload novels. It also checks against blacklisted tokens(once a user logs out, his/her token is automatically blacklisted) and revoke requests with such tokens.
