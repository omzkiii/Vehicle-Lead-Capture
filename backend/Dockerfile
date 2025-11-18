FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npx prisma push db

EXPOSE 8000 8000

CMD [ "npm", "run", "dev" ]
