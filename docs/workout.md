# Workout API Documentation

This document provides details on the workout management endpoints.

---

## `POST /api/v1/workouts/plans`

Creates a new workout plan template. This is intended for users with a 'Trainer' or 'Admin' role.

**Permission Required:** `workouts:create`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
The request body should be a complex object representing the entire plan.
```json
{
  "name": "Beginner Strength Phase 1",
  "description": "A 4-week plan for new lifters.",
  "durationWeeks": 4,
  "days": [
    {
      "dayOfWeek": "Monday",
      "name": "Full Body A",
      "exercises": [
        {
          "exerciseName": "Barbell Squat",
          "sets": 3,
          "reps": "8-12",
          "restPeriodSeconds": 90
        },
        {
          "exerciseName": "Bench Press",
          "sets": 3,
          "reps": "8-12",
          "restPeriodSeconds": 60
        }
      ]
    },
    {
      "dayOfWeek": "Wednesday",
      "name": "Full Body B",
      "exercises": [
        {
          "exerciseName": "Deadlift",
          "sets": 1,
          "reps": "5",
          "restPeriodSeconds": 180
        }
      ]
    }
  ]
}
```

### Responses
- **`201 Created`**: Returns the newly created workout plan object.
- **`403 Forbidden`**: If the user does not have the `workouts:create` permission.

---

## `POST /api/v1/workouts/plans/assign`

Assigns an existing workout plan to a specific user.

**Permission Required:** `workouts:assign`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field    | Type   | Description                   |
|----------|--------|-------------------------------|
| `planId` | String | The ID of the `WorkoutPlan`.  |
| `userId` | String | The ID of the user to assign to. |

### Responses
- **`200 OK`**: Returns the newly created `UserWorkoutSession` object.
- **`403 Forbidden`**: If the user does not have the `workouts:assign` permission.
- **`404 Not Found`**: If the `planId` does not exist.

---

## `GET /api/v1/workouts/sessions/my-plan`

Retrieves the currently active workout plan and session for the authenticated user.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Responses
- **`200 OK`**: Returns the user's active workout session, populated with plan details.
- **`404 Not Found`**: If the user has no active plan assigned.
