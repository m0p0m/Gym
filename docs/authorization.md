# Authorization API Documentation

This document explains how to use the authorization middlewares to protect API endpoints.

There are two levels of protection:
1.  **Authentication:** Ensures that a valid user is logged in.
2.  **Permission:** Ensures that the logged-in user has the specific permission required to access an endpoint.

---

## 1. Authentication Middleware (`auth`)

This middleware checks for a valid `accessToken` in the `Authorization` header. If the token is valid, it fetches the user from the database and attaches it to the `req.user` object.

### Usage

To protect a route so that only logged-in users can access it, add the `auth()` middleware.

```javascript
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';
import userController from '../controllers/user.controller';

const router = Router();

// This route is now protected. Only authenticated users can access it.
router.get('/profile', auth(), userController.getProfile);

export default router;
```

If a user is not logged in or provides an invalid/expired token, the API will respond with a `401 Unauthorized` error.

---

## 2. Permission Middleware (`hasPermission`)

This middleware checks if the authenticated user (`req.user`) has a specific permission. It **must** be used *after* the `auth()` middleware.

The `hasPermission` middleware is a higher-order function that you call with the required permission string.

### Usage

To protect a route so that only users with a specific permission can access it, chain `auth()` and `hasPermission('permission:name')`.

```javascript
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';
import hasPermission from '../middlewares/permission.middleware';
import adminController from '../controllers/admin.controller';

const router = Router();

// This route can only be accessed by users who are:
// 1. Logged in (checked by auth())
// 2. Have the 'users:read' permission (checked by hasPermission)
router.get(
  '/users',
  auth(),
  hasPermission('users:read'),
  adminController.getAllUsers
);

export default router;
```

If the authenticated user does not have the required permission, the API will respond with a `403 Forbidden` error.
