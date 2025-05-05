# ShortLink Backend

This is the Node.js + Express backend API service powering the **ShortLink** URL shortening application. It handles URL encoding, decoding, redirection, and statistics, and provides health checks and logging.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Engineering Approach](#engineering-approach)
- [Testing](#testing)
- [Folder Structure](#folder-structure)

## Project Overview

The ShortLink service provides a robust URL shortening solution with the following core functionalities:

- URL shortening with configurable length and expiration
- Secure redirection handling
- Click tracking and statistics
- Health monitoring
- Comprehensive error handling and logging

## Technologies

- **Runtime:** Node.js v18+
- **Framework:** Express 5
- **Language:** TypeScript
- **Validation:** Zod
- **Dependency Injection:** tsyringe
- **Logging:** Winston
- **Utilities:** fast-glob, dotenv, helmet, cors
- **Testing:** Jest, SuperTest

## Running the App

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file (see Environment Variables section)
4. Run the server: `npm start`
5. For development: `npm run dev`

## Engineering Approach

### Data Validation

The API implements strict validation using Zod schemas:

1. URL Encoding:

   - Valid URL format required
   - Cannot shorten already shortened URLs
   - URL must be non-empty

2. URL Decoding:

   - Valid short URL required
   - Must match base URL pattern

3. Statistics/Redirect:
   - Path must match configured length
   - Must contain only alphanumeric characters

### Error Handling

All errors are processed through a centralized error handler that:

- Logs errors with appropriate severity
- Returns consistent error responses
- Handles validation failures
- Manages unexpected errors

Error Response Format:

```json
{
  "status": "error",
  "statusCode": 400 | 404 | 500,
  "data": {
    "message": "Descriptive error message",
    "data": null | { validationErrors }
  }
}
```

### Dependency Injection

The application uses tsyringe for dependency injection to:

- Improve testability
- Manage service lifecycles
- Decouple components
- Enable easy mocking in tests

## API Reference

All endpoints are prefixed by the `SERVER_ROOT` (default `/api`), except the redirect.

### Health Check

```
GET /ping
Content-Type: text/plain

Response: 200 OK
INDICINA URL SHORTENER api service is online at 2024-03-05T12:34:56.789Z
```

### Encode URL

```
POST /api/encode
Content-Type: application/json

Request Body:
{
  "url": "https://example.com/long/path"
}

Response:
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "message": "URL shortened successfully",
    "data": {
      "id": 1,
      "url": "https://example.com/long/path",
      "createdAt": "2024-06-01T12:34:56.000Z",
      "expiresAt": "2024-06-01T13:34:56.000Z",
      "shortUrl": "http://localhost:5500/abc123",
      "isActive": true,
      "visitCount": 0,
      "lastVisitedAt": null
    }
  }
}
```

### Decode URL

```
POST /api/decode
Content-Type: application/json

Request Body:
{
  "shortUrl": "http://localhost:5500/abc123"
}

Response:
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "message": "URL decoded successfully",
    "data": {
      "id": 1,
      "url": "https://example.com/long/path",
      "createdAt": "2024-06-01T12:34:56.000Z",
      "expiresAt": "2024-06-01T13:34:56.000Z",
      "shortUrl": "http://localhost:5500/abc123",
      "isActive": true,
      "visitCount": 0,
      "lastVisitedAt": null
    }
  }
}
```

### Get Statistics

```
GET /api/statistic/:path

Response:
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "message": "URL statistics retrieved successfully",
    "data": {
      "id": 1,
      "visitCount": 42,
      "createdAt": "2024-06-01T12:34:56.000Z",
      "lastVisitedAt": "2024-06-01T13:00:00.000Z"
    }
  }
}
```

### List All URLs

```
GET /api/list

Response:
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "message": "URLs retrieved successfully",
    "data": [
      {
        "id": 1,
        "url": "https://example.com/long/path",
        "createdAt": "2024-06-01T12:34:56.000Z",
        "expiresAt": "2024-06-01T13:34:56.000Z",
        "shortUrl": "http://localhost:5500/abc123",
        "isActive": true,
        "visitCount": 42,
        "lastVisitedAt": "2024-06-01T13:00:00.000Z"
      }
    ]
  }
}
```

### Redirect to Original URL

```
GET /:path
```

Redirects (`302`) to the original URL stored for `:path`. If the URL is found and active, the response will be a redirect. If there's an error, the response will follow the standard error format:

```json
{
  "status": "error",
  "statusCode": 404 or 400,
  "data": {
    "message": "URL not found" or "URL has expired",
    "data": null
  }
}
```

## Environment Variables

Create a `.env` file at the project root with the following variables:

```dotenv
# Environment
NODE_ENV=development

# Server Configuration
PORT=5500
SERVER_HOST=localhost
SERVER_ROOT=/api
SERVICE_NAME="Indicina Url Shortener"

# URL Shortening Behavior
URL_SHORTENER_LENGTH=6
URL_BASE_PATH="http://localhost:5500/"
URL_EXPIRTY_MINUTES=60  # Expiry time in minutes

# Health Check
REMOTE_HEALTH_SERVICE="https://google.com"
```

## Testing

The project includes comprehensive test coverage:

- Unit tests for core functionality
- Integration tests for API endpoints
- Mocked external dependencies
- Error handling scenarios

Run tests with:

```bash
npm run test           # Run all tests
npm run test:coverage  # Run tests with coverage report
```

## Folder Structure

```
backend/
├─ src/
│  ├─ api/
│  │  └─ modules/          # URL and Ping controllers, services, validators
│  ├─ config/              # BusinessConfig, ServerConfig, LoggingConfig
│  ├─ infrastructure/      # Application bootstrap, error handling, dependency wiring
│  ├─ helpers/             # Enums, utilities (StringUtils, BooleanUtils, etc.)
│  └─ utils/               # DefaultValueUtils, etc.
├─ logs/                   # Persisted logs for production
├─ .env                    # Environment variables (not committed)
├─ jest.config.ts         # Jest configuration
└─ tsconfig.json          # TypeScript configuration
```
