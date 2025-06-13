# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and prisma schema before install
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (runs postinstall, including prisma generate)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the TypeScript project
RUN npm run build

# Copy the generated Prisma client (if needed manually)
RUN mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/

# Expose port
EXPOSE 3000

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]
