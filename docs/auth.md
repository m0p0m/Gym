# Authentication API Documentation

This document provides details on the authentication endpoints for the Gym Management API.

---

## `POST /api/auth/register`

Registers a new user in the system.

### Request Body

| Field         | Type   | Description                      | Required |
|---------------|--------|----------------------------------|----------|
| `firstName`   | String | The first name of the user.      | Yes      |
| `lastName`    | String | The last name of the user.       | Yes      |
| `phoneNumber` | String | The user's 11-digit phone number.| Yes      |
| `password`    | String | The user's password (min 8 chars).| Yes      |

**Example:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "09123456789",
  "password": "password123"
}
```

### Responses

- **`201 Created`**: The user was successfully created. The response body will contain the new user object (without the password).
  ```json
  {
    "_id": "60c72b2f9b1d8c001f8e4b1a",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "09123456789",
    "role": "60c72b2f9b1d8c001f8e4b19",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
  ```

- **`400 Bad Request`**: The request was malformed (e.g., missing fields, invalid phone number) or the phone number is already taken.
  ```json
  {
    "message": "Phone number already taken"
  }
  ```

---

## `POST /api/auth/login`

Logs in an existing user and returns a JSON Web Token (JWT).

### Request Body

| Field         | Type   | Description                      | Required |
|---------------|--------|----------------------------------|----------|
| `phoneNumber` | String | The user's registered phone number.| Yes      |
| `password`    | String | The user's password.             | Yes      |

**Example:**
```json
{
  "phoneNumber": "09123456789",
  "password": "password123"
}
```

### Responses

- **`200 OK`**: Login was successful. The response body will contain the user object and a JWT.
  ```json
  {
    "user": {
      "_id": "60c72b2f9b1d8c001f8e4b1a",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "09123456789",
      "role": "60c72b2f9b1d8c001f8e4b19"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **`401 Unauthorized`**: The phone number or password was incorrect.
  ```json
  {
    "message": "Incorrect phone number or password"
  }
  ```
