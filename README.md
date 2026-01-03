# Amazon Clone (MERN Stack)

Welcome to the Amazon Clone project. This is a robust full-stack e-commerce platform built using MongoDB, Express.js, React, and Node.js, designed to replicate core Amazon functionalities.

## 🚀 Features

-   **Full Stack Architecture**: Built with the MERN stack.
-   **Authentication**: Secure user login and registration using JWT (JSON Web Tokens).
-   **Product Management**: Admin interface for managing products, categories, and inventory.
-   **Shopping Cart**: Dynamic shopping cart functionality.
-   **Payment Integration**: Integrated with PayPal/Stripe for secure transactions.
-   **Responsive Design**: Optimized for mobile and desktop viewing.

## 🛠️ Tech Stack

-   **Frontend**: React, Redux Toolkit, React Bootstrap
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB, Mongoose

## 📦 Installation

Follow these steps to get the project running locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rhatrivianto/amazon-clone.git
    cd amazon-clone
    ```

2.  **Install Dependencies**
    
    Install dependencies for both backend and frontend:
    ```bash
    # Install backend dependencies
    npm install
    
    # Install frontend dependencies (if applicable in root or client folder)
    cd frontend
    npm install
    ```

3.  **Environment Variables**
    
    Create a `.env` file in the root directory and add the following:
    ```env
    NODE_ENV=development
    PORT=8080
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run the App**
    ```bash
    # Run backend (from root)
    npm run dev
    ```