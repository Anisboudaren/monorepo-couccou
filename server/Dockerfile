# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy only package files first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies like typescript)
RUN npm install

# Copy Prisma schema first so it can generate client
COPY prisma ./prisma/

# Run Prisma generate (before build)
RUN npx prisma generate

# Now copy the full project source code
COPY . .

# Build the TypeScript project
RUN npm run build

# (Optional) Copy manually generated files if needed
RUN mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/ || echo "Skip prisma copy"

# Expose port
EXPOSE 3000

# Run DB migration and start the app
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]
