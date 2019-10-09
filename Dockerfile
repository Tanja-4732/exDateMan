# Use an official Node runtime as a parent image
FROM node:10

# Copy the current directory contents into the container at /app
COPY ./frontend /app/frontend
COPY ./backend /app/backend

# Set the working directory to the frontend
WORKDIR /app/frontend

# Install any needed packages
RUN npm install

# Build the frontend
RUN /bin/sh -c "npm run build | true"

# Set the working directory to the backend
WORKDIR /app/backend

# Make port 80 available to the world outside this container
EXPOSE 80

# Make port 443 available to the world outside this container
EXPOSE 443

# Define SSL
ENV EDM_SSL true
ENV EDM_SSL_PK /etc/letsencrypt/live/EDM/privkey.pem
ENV EDM_SSL_CERT /etc/letsencrypt/live/EDM/cert.pem
ENV EDM_SSL_CA /etc/letsencrypt/live/EDM/fullchain.pem

# Define DB
ENV EDM_DB_HOST postgres-1
ENV EDM_DB_DB edm
ENV EDM_DB_USER edm
ENV EDM_DB_PORT 5432
ENV EDM_DB_PWD edm
ENV EDM_DB_SSL false
ENV EDM_DB_SCHEMA edm

# Define JWT
ENV EDM_JWT_PRIVATE_KEY /etc/letsencrypt/JWT/jwtRS256.key
ENV EDM_JWT_PUBLIC_KEY /etc/letsencrypt/JWT/jwtRS256.key.pub

# Run app.py when the container launches
CMD ["npm", "start"]
