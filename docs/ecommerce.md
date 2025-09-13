# E-commerce API Documentation (Cart & Orders)

This document provides details on the shopping cart and order management endpoints. All endpoints require authentication.

---

## Cart API

### `GET /api/v1/cart`

Retrieves the current user's shopping cart.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Responses
- **`200 OK`**: Returns the user's cart object, populated with product details.

---

### `POST /api/v1/cart/items`

Adds an item to the current user's shopping cart. If the item already exists, its quantity is increased.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field       | Type   | Description                      |
|-------------|--------|----------------------------------|
| `productId` | String | The ID of the product to add.    |
| `quantity`  | Number | The quantity of the product to add.|

### Responses
- **`200 OK`**: Returns the updated cart object.
- **`404 Not Found`**: If the product does not exist or is unavailable.
- **`400 Bad Request`**: If there is not enough stock.

---

## Order API

### `POST /api/v1/orders`

Creates a new order from the user's current shopping cart. This action will empty the cart and decrease product stock quantities.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field             | Type   | Description                               |
|-------------------|--------|-------------------------------------------|
| `shippingAddress` | Object | An object with street, city, and postalCode. |

### Responses
- **`201 Created`**: Returns the newly created order object.
- **`400 Bad Request`**: If the cart is empty or there is insufficient stock for an item.

---

### `GET /api/v1/orders`

Retrieves a list of the current user's past orders.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Responses
- **`200 OK`**: Returns an array of the user's order objects.
