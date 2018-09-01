FROM nginx:1.15
LABEL maintainer="tom@thepenzone.com"

# Copy nginx config file and app public dir to image.
COPY ./provisioning/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./public /application/public
