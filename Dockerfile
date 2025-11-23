# ------------------------------------------------------------------
# --- STAGE 1: BUILDER (Compiles the application) ---
# ------------------------------------------------------------------
FROM node:20-alpine as builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build 

# ------------------------------------------------------------------
# --- STAGE 2: FINAL (Serves the compiled output with Nginx) ---
# ------------------------------------------------------------------
FROM nginx:alpine

# 5. CRITICAL FIX A: Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 6. CRITICAL FIX B: Copy ONLY the compiled files from the 'builder' stage.
COPY --from=builder /app/dist /usr/share/nginx/html

# 7. Inform Cloud Run that the container listens on 8080
EXPOSE 8080

# 8. ADD THIS LINE: Explicitly forces Nginx to run and stay in the foreground.
CMD ["nginx", "-g", "daemon off;"]