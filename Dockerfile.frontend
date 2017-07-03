FROM binocarlos/yarn-base
MAINTAINER kaiyadavenport@gmail.com
WORKDIR /app/frontend
COPY ./frontend/package.json /app/frontend/package.json
COPY ./frontend/yarn.lock /app/frontend/yarn.lock
RUN yarn install
COPY ./frontend /app/frontend
ENTRYPOINT ["yarn", "run"]
CMD ["watch"]