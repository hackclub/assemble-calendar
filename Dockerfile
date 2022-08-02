FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json ./yarn.lock /usr/src/app/
RUN yarn install && yarn cache clean
COPY ./ /usr/src/app
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
RUN npm run build
CMD [ "node", "./dist/index.js" ]