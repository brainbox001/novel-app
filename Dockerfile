FROM node:22-alpine3.19

# Set the working directory in the container
COPY ./app /app
WORKDIR /app


# Install dependencies
# RUN apk  add --update --no-cache nano 
RUN npm install
RUN npx tsc

# Expose the port that the app runs on
EXPOSE 3001

# Define the command to run the app
CMD [ "npm", start" ]
