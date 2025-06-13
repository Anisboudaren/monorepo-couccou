# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compile TypeScript
RUN npm run build

# ✅ Copy the generated Prisma client to the dist folder
RUN mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/

# Expose port (optional, in case you want to access it locally)
EXPOSE 3000

# Run Prisma migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]
