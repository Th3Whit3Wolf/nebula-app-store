# add the Node.js docker image
FROM node:16

# Create directory that runs the app on docker
WORKDIR /app

# COPY package.json and package-lock.json files
COPY package.json pnpm-lock.yaml ./

# COPY
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# Install package.json dependencies
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile

# COPY
COPY . .

# Generate prisma client
RUN pnpm run db:generate

# Run and expose the server on port 3000
EXPOSE 3010

# A command to start the server
CMD pnpm run dev