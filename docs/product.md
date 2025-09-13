# Product API Documentation

This document provides details on the product catalog endpoints.

---

## `POST /api/v1/products`

Creates a new product in the store.

**Permission Required:** `products:create`

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### Request Body
| Field           | Type     | Description                   |
|-----------------|----------|-------------------------------|
| `name`          | String   | The name of the product.      |
| `description`   | String   | A detailed description.       |
| `price`         | Number   | The price of the product.     |
| `stockQuantity` | Number   | Available stock quantity.     |
| `images`        | [String] | An array of image URLs.       |
| `brand`         | String   | The product brand.            |
| `category`      | String   | The product category.         |

### Responses
- **`201 Created`**: Returns the newly created product object.
- **`403 Forbidden`**: If the user does not have the `products:create` permission.

---

## `GET /api/v1/products`

Retrieves a list of all available products. Supports pagination.

### Query Parameters
| Parameter | Type   | Description                               | Default |
|-----------|--------|-------------------------------------------|---------|
| `limit`   | Number | Maximum number of products to return.     | 10      |
| `page`    | Number | The page number for pagination.           | 1       |
| `sortBy`  | String | Sort order (e.g., `createdAt:desc`).      | `createdAt:desc` |

### Responses
- **`200 OK`**: Returns an object containing the products array and pagination details.
  ```json
  {
    "products": [
      {
        "_id": "...",
        "name": "Whey Protein",
        "price": 50,
        "category": "Protein"
      }
    ],
    "totalPages": 1,
    "currentPage": 1
  }
  ```

---

## `GET /api/v1/products/:productId`

Retrieves a single product by its ID.

### Responses
- **`200 OK`**: Returns the product object.
- **`404 Not Found`**: If no product with the given ID exists.

---

## `PATCH /api/v1/products/:productId`

Updates an existing product.

**Permission Required:** `products:update`

### Responses
- **`200 OK`**: Returns the updated product object.
- **`403 Forbidden`**: If the user does not have permission.
- **`404 Not Found`**: If the product does not exist.

---

## `DELETE /api/v1/products/:productId`

Deletes a product.

**Permission Required:** `products:delete`

### Responses
- **`204 No Content`**: If the deletion was successful.
- **`403 Forbidden`**: If the user does not have permission.
- **`404 Not Found`**: If the product does not exist.
