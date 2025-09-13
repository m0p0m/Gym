# Payment API Documentation

This document provides details on the payment gateway integration with Zarinpal.

---

## `POST /api/v1/payments/request/order/:orderId`

Initiates a payment request for a specific order. This endpoint communicates with Zarinpal to get a payment URL.

### Headers
| Header          | Value               |
|-----------------|---------------------|
| `Authorization` | `Bearer <accessToken>` |

### URL Parameters
| Parameter | Type   | Description                |
|-----------|--------|----------------------------|
| `orderId` | String | The ID of the order to be paid. |

### Responses
- **`200 OK`**: Returns an object containing the URL to redirect the user to for payment.
  ```json
  {
    "paymentUrl": "https://www.zarinpal.com/pg/StartPay/..."
  }
  ```
- **`404 Not Found`**: If the order with the given ID does not exist.
- **`400 Bad Request`**: If the order has already been processed.

---

## `GET /api/v1/payments/callback`

This is the callback endpoint that Zarinpal will redirect the user to after a payment attempt. Your frontend should not call this directly. The query parameters are provided by Zarinpal.

### Query Parameters
| Parameter   | Type   | Description                               |
|-------------|--------|-------------------------------------------|
| `Authority` | String | The unique authority code for the transaction. |
| `Status`    | String | The status of the payment (`OK` or `NOK`).   |

### Responses
- **`200 OK`**: If the payment was successfully verified. The response will contain the transaction details. Your frontend should then redirect the user to a success page.
  ```json
  {
    "message": "Payment verified successfully",
    "transaction": { ... }
  }
  ```
- **`400 Bad Request`**: If the payment was not successful, was cancelled, or the verification failed. Your frontend should redirect the user to a failure page.
  ```json
  {
    "message": "Payment was not successful or was cancelled by the user"
  }
  ```
