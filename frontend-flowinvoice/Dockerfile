# Dockerfile para el frontend (React + Vite)

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
