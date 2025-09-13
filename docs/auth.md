# Authentication API Documentation (OTP Flow)

This document provides details on the passwordless authentication endpoints for the Gym Management API. The login process is a two-step flow: first, request an OTP, then verify it to receive tokens.

---

## 1. `POST /api/auth/send-otp`

Initiates the login process by sending a One-Time Password (OTP) to the user's phone number.

### Request Body

| Field         | Type   | Description                      | Required |
|---------------|--------|----------------------------------|----------|
| `phoneNumber` | String | The user's 11-digit phone number (e.g., `09123456789`). | Yes      |

**Example:**
```json
{
  "phoneNumber": "09123456789"
}
```

### Responses

- **`200 OK`**: The OTP was successfully generated.
  *(Note: In production, the OTP is sent via SMS. For development, it's returned in the response for easy testing.)*
  ```json
  {
    "message": "OTP sent successfully.",
    "otp": "1234"
  }
  ```

- **`400 Bad Request`**: The phone number format is invalid.
  ```json
  {
    "message": "\"phoneNumber\" must be a valid phone number"
  }
  ```

---

## 2. `POST /api/auth/verify-otp`

Verifies the OTP to complete the login. If the user does not exist, a new user account is created. On success, it returns the user object along with access and refresh tokens.

### Request Body

| Field         | Type   | Description                      | Required |
|---------------|--------|----------------------------------|----------|
| `phoneNumber` | String | The user's phone number.         | Yes      |
| `otp`         | String | The 4-digit OTP received.        | Yes      |

**Example:**
```json
{
  "phoneNumber": "09123456789",
  "otp": "1234"
}
```

### Responses

- **`200 OK`**: Login was successful.
  ```json
  {
    "user": {
      "_id": "60c72b2f9b1d8c001f8e4b1a",
      "firstName": "New",
      "lastName": "User",
      "phoneNumber": "09123456789",
      "role": "60c72b2f9b1d8c001f8e4b19"
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-01-01T12:30:00.000Z"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-01-31T12:00:00.000Z"
      }
    }
  }
  ```

- **`401 Unauthorized`**: The OTP is incorrect or has expired.
  ```json
  {
    "message": "Invalid OTP or OTP expired"
  }
  ```

---

## 3. `POST /api/auth/refresh-token`

Provides a new set of access and refresh tokens in exchange for a valid, non-expired refresh token.

### Request Body

| Field          | Type   | Description                               | Required |
|----------------|--------|-------------------------------------------|----------|
| `refreshToken` | String | The refresh token received during login.  | Yes      |

**Example:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Responses

- **`200 OK`**: Tokens were successfully refreshed.
  ```json
  {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-01-01T13:00:00.000Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-01-31T12:30:00.000Z"
    }
  }
  ```

- **`401 Unauthorized`**: The refresh token is invalid, expired, or has been revoked.
  ```json
  {
    "message": "Invalid refresh token"
  }
  ```
