# Use an official Node runtime as a parent image
FROM node:11.15 AS builder

# Copy the current directory contents into the container at /app
COPY ./frontend /app/frontend
COPY ./backend /app/backend

# Compile the frontend
WORKDIR /app/frontend
RUN ["npm", "i"]
RUN ["npm", "run", "build"]

# Compile the backend
WORKDIR /app/backend
RUN ["npm", "i"]
RUN ["npm", "run", "build"]

# Switch to the final stage of the build
FROM node:11.15

# Copy the compiled frontend to the final stage
COPY --from=builder /app/frontend/dist /app/frontend/dist

# Copy the fompiled backend to the final stage
COPY --from=builder /app/backend/dist /app/backend/dist
COPY --from=builder /app/backend/node_modules /app/backend/node_modules

# Make both the HTTP and HTTPS ports available
EXPOSE 80
EXPOSE 443

# Prepare the JWT key pair
VOLUME [ "/app/jwt" ]

# Don't use SSL
ENV EDM_SSL false

# Define the DB connection
ENV EDM_DB_HOST postgres-1
ENV EDM_DB_DB edm
ENV EDM_DB_USER edm
ENV EDM_DB_PORT 5432
ENV EDM_DB_PWD edm
ENV EDM_DB_SSL false
ENV EDM_DB_SCHEMA edm

# Define JWT
ENV EDM_JWT_PRIVATE_KEY /app/jwt/jwtRS256.key
ENV EDM_JWT_PUBLIC_KEY /app/jwt/jwtRS256.key.pub

# Configure the container start
WORKDIR /app/backend/dist
CMD ["node", "."]
