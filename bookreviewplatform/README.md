# Book Review Platform API Documentation

## Introduction
Welcome to the Book Review Platform API documentation. This API provides endpoints to manage books, user profiles, and book selections for reviewing purposes.

## Base URL
The base URL for the API is http://127.0.0.1:8000/.

Authentication
Some endpoints require authentication using token-based authentication. To authenticate, include the token in the Authorization header of your requests.

## Endpoints

1. User Registration
Endpoint: /register/
Method: POST

Description: Register a new user.

Request Body:
username (string, required): User's username.
password (string, required): User's password.
email (string, required): User's email address.

Response:
Status Code: 201 Created
Body: User details

2. User Login
Endpoint: /login/
Method: POST

Description: Log in an existing user.

Request Body:
username (string, required): User's username.
password (string, required): User's password.

Response:
Status Code: 200 OK
Body: Token for authentication

3. Books
Endpoint: /books/
Method: GET

Description: Get a list of all books.

Response:

Status Code: 200 OK
Body: List of books

Endpoint: /books/{book_id}/
Method: GET

Description: Get details of a specific book.

Response:
Status Code: 200 OK
Body: Book details

4. User Profile
Endpoint: /user-profile/
Method: GET

Description: Get the user's profile information.

Authentication: Required

Response:

Status Code: 200 OK
Body: User profile details
Endpoint: /user-profile/{user_id}/
Method: GET

Description: Get the profile information of a specific user.

Authentication: Required

Response:
Status Code: 200 OK
Body: User profile details

5. Book Selection
Endpoint: /selected-books/
Method: GET

Description: Get the list of books selected by the user.

Authentication: Required

Response:
Status Code: 200 OK
Body: List of selected books
Endpoint: /selected-books/{selection_id}/
Method: GET

Description: Get details of a specific book selection.
Authentication: Required

Response:
Status Code: 200 OK
Body: Book selection details

6. Swagger UI
Endpoint: /swagger/
Method: GET

Description: Access the Swagger UI for interactive API documentation.

7. Redoc UI
Endpoint: /redoc/
Method: GET

Description: Access the ReDoc UI for clear and concise API documentation.

Conclusion
This documentation provides an overview of the Book Review Platform API. Use the provided endpoints to interact with the API and manage books, user profiles, and book selections. Ensure proper authentication for secured endpoints. For more details, refer to the Swagger and ReDoc UIs for interactive and visual documentation.