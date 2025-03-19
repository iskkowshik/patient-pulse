
FROM node:18-alpine
WORKDIR /PatientsPulse
COPY package*.json ./
RUN npm install
COPY nodejs .
EXPOSE 3000
CMD ["node", "index.js"]                               
