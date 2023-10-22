# Use an official Node.js runtime as a parent image
FROM node:14

# Set work directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

