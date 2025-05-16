
# Cutebae - Kids Fashion Store

A full-stack e-commerce application built with React, Express, and PostgreSQL.

## Features

- User authentication (Email/Password and Google OAuth)
- Product browsing with filters
- Shopping cart functionality
- Order management
- Admin dashboard for product and order management
- Wishlist functionality
- Returns processing

## Tech Stack

### Frontend
- React (with JSX)
- Vanilla CSS for styling
- React Router for navigation
- React Query for data fetching

### Backend
- Express.js
- PostgreSQL database
- JWT for authentication
- Passport.js for OAuth

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- PostgreSQL (v12 or newer)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cutebae.git
   cd cutebae
   ```

2. Install dependencies:
   ```
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. Set up environment variables:
   ```
   # Copy example env files
   cp .env.example .env
   ```
   Edit the `.env` file with your database and OAuth credentials.

4. Create database:
   ```
   cd server
   npm run db:create
   cd ..
   ```

5. Run database migrations:
   ```
   # Import the schema
   psql -d cutebae -f server/db/schema.sql
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Development

### Backend API Structure

- `/api/auth` - Authentication routes
- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/users` - User profile and wishlist management

### Database Schema

- `users` - User accounts and profiles
- `products` - Product catalog
- `product_variants` - Product variations (size, color)
- `orders` - Customer orders
- `order_items` - Items within each order
- `returns` - Product returns
- `return_items` - Items being returned
- `wishlists` - User wishlist items

## Deployment

### Frontend
1. Build the React application:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your hosting provider.

### Backend
1. Set up a PostgreSQL database on a cloud provider.
2. Update environment variables for production.
3. Deploy the server code to a hosting service like Heroku, Render, or AWS.

## License

This project is licensed under the MIT License.
