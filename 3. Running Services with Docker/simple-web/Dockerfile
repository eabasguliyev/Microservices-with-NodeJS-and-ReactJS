# Specify a base image
# FROM alpine
FROM node:lts-alpine3.16

# Specifying a Working Directory
WORKDIR /usr/app

# Install some dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Set default command
CMD ["npm", "start"]