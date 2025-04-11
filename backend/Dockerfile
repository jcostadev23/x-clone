# Use node18
FROM node:18

# Create work directory
WORKDIR /server

# Copy files
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 4000

# Start aplication
CMD ["node", "server.js"]