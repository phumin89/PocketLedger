FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY application/package.json application/package.json
COPY contracts/package.json contracts/package.json
COPY database/package.json database/package.json

RUN npm ci

COPY contracts contracts
COPY frontend frontend

WORKDIR /app/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
