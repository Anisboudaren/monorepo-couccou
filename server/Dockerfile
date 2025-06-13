# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy all project files first (you need prisma/schema.prisma *before* npm install)
COPY . .

# Now install dependencies safely
RUN npm install

# Optional: generate prisma client (can also be done inside start CMD)
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build TypeScript
RUN npm run build

# Expose port if needed
EXPOSE 3000

# Start the server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]
