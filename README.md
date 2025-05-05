# ShortLink

## Table of Contents

- [ShortLink](#shortlink)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Getting Started](#running-the-app)
    - [Prerequisites](#prerequisites)
    - [Quick Start](#quick-start)
  - [Running Tests](#running-tests)
  - [Folder Structure](#folder-structure)
  - [Documentation](#documentation)
  - [Thoughts](#thoughts)

## Project Overview

You are required to build a URL shortener website. In addition to the web interface, the solution should expose APIs for users who wish to integrate programmatically.

## Features

- Create short URLs for long links
- Redirect short URLs to their original destinations
- Display and manage recently shortened links
- Responsive UI with dark/light theme support
- Input validation and centralized error handling
- Logging and monitoring with configurable levels

## Technologies

- **Frontend:** ReactJs, Vite, TypeScript, Tailwind CSS, Sonner
- **Backend:** NodeJs, ExpressJs, TypeScript, Zod, Tsyringe, Winston
- **Testing & Quality:** Jest, SuperTest, ESLint, Prettier

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**
- **npm**
- **Docker Daemon**

### Quick Start

You can run the application using Docker or set it up locally. Choose one of the following methods:

#### Using Docker

1. **Clone the Repository**

   ```bash
   git clone https://github.com/LoganXav/IndicinaTask.git
   cd IndicinaTask
   ```

2. **Run the Application**

   - **Backend**:

     ```bash
     cd backend
     npm run docker:up:silent
     ```

   - **Frontend**:

     ```bash
     cd ../frontend
     npm run docker:up:silent
     ```

   The backend API will be available at `http://localhost:5500/api` and the frontend at `http://localhost:5173`.

#### Local Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/LoganXav/IndicinaTask.git
   cd IndicinaTask
   ```

2. **Install Dependencies**

   - **Backend**:

     ```bash
     cd backend
     npm install
     npm run dev
     ```

   - **Frontend**:

     ```bash
     cd ../frontend
     npm install
     npm run dev
     ```

   Access the backend API at `http://localhost:5500/api` and the frontend at `http://localhost:5173`.

This streamlined approach allows users to quickly get started with either Docker or a local setup, depending on their preference.

### Running Tests

To ensure the backend is functioning correctly, you can run the tests using the following commands:

1. **Run Tests**

   Navigate to the backend directory and execute:

   ```bash
   cd backend
   npm test
   ```

2. **Run Test Coverage**

   To generate a test coverage report, run:

   ```bash
   npm run test:coverage
   ```

   This will provide a detailed report of the test coverage for the backend code.

## Folder Structure

```
shortlink/
├─ backend/
├─ frontend/
└─ README.md
```

## Documentation

- **Backend API Reference:** [backend/README.md](backend/README.md)
- **Frontend Guide:** [frontend/README.md](frontend/README.md)

## Thoughts

In a production environment, URL expiration should be significantly longer than the current 1-minute setting. The hypothetical implementation is to demonstrate the technical aspects of URL expiration handling, cache invalidation, and cleanup processes.
