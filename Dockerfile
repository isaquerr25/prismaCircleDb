FROM node:16.3.0

WORKDIR /usr/app
ARG PORT
COPY ./package.json  ./
COPY ./yarn.lock ./

COPY . .
COPY ./.env ./.env

# RUN yarn

EXPOSE ${DOOR}
# Running the app

CMD [ "yarn", "start" ]