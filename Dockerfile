# Use a lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install backend dependencies first for better layer caching
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy the entire app (frontend + backend)
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "backend/server.js"]