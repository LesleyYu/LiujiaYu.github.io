# Hi

Welcome to my Artsy App.

# Deployed Address

https://csci571-hw3-456211.wl.r.appspot.com/

Example address for api testing

https://csci571-hw3-456211.wl.r.appspot.com/api/search/picasso

# How to run

## Locally

### Server

Built in Node.js express. To run locally, open terminal to `server` directory, and run:

```
DEBUG=server:* npm start
```

### Client

Built in React framework.

```
npm run dev
```



## Deployment

### Build static front-end files

Step 1. In /client, run `npm run dev`. 

Step 2. Then copy /client/dist to /server, rename `dist` to `static`

### Deploy on back-end server

`Dockerfile` in /server directory

```
##### Use an official Node.js image with a current, supported version (e.g., Node 24)
FROM node:23-alpine

##### Set working directory
WORKDIR /app

##### Copy package.json and package-lock.json (if you have one)
COPY package*.json ./

##### Install dependencies (you might want to do a production install)
RUN npm install --production

##### Copy the rest of your application code
COPY . .

##### Expose the port that your app listens on (adjust if necessary)
EXPOSE 8080

##### Start the application (this command should match what your package.json "start" script does)
CMD ["npm", "start"]
```

start google cloud by `gcloud init`, then direct to /server, run`gcloud app deploy`.

