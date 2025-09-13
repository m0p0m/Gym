# Attendance API Documentation

This document provides details on the attendance tracking endpoints.

---

## `POST /api/v1/attendance/check-in`

Records a user's check-in time. This endpoint is intended to be called by a trusted machine (e.g., a fingerprint scanner) and is protected by an API key.

### Headers
| Header      | Value        | Description                          | Required |
|-------------|--------------|--------------------------------------|----------|
| `x-api-key` | `<yourApiKey>` | The secret API key for machine-to-machine communication. | Yes      |

### Request Body
| Field            | Type   | Description                               |
|------------------|--------|-------------------------------------------|
| `userIdentifier` | String | A unique identifier for the user (e.g., phone number). |

### Responses
- **`201 Created`**: Returns the newly created attendance record.
- **`401 Unauthorized`**: If the API key is missing or invalid.
- **`404 Not Found`**: If the user identifier does not match any user.
- **`400 Bad Request`**: If the user is already checked in and has not checked out.

---

## `POST /api/v1/attendance/check-out`

Records a user's check-out time for their last open check-in. This endpoint is also protected by an API key.

### Headers
| Header      | Value        | Description                          | Required |
|-------------|--------------|--------------------------------------|----------|
| `x-api-key` | `<yourApiKey>` | The secret API key.                  | Yes      |

### Request Body
| Field            | Type   | Description                               |
|------------------|--------|-------------------------------------------|
| `userIdentifier` | String | A unique identifier for the user.         |

### Responses
- **`200 OK`**: Returns the updated attendance record with the `checkOutTime`.
- **`400 Bad Request`**: If the user does not have an open check-in record.

---

## `GET /api/v1/attendance/me`

Retrieves the attendance history for the currently authenticated user.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Responses
- **`200 OK`**: Returns an array of the user's attendance records, sorted by most recent first.
  ```json
  [
    {
      "_id": "60c72b2f9b1d8c001f8e4b1a",
      "user": "60c72b2f9b1d8c001f8e4b1b",
      "checkInTime": "2023-01-01T09:00:00.000Z",
      "checkOutTime": "2023-01-01T10:30:00.000Z"
    }
  ]
  ```
