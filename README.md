# Book Review Platform

An intuitive platform that allows users to review their favorite books and vote on reviews. The backend is powered by Django and Django Rest Framework, while the frontend uses React for a dynamic user experience.

## Features

Book Database: Users can browse books, view details, and see reviews.

Review System: Registered users can write reviews, rate books, and comment on existing reviews.

Voting System: Users can upvote or downvote reviews, providing a community-driven ranking of reviews.

Responsive Frontend: Using React, the platform offers a smooth and responsive user interface.

## Getting Started

### Prerequisites

Python 3.x
Node.js and npm

Django and Django Rest Framework

### Setup & Installation

Backend:

Navigate to the backend directory:

`cd bookreviewplatform`

Install the required Python packages:

`pip install -r requirements.txt`

Run migrations:

`python manage.py migrate`

Start the Django server:

`python manage.py runserver`

Frontend:

Navigate to the frontend submodule:

`cd bookreview-frontend`

Install dependencies:

`npm install`

Start the React app:

`npm start`

### Architecture

Backend:

Uses Django's ORM for database operations.

DRF (Django Rest Framework) for creating API endpoints.

SQLite for development database (can be switched to PostgreSQL for production).

Frontend:

React application created with Create React App.

Uses Axios for API requests to the backend.

### API Endpoints
```
Endpoint	Method	Description
/api/books/	GET	List all books
/api/reviews/	GET	List all reviews
/api/reviews/	POST	Create a new review
/api/votes/	GET	List all votes
/api/votes/	POST	Upvote or downvote a review

```
