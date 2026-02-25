# Fullstack App: Artist Searching Platform

Fullstack Artist Searching Platform — University of Southern California (USC), Los Angeles (Jan 2025 — May 2025).

**Summary:**
- **Project:**: Architected and developed a full-stack web platform for searching and exploring artists using the Artsy public API.
- **Stack:**: React + TypeScript (client), Node.js + Express (server), MongoDB (backend). Containerized with Docker and deployed to Google Cloud Platform (GCP).
- **Key features:**: Secure authentication with JWT and session management; protected routes; server-side caching and rate-limit handling (reduced latency by ~35%); deployed for scalability and high availability; mobile client rewritten in React Native with feature parity.

**Live Links:**
- **Assignment #2 Home Page:**: https://csci571-hw2-451506.uc.r.appspot.com/
- **Assignment #2 Cloud Service (example):**: https://csci571-hw2-451506.uc.r.appspot.com/search/picasso
- **Assignment #3 Home Page:**: https://csci571-hw3-456211.wl.r.appspot.com
- **Assignment #3 Cloud Service (example):**: https://csci571-hw3-456211.wl.r.appspot.com/api/search/picasso

**Features & Implementation Highlights:**
- **Authentication:**: JSON Web Tokens (JWT) with server-side session management and protected API routes.
- **Performance:**: Server-side caching layer to reduce repeated, rate-limited external API calls (measured latency improvement ~35%).
- **Deployment:**: Dockerized services and deployed to GCP for horizontal scalability and reliability.
- **Mobile:**: Rewrote the client with React Native, using the same server API endpoints to reach iOS and Android with feature parity.

**Files of interest:**
- **Client (web):**: `client/` — React + TypeScript app (components, pages, router, API utilities).
- **Server (web):**: `server/` — Node.js / Express backend, routes, controllers, middleware, and Dockerfile.
- **HW2:**: `hw2/` — older assignment code and demo Docker/service files.
- **HW3:**: `hw3/` — frontend and server work for assignment #3 and related configs.

**Local Development (quick start)**
- **Server:**
  - Install dependencies: `cd server && npm install`
  - Start server: `npm start` (or `npm run dev` if using nodemon)
- **Client:**
  - Install deps: `cd client && npm install`
  - Start dev server: `npm run dev` (Vite) or `npm start`
- **Docker (build & run):**
  - Build: `docker build -t artist-search-server ./server`
  - Run: `docker run -p 3000:3000 artist-search-server`

Note: Exact commands depend on which subproject or assignment snapshot you want to run (see the `server/`, `client/`, `hw2/`, and `hw3/` folders).

**Deployment Notes:**
- Services are containerized with Docker and designed to run on GCP (Cloud Run / App Engine / GKE). Use environment variables for secrets (JWT secret, MongoDB URI, API keys).

(MongoDB: use usc account browser)

**Contact / Attribution:**
- **Author:**: Lesley Yu — USC CSCI571 coursework (Jan 2025 — May 2025).
- **Repo:**: this repository contains assignment artifacts and the sample links above.
