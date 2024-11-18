FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV API_URL=http://localhost:8000
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]


# FROM nginx:latest
# COPY --from=builder /app/public /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]