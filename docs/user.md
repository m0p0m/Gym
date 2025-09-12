# User API Documentation

This document provides details on the user-related endpoints. All endpoints in this section require authentication.

---

## `GET /api/v1/users/me`

Retrieves the complete profile of the currently authenticated user.

### Headers

| Header          | Value               | Description                      | Required |
|-----------------|---------------------|----------------------------------|----------|
| `Authorization` | `Bearer <accessToken>` | The access token for the user.   | Yes      |

### Responses

- **`200 OK`**: Returns the full user object.
  ```json
  {
    "_id": "60c72b2f9b1d8c001f8e4b1a",
    "firstName": "Jules",
    "lastName": "The Engineer",
    "phoneNumber": "09123334455",
    "role": "60c72b2f9b1d8c001f8e4b19",
    "height": 180,
    "weight": 80,
    "gender": "male",
    "birthDate": "1990-01-01T00:00:00.000Z",
    "profilePictureUrl": "https://example.com/avatar.jpg",
    "goals": ["weight_loss"],
    "medicalInfo": {
      "conditions": ["Asthma"],
      "allergies": ["Peanuts"],
      "notes": "User is recovering from a knee injury."
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phoneNumber": "09129876543"
    },
    "bodyMeasurements": {
      "bodyFatPercentage": 15.5,
      "waist": 85
    },
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:30:00.000Z"
  }
  ```

- **`401 Unauthorized`**: If the access token is missing or invalid.

---

## `PATCH /api/v1/users/me`

Updates the profile of the currently authenticated user. You can send any subset of the fields to be updated.

### Headers

| Header          | Value               | Description                      | Required |
|-----------------|---------------------|----------------------------------|----------|
| `Authorization` | `Bearer <accessToken>` | The access token for the user.   | Yes      |

### Request Body

All fields are optional.

| Field         | Type     | Description                      |
|---------------|----------|----------------------------------|
| `firstName`   | String   | The first name of the user.      |
| `lastName`    | String   | The last name of the user.       |
| `height`      | Number   | Height in centimeters.           |
| `weight`      | Number   | Weight in kilograms.             |
| `gender`      | String   | `male`, `female`, or `other`.    |
| `birthDate`   | Date     | ISO 8601 date string.            |
| `profilePictureUrl`| String | A URL to the user's avatar.    |
| `goals`       | [String] | An array of fitness goals.       |
| `medicalInfo` | Object   | Object with medical details.     |
| `emergencyContact`| Object | Object with emergency contact details. |
| `bodyMeasurements`| Object | Object with body measurements. |

**Example:**
```json
{
  "firstName": "Jules",
  "goals": ["muscle_gain", "endurance"],
  "medicalInfo": {
    "notes": "Knee feels better now."
  }
}
```

### Responses

- **`200 OK`**: The update was successful. Returns the complete, updated user object.

- **`400 Bad Request`**: The request body contains invalid data (e.g., `height` is not a number).

- **`401 Unauthorized`**: If the access token is missing or invalid.
