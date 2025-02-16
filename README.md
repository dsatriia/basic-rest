# Basic REST API

This is a simple Express.js application that provides a token-based authentication system and a CRUD API for managing customer data. The application also simulates user login/logout functionality with token validation middleware.

## Features

- **User Login**: Users can log in with predefined credentials and receive a token.
- **Token-based Authentication**: Protects all endpoints except the login endpoint.
- **Customer Management**: CRUD operations for managing customer data stored in a JSON file.
- **User Logout**: Invalidates the token to log out.

---

## Requirements

- Node.js (v14 or later)
- npm

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/dsatriia/basic-rest.git
   cd basic-rest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node final.js
   ```

4. Access the server at: `http://localhost:3000`

---

## API Endpoints

### Authentication

#### 1. **Login**
   - **POST** `/login`
   - **Body**:
     ```json
     {
       "username": "admin",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "token": "your-unique-token"
     }
     ```

#### 2. **Logout**
   - **POST** `/logout`
   - **Headers**: 
     ```
     Authorization: Bearer <your-token>
     ```
   - **Response**:
     ```json
     {
       "message": "Logged out successfully"
     }
     ```

---

### Customer Management (Protected)

All endpoints below require the `Authorization` header with a valid token:
```
Authorization: Bearer <your-token>
```

#### 1. **Get All Customers**
   - **GET** `/customers`
   - **Response**:
     ```json
     [
       {
         "id": "unique-id",
         "name": "Customer Name",
         "email": "customer@example.com"
       }
     ]
     ```

#### 2. **Get a Customer by ID**
   - **GET** `/customers/:id`
   - **Response** (if found):
     ```json
     {
       "id": "unique-id",
       "name": "Customer Name",
       "email": "customer@example.com"
     }
     ```
   - **Response** (if not found):
     ```json
     {
       "message": "Customer not found"
     }
     ```

#### 3. **Add a New Customer**
   - **POST** `/customers`
   - **Body**:
     ```json
     {
       "name": "Customer Name",
       "email": "customer@example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "id": "unique-id",
       "name": "Customer Name",
       "email": "customer@example.com"
     }
     ```

#### 4. **Update a Customer**
   - **PUT** `/customers/:id`
   - **Body**:
     ```json
     {
       "name": "Updated Name",
       "email": "updated-email@example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "id": "unique-id",
       "name": "Updated Name",
       "email": "updated-email@example.com"
     }
     ```

#### 5. **Delete a Customer**
   - **DELETE** `/customers/:id`
   - **Response**:
     ```json
     {
       "id": "unique-id",
       "name": "Customer Name",
       "email": "customer@example.com"
     }
     ```

---

## Simulated User Credentials

Predefined users for testing:

| Username | Password     |
|----------|--------------|
| admin    | password123  |
| user     | userpassword |

---

## File Storage

- Customer data is stored in a file named `customers.json`.
- If the file does not exist, it will be created automatically.

---

## Notes

- Tokens are stored in memory and will reset when the server restarts.
- This is a basic example and **should not be used in production without enhancements**, such as database integration, token expiration, and password hashing.

---

## License

This project is licensed under the MIT License. 