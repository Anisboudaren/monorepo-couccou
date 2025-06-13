# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Generate Prisma client (make sure `prisma.schema` is copied already)
RUN npx prisma generate

# Build TypeScript
RUN npx tsc

# Copy generated files (if you manually generate and use them)
RUN cp -r src/generated dist/generated || true

# Expose port if needed (e.g., 3000)
EXPOSE 3000

# Start the app (and apply Prisma migrations)
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]
