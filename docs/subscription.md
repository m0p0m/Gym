# Subscription API Documentation

This document provides details on the subscription management endpoints.

---

## `POST /api/v1/subscriptions/plans`

Creates a new subscription plan template (e.g., Gold, Silver, Bronze).

**Permission Required:** `subscriptions:create`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field          | Type   | Description                   |
|----------------|--------|-------------------------------|
| `name`         | String | The name of the plan.         |
| `description`  | String | A description of the plan.    |
| `price`        | Number | The price of the plan.        |
| `durationDays` | Number | The duration of the plan in days. |

### Responses
- **`201 Created`**: Returns the newly created subscription plan object.
- **`403 Forbidden`**: If the user does not have the `subscriptions:create` permission.

---

## `POST /api/v1/subscriptions`

Assigns an existing subscription plan to a specific user. This creates a new active subscription for the user.

**Permission Required:** `subscriptions:assign`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field    | Type   | Description                   |
|----------|--------|-------------------------------|
| `planId` | String | The ID of the `SubscriptionPlan`. |
| `userId` | String | The ID of the user to assign to. |

### Responses
- **`200 OK`**: Returns the newly created `Subscription` object.
- **`403 Forbidden`**: If the user does not have the `subscriptions:assign` permission.

---

## `GET /api/v1/subscriptions/me`

Retrieves the currently active subscription for the authenticated user.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Responses
- **`200 OK`**: Returns the user's active subscription, populated with plan details.
- **`404 Not Found`**: If the user has no active subscription.
  ```json
  {
    "_id": "60c72b2f9b1d8c001f8e4b1a",
    "user": "60c72b2f9b1d8c001f8e4b1b",
    "plan": {
        "_id": "60c72b2f9b1d8c001f8e4b1c",
        "name": "Gold",
        "price": 100,
        "durationDays": 30
    },
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-31T00:00:00.000Z",
    "status": "active"
  }
  ```
