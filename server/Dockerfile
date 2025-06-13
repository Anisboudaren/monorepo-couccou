# Use the Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Generate Prisma client (if not already generated)
RUN npx prisma generate

# Build TypeScript and copy generated
RUN npm run build && cp -r src/generated dist/generated

# Expose port (optional, e.g. 3000)
EXPOSE 3000

# Start the server with Prisma migration
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node ./dist/server.js"]
