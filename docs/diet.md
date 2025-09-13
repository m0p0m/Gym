# Diet Plan API Documentation

This document provides details on the diet plan management endpoints.

---

## `POST /api/v1/diets/plans`

Creates a new diet plan template. This is intended for users with a 'Nutritionist', 'Trainer', or 'Admin' role.

**Permission Required:** `diets:create`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
The request body should be a complex object representing the entire diet plan.
```json
{
  "name": "Balanced Diet for Weight Maintenance",
  "description": "A balanced diet plan for active individuals.",
  "totalCalories": 2200,
  "days": [
    {
      "dayNumber": 1,
      "meals": [
        {
          "name": "Breakfast",
          "time": "08:00",
          "items": [
            {
              "name": "Scrambled Eggs",
              "quantity": "3 large",
              "calories": 210
            },
            {
              "name": "Whole Wheat Toast",
              "quantity": "2 slices",
              "calories": 160
            }
          ]
        },
        {
          "name": "Lunch",
          "time": "13:00",
          "items": [
            {
              "name": "Grilled Chicken Salad",
              "quantity": "1 bowl",
              "calories": 450
            }
          ]
        }
      ]
    }
  ]
}
```

### Responses
- **`201 Created`**: Returns the newly created diet plan object.
- **`403 Forbidden`**: If the user does not have the `diets:create` permission.

---

## `POST /api/v1/diets/plans/assign`

Assigns an existing diet plan to a specific user.

**Permission Required:** `diets:assign`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field    | Type   | Description                   |
|----------|--------|-------------------------------|
| `planId` | String | The ID of the `DietPlan`.     |
| `userId` | String | The ID of the user to assign to. |

### Responses
- **`200 OK`**: Returns the newly created `UserDietSession` object.
- **`403 Forbidden`**: If the user does not have the `diets:assign` permission.

---

## `POST /api/v1/diets/sessions/adherence`

Allows a user to log their adherence to their diet plan for a specific day.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field      | Type    | Description                   |
|------------|---------|-------------------------------|
| `date`     | String  | The date in "YYYY-MM-DD" format. |
| `followed` | Boolean | `true` if the user followed the plan, `false` otherwise. |

### Responses
- **`200 OK`**: Returns the updated `UserDietSession` object.
- **`404 Not Found`**: If the user has no active diet plan.
