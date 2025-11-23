# Use a lightweight Nginx base image
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom nginx.conf into the Nginx configuration directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your entire project directory into the Nginx web root.
# The `.` refers to the current directory where the Dockerfile is located.
# `/usr/share/nginx/html` is the default directory where Nginx serves static files from.
COPY . /usr/share/nginx/html

# Expose port 8080. This tells Docker and Cloud Run that the container
# expects traffic on this port.
EXPOSE 8080

# Nginx starts automatically when the container runs due to its base image's entrypoint.
# No explicit CMD instruction is needed here.