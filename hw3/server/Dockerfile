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