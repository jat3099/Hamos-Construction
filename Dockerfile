# ------------------------------------------------------------------
# --- STAGE 1: BUILDER (Compiles the application) ---
# ------------------------------------------------------------------
# 1. Use a Node.js image to run your build tools (npm)
FROM node:20-alpine as builder
WORKDIR /app

# 2. Install dependencies (Node.js/Vite)
COPY package.json package-lock.json ./
RUN npm install

# 3. Run the build command (This creates the compiled files in /app/dist)
COPY . .
RUN npm run build 

# ------------------------------------------------------------------
# --- STAGE 2: FINAL (Serves the compiled output with Nginx) ---
# ------------------------------------------------------------------
# 4. Use the lightweight Nginx image for the final deployment
FROM nginx:alpine

# 5. CRITICAL FIX A: Copy your custom Nginx configuration file
# This sets the server to listen on port 8080 (the health check port).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 6. CRITICAL FIX B: Copy ONLY the compiled files from the 'builder' stage.
# We confirmed your Vite project uses the default output folder 'dist'.
# This makes sure Nginx has the final, ready-to-serve files.
COPY --from=builder /app/dist /usr/share/nginx/html

# 7. Inform Cloud Run that the container listens on 8080
EXPOSE 8080

# Nginx starts automatically