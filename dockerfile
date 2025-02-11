# Use an official Node.js runtime as the base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx image to serve the built files
FROM nginx:alpine

# Copy the built React app to Nginx's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to allow traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
