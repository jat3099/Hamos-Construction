# ----------------------------------------------------
# --- STAGE 1: The BUILDER Stage (Compiles the Code) ---
# ----------------------------------------------------
FROM node:20-alpine as builder
WORKDIR /app

# 1. Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 2. Run the build command
# This creates the final, ready-to-serve files in an output folder (like /app/dist)
COPY . .
RUN npm run build 

# ----------------------------------------------------
# --- STAGE 2: The FINAL Stage (Serves with Nginx) ---
# ----------------------------------------------------
FROM nginx:alpine

# CRITICAL A: Copy your custom Nginx configuration file
# This is where your 'listen 0.0.0.0:8080' fix should be applied.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# CRITICAL B: Copy ONLY the compiled assets from the 'builder' stage
# The source path must be the exact output folder of 'npm run build' (e.g., /app/dist)
# The destination must match the 'root' directive in your nginx.conf.
COPY --from=builder /app/dist /usr/share/nginx/html

# Inform Cloud Run that the container listens on 8080
EXPOSE 8080