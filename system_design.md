# System Design Document

## 1. Introduction

This document outlines the design of shopper cart, a scalable microservice-based system for a simple e-commerce application. It includes architectural diagrams, descriptions of each microservice, and details on communication, data consistency, fault tolerance, and scaling.

## 2. Architecture Overview

### 2.1 Architecture Diagram

![Component Diagram](diagrams/system_design_diagram.png)

### 2.2 Microservices

The system consists of the following microservices:

- **User Service**: Manages user accounts.
- **Auth Service**: Manages user's authentication and authorization.
- **Product Service**: Manages product creations and listings.
- **Order Service**: Manages orders and transactions.

## 3. Component Descriptions

### 3.1 Auth Service

- **Responsibilities**:

  - User registration
  - User authentication (login)

- **Endpoints**:

  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Authenticate a user and return a JWT

- **Database**: MySQL (storing user data)

- **Security**: JWT-based authentication and authorization

### 3.2 User Service

- **Responsibilities**:

  - Users account mamagement
  - Retrieving user details

- **Endpoints**:

  - `GET /user`: Retrieve all users
  - `GET /user/:id`: Retrieve a user details
  - `PATCH /user/:id`: Update a user details
  - `DELETE /user/:id`: Update a user details

- **Database**: MySQL (storing user data)

### 3.3 Product Service

- **Responsibilities**:

  - Managing product listings (CRUD operations)
  - Searching products

- **Endpoints**:

  - `POST /product`: Create a new product
  - `GET /product/:id`: Retrieve product details
  - `PUT /product/:id`: Update product details
  - `DELETE /product/:id`: Delete a product

- **Database**: MySQL (storing product data)

### 3.4 Order Service

- **Responsibilities**:

  - Managing user's orders and transactions
  - Tracking order status

- **Endpoints**:

  - `POST /order`: Create a new order
  - `GET /order`: Retrieve all orders
  - `GET /order/user/:id`: Retrieve a user's order
  - `GET /order/:id`: Retrieve order details
  - `PUT /order/:id`: Update order status

- **Database**: MySQL (storing order data)

## 4. Communication

### 4.1 Inter-Service Communication

- **REST**: Used for communication between client and services.
- **Message Queue**: RabbitMQ for asynchronous communication between services.

### 4.2 External Communication

- **Email Service**: Integration with a third-party email service (SendGrid) for sending welcome emails.

## 5. Data Consistency

- **Database Transactions**: Ensure ACID properties for critical operations.
- **Eventual Consistency**: For non-critical operations, eventual consistency is maintained using message queues and asynchronous processing.

## 6. Security

- **Authentication**: JWT for user authentication.
- **Authorization**: Role-based access control (RBAC).
- **Data Encryption**: Encrypt sensitive data both in transit (using HTTPS) and at rest.
- **Input Validation**: Sanitize and validate all inputs to prevent SQL injection and other attacks.

## 7. Observability

- **Logging**: Use Winston for structured logging.

## 8. CI/CD Pipeline

- **CI/CD Tools**: GitHub Actions for automated testing, building, and deployment.
- **Pipeline Stages**:
  - **Build**: Compile and package the application.
  - **Test**: Run unit and integration tests.
  - **Deploy**: Deploy the application to a staging environment and then to production.

## 9. Deployment

### 9.1 Docker

- **Dockerfiles**: Each service has a Dockerfile for containerization.
- **Docker Compose**: Used for local development and testing.

## 10. Conclusion

This document provides a comprehensive overview of the design for shopper cart. The architecture ensures high availability, scalability, and resilience, while also maintaining data consistency and security.
