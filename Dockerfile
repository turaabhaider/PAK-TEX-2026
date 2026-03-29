FROM node:22.12.0

WORKDIR /app

# 1. Copy everything to the container
COPY . .

# 2. Install dependencies and build the React app
RUN cd frontend && npm install && npm run build

# 3. Install a simple server to host the static files
RUN npm install -g serve

# 4. Railway uses the PORT variable automatically
EXPOSE 3000

# 5. Serve the 'dist' folder created by Vite
CMD ["serve", "-s", "frontend/dist", "-l", "3000"]