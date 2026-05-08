# Inventory Management System

A simple inventory management system built with HTML, Bootstrap, JavaScript, Node.js, Express, and MongoDB.

## Features

- Login page UI
- Dashboard with inventory summary
- Product list with search and category filter
- Add product
- Edit product
- Delete product
- Low stock badge
- MongoDB product storage
- REST API for product CRUD

## Tech Stack

### Frontend
- HTML
- Bootstrap 5
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Folder Structure

inventory-management-system
├── frontend
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── products.html
│   ├── add-product.html
│   ├── css
│   │   └── style.css
│   └── js
│       ├── app.js
│       └── products.js
└── backend
    ├── server.js
    ├── models
    │   └── Product.js
    ├── routes
    │   └── productRoutes.js
    └── controllers
        └── productController.js

## API Endpoints
Method	Endpoint	Description
GET	/products	Get all products
GET	/products/:id	Get one product
POST	/products	Add product
PUT	/products/:id	Update product
DELETE	/products/:id	Delete product

## How to Run Backend
cd backend
npm install
npm run dev

## Backend runs on:

http://localhost:5000

## Frontend
Open:

frontend/index.html
or use VS Code Live Server.

## Environment Variables
Create a .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string

## Future Improvements
User registration and login
JWT authentication
Protected product routes
Better dashboard charts
Product image upload
Pagination
