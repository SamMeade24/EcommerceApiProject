# E-Commerce API — Endpoint Plan

## 1. Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Authenticate a user and obtain an authentication token | Public |

## 2. Products

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/products` | Retrieve all products | Public |
| GET | `/products/:id` | Retrieve a single product | Public |
| POST | `/products` | Create a new product | Admin |
| PUT | `/products/:id` | Replace/update a product's details | Admin |
| DELETE | `/products/:id` | Delete a product | Admin |

## 3. Shopping Cart

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users/:id/cart` | Retrieve a user's cart and its items | Authenticated owner |
| POST | `/users/:id/cart/items` | Add a product to the cart | Authenticated owner |
| PATCH | `/users/:id/cart/items/:productId` | Update the quantity of a cart item | Authenticated owner |
| DELETE | `/users/:id/cart/items/:productId` | Remove a product from the cart | Authenticated owner |
| DELETE | `/users/:id/cart/items` | Remove all items from the cart | Authenticated owner |

**Cart rules:**
- Each user has one cart, created when needed.
- Adding a product already in the cart increases its quantity.
- Cart item quantities must be greater than zero.
- Users can only access and modify their own carts.

## 4. Checkout

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/users/:id/checkout` | Convert the user's cart into an order | Authenticated owner |

**Checkout rules:**
- Checkout creates an order and its associated order items.
- The purchase price of each product is recorded in the order items.
- The cart is cleared after a successful checkout.
- Checkout operations use a database transaction so that partial failures can be rolled back.
- An empty cart cannot be checked out.

## 5. Orders

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users/:id/orders` | Retrieve a user's order history | Authenticated owner |
| GET | `/users/:id/orders/:orderId` | Retrieve a specific order and its items | Authenticated owner |
| PATCH | `/orders/:orderId/status` | Update an order's status | Admin |

**Order rules:**
- Users can only view their own orders.
- Administrators can update order statuses.
- Valid statuses are `Pending`, `Processing`, `Shipped` and `Completed`.
- Customers cannot cancel their orders through the API.

## 6. Access Control Summary

- **Public:** Register, log in and browse products.
- **Authenticated users:** Manage their own cart, checkout and view their own orders.
- **Administrators:** Create, update and delete products, and update order statuses.

Authentication verifies who the user is. Authorisation determines what that user is permitted to do.

## 7. HTTP Method Conventions

- `GET` — Retrieve resources.
- `POST` — Create resources or initiate an action such as checkout.
- `PUT` — Replace/update a resource's complete representation.
- `PATCH` — Partially update a resource.
- `DELETE` — Remove a resource or clear cart items.

## 8. Implementation Notes

- Use PostgreSQL through the existing connection pool.
- Validate request bodies, route parameters and query