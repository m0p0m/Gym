# Deployment and Production Notes

This document provides information on the production-ready features of this application and how to build and run it using Docker.

## Security

Several middlewares have been implemented to secure the application:

-   **Helmet**: Sets various security-related HTTP headers to protect against common vulnerabilities like clickjacking, XSS, etc.
-   **express-mongo-sanitize**: Sanitizes incoming request data to prevent NoSQL query injection attacks.
-   **CORS**: Cross-Origin Resource Sharing is enabled to allow requests from different origins. This should be configured with a specific whitelist of domains in a production environment.
-   **Rate Limiting**: The authentication routes (`/send-otp`, `/verify-otp`) are protected against brute-force attacks. The limiter is set to 20 requests per 15 minutes per IP.
-   **API Key Authentication**: The machine-to-machine endpoints (e.g., `/attendance/check-in`) are protected by a static API key that must be sent in the `x-api-key` header.

## Logging

The application uses a robust logging system:

-   **Winston**: Used for application-level logging (errors, info, debug messages).
-   **Morgan**: Used for logging all incoming HTTP requests. Morgan's output is piped into Winston for a unified logging stream.

In a production environment, you should configure Winston transports to write logs to files or a log management service.

## Running with Docker

The application is containerized for easy and consistent deployment.

### Prerequisites
- Docker installed on your machine.

### Building the Image

To build the Docker image, run the following command from the root of the project:

```bash
docker build -t gym-management-backend .
```

### Running the Container

To run the application inside a Docker container, use the following command. This will map port 3000 on your host to port 3000 in the container.

```bash
docker run -p 3000:3000 -d --name gym-backend gym-management-backend
```

You will also need to provide environment variables to the container, for example, by using a `.env` file and the `--env-file` flag:

```bash
docker run -p 3000:3000 -d --name gym-backend --env-file ./.env gym-management-backend
```

The application will then be accessible at `http://localhost:3000`.
