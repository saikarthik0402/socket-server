FROM node:19-alpine3.15

ENV PORT=8082
EXPOSE 8082

RUN mkdir - p /home/socke
WORKDIR /home/student-enrollment-app
COPY . /home/student-enrollment-app

RUN npm install

CMD [ "npm", "start" ]

