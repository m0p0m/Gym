# Dashboard & Analytics API Documentation

This document provides details on the endpoints used for administrative dashboards and analytics.

---

## `GET /api/v1/dashboard/stats`

Retrieves a summary of key statistics for the entire gym.

**Permission Required:** `dashboard:read`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Responses

- **`200 OK`**: Returns an object containing key metrics.
  ```json
  {
    "totalUsers": 150,
    "activeSubscriptions": 125,
    "totalRevenue": 5500.75,
    "totalOrders": 88
  }
  ```

- **`403 Forbidden`**: If the user does not have the `dashboard:read` permission.
