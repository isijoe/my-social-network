FROM node:alpine

WORKDIR /usr/src/app/frontend
COPY . .

RUN npm install --save react-scripts

EXPOSE 3000

CMD ["npm", "run", "build"]
# CMD ["npm", "start"]
