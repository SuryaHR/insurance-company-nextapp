FROM node:20 as build

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

ENTRYPOINT ["npm","start"]

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
