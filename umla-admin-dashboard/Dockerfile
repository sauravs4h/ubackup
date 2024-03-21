# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json /app/


# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# # Build the React app
# RUN npm run build

# # Use a lightweight Node.js runtime as the final base image
# FROM node:latest

# # Set the working directory in the container
# WORKDIR /app

# # Copy the built app from the builder stage to the final image
# COPY --from=builder /app/build ./build

# Expose the port that the app will run on
# EXPOSE 3050

# Define the command to run your app
CMD ["npm","start"]
