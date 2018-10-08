FROM node:8.5.0 as webpack

WORKDIR /front

COPY . .

RUN npm run build

FROM nginx
COPY --from=webpack /front/dist /usr/share/nginx/html
