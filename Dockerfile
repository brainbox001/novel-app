FROM node:22-alpine3.19

# Set the working directory in the container
COPY ./app /app
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN apk  add --update --no-cache nano && \
    npm install

# Expose the port that the app runs on
EXPOSE 3001

# Define the command to run the app
CMD [ "npm", "dev" ]
