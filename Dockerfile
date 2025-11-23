# Use a lightweight Nginx base image to serve your static files.
FROM nginx:alpine

# Remove the default Nginx configuration.
# This is necessary so we can replace it with our custom configuration.
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom nginx.conf into the Nginx configuration directory.
# This file must exist in your project's root and configure Nginx to listen on 8080.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all your application files (index.html, index.css, index.tsx, etc.)
# into the Nginx web root directory.
COPY . /usr/share/nginx/html

# Inform Docker and Google Cloud Run that this container exposes port 8080.
EXPOSE 8080

# Nginx runs automatically when the container starts because of its base image's entrypoint.
# No additional CMD instruction is needed.