FROM node:latest
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["/bin/bash","entrypoint.sh"]