# Use a Node.js base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies using npm ci (for production)
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Start the Node.js application
CMD [ "npm", "start" ]
