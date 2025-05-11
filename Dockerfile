FROM node:18.19.1
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn babel
EXPOSE 3000
CMD ["yarn", "start"]