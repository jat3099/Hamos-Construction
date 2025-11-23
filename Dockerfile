# --- STAGE 1: Build the frontend assets using the Node.js image ---
FROM node:20-alpine as builder
WORKDIR /app

# Install dependencies (only copy package files to optimize caching)
COPY package.json package-lock.json ./
RUN npm install --production=false

# Copy source code and run the build script
# NOTE: 'npm run build' must output the final static files to a folder (e.g., 'dist')
COPY . .
RUN npm run build 

# --- STAGE 2: Final Nginx image to serve the compiled assets ---
FROM nginx:alpine

# CRITICAL FIX A: Ensure Nginx uses the correct port config
# Your custom config must listen on 0.0.0.0:8080 (as corrected previously)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# CRITICAL FIX B: Copy ONLY the final compiled assets from the builder stage
# Verify 'dist' matches your 'npm run build' output folder!
# Verify '/usr/share/nginx/html' matches the 'root' in your nginx.conf!
COPY --from=builder /app/dist /usr/share/nginx/html

# Inform Cloud Run that the container listens on 8080
EXPOSE 8080

# Nginx starts automatically (default CMD)