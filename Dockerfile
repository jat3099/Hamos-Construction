# Use a lightweight Nginx base image
FROM nginx:alpine

# Copy your entire project directory into the Nginx web root.
# The `.` refers to the current directory where the Dockerfile is located.
# `/usr/share/nginx/html` is the default directory where Nginx serves static files from.
COPY . /usr/share/nginx/html

# Expose port 80. This is the default port Nginx listens on for HTTP traffic.
# Cloud Run will route traffic to this port inside the container.
EXPOSE 80

# Nginx starts automatically when the container runs due to its base image's entrypoint.
# No explicit CMD instruction is needed here.