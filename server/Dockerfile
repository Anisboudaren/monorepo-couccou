FROM node:18

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client into src/generated/prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build TypeScript
RUN npm run build

# Manually copy the generated Prisma client to match import paths in dist
RUN mkdir -p dist/generated/prisma && cp -r src/generated/prisma/* dist/generated/prisma/

# Optional: list files for debugging
# RUN ls -R dist

# Expose your app port
EXPOSE 3000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]
