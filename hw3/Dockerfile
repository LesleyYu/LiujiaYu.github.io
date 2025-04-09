# Stage 1: Build the React client using Node 18
FROM node:18 AS client-build
WORKDIR /app/client
# Install client dependencies
COPY client/package*.json ./
RUN npm install
# Copy client source code and build it
COPY client .
RUN npm run build
# The Vite build will output to the "dist" folder

# Stage 2: Set up the Node.js/Express server
FROM node:18 AS server
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy the server source code
COPY server ./server

# Copy the built static files from the client build into the server's public folder.
# (We expect our Express code to serve from "server/public".)
COPY --from=client-build /app/client/dist ./server/public

# Expose the port Cloud Run expects (the PORT environment variable defaults to 8080)
EXPOSE 8080

# Start the Express app
CMD ["node", "server/app.js"]