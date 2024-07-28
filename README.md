# Shopper Cart

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Setup and Installation](#setup-and-installation)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)
7. [Communication](#communication)
8. [Data Consistency](#data-consistency)
9. [Security](#security)
10. [Observability](#observability)
11. [CI/CD Pipeline](#cicd-pipeline)
12. [Deployment](#deployment)
13. [Conclusion](#conclusion)

## Introduction

Shopper Cart is a scalable microservice-based system for a simple e-commerce application. It consists of the following services:

- **User Service**: Manages user accounts.
- **Auth Service**: Manages user's authentication and authorization.
- **Product Service**: Manages product creations and listings.
- **Order Service**: Manages orders and transactions.

## Architecture

The architecture of this application follows a microservices approach, allowing each service to be developed, deployed, and scaled independently. Communication between services is done using REST APIs and message queues.

![Component Diagram](diagrams/system_design_diagram.png)

For a detailed description of the system design, refer to the [System Design Document](system_design.md).

## Setup and Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v14.x or later)
- Docker
- Docker Compose
- MySQL

### Clone the Repository

```bash
git clone https://github.com/Gabrielonso/shopper-cart.git
cd shopper-cart
```

### Install Dependencies

```bash
$ npm install
```

## Environment Variables

```bash
APP_PORT=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_LOGGING=
DB_SYNCHRONIZATION=
JWT_ACCESS_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRATION=
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRATION=
NODE_ENV=

MAIL_HOST=
MAIL_USER=
MAIL_PASS=
MAIL_PORT=

SENDGRID_API_KEY=

RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=emails
RABBITMQ_QUEUE_DURABLE=true

```

## API Endpoints

- **Implemented**:

  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Authenticate a user and return a JWT
  - `GET /user/:id`: Retrieve a user details

- **Not Implemented**:

  - `GET /user`: Retrieve all users
  - `PATCH /user/:id`: Update a user details
  - `DELETE /user/:id`: Update a user details
  - `POST /product`: Create a new product
  - `GET /product/:id`: Retrieve product details
  - `PUT /product/:id`: Update product details
  - `DELETE /product/:id`: Delete a product
  - `POST /order`: Create a new order
  - `GET /order`: Retrieve all orders
  - `GET /order/user/:id`: Retrieve a user's order
  - `GET /order/:id`: Retrieve order details
  - `PUT /order/:id`: Update order status

## Testing

- **Auth Service**:

```bash
$ npx jest src/auth
```

- **User Service**:

```bash
$ npx jest src/user
```

## Communication

### Inter-Service Communication

- **REST**: Used for communication between client and services.
- **Message Queue**: RabbitMQ for asynchronous communication between services.

### External Communication

- **Email Service**: Integration with a third-party email service (SendGrid) for sending welcome emails.

## Data Consistency

- **Database Transactions**: Ensure ACID properties for critical operations.
- **Eventual Consistency**: For non-critical operations, eventual consistency is maintained using message queues and asynchronous processing.

## Security

- **Authentication**: JWT for user authentication.
- **Authorization**: Role-based access control (RBAC).
- **Data Encryption**: Encrypt sensitive data both in transit (using HTTPS) and at rest.
- **Input Validation**: Sanitize and validate all inputs to prevent SQL injection and other attacks.

## Observability

- **Logging**: Use Winston for structured logging.

## CI/CD Pipeline

- **CI/CD Tools**: GitHub Actions for automated testing, building, and deployment.
- **Pipeline Stages**:
  - **Build**: Compile and package the application.
  - **Test**: Run unit and integration tests.
  - **Deploy**: Deploy the application to a staging environment and then to production.

## Deployment

### Docker

- **Dockerfiles**: Each service has a Dockerfile for containerization.
- **Docker Compose**: Used for local development and testing.

## Conclusion

This document provides a comprehensive overview of the design for shopper cart. The architecture ensures high availability, scalability, and resilience, while also maintaining data consistency and security.
