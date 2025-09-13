# Notification API Documentation

This document provides details on the endpoints for managing user notifications. All endpoints require authentication.

---

## `GET /api/v1/notifications`

Retrieves a list of all notifications for the currently authenticated user, sorted by most recent first.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Responses
- **`200 OK`**: Returns an array of notification objects.
  ```json
  [
    {
      "_id": "60c72b2f9b1d8c001f8e4b1a",
      "user": "60c72b2f9b1d8c001f8e4b1b",
      "title": "Payment Successful",
      "message": "Your payment for order #123 was successful.",
      "type": "order_success",
      "isRead": false,
      "link": "/orders/123",
      "createdAt": "2023-01-01T12:00:00.000Z"
    }
  ]
  ```

---

## `PATCH /api/v1/notifications/:notificationId/read`

Marks a specific notification as read.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### URL Parameters
| Parameter        | Type   | Description                     |
|------------------|--------|---------------------------------|
| `notificationId` | String | The ID of the notification to mark as read. |

### Responses
- **`200 OK`**: Returns the updated notification object with `isRead: true`.
- **`404 Not Found`**: If the notification does not exist or does not belong to the user.
