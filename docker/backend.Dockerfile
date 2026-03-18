FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY application/package.json application/package.json
COPY contracts/package.json contracts/package.json
COPY database/package.json database/package.json

RUN npm ci

COPY backend backend
COPY application application
COPY contracts contracts
COPY database database

WORKDIR /app/backend

EXPOSE 3000

CMD ["npm", "run", "dev"]
