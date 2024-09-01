# Payment Challenge

Welcome to the **Payment Challenge** project! This system allows users to seamlessly make and manage payments using BrainTree.

## Prerequisites

Before you begin, make sure you have the following:

- A MongoDB connection string.
- BrainTree API credentials.

You'll need to add these to the `payment-api/.env` file after setting up the project.

## Installation

Follow these steps to set up and run the Payment Challenge locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/samirsayyad/payment-challenge
   ```

2. **Navigate to the project directory:**

   ```bash
   cd payment-challenge
   ```

3. **Install dependencies and run the application:**

   ```bash
   # Set up the frontend
   cd payment-ui
   yarn install
   cp .env.sample .env
   yarn start

   # Set up the backend
   cd ../payment-api
   yarn install
   cp .env.sample .env
   yarn dev
   ```

4. **Environment Configuration:**

   - Add your MongoDB connection string and BrainTree credentials to the `payment-api/.env` file.

## Usage

Once the setup is complete, open your browser and navigate to:

```
http://localhost:3000/
```

This will launch the Payment Challenge user interface, where you can start managing payments.

## Notes

- Ensure your `.env` file in `payment-api/` is properly configured with your MongoDB connection string and BrainTree credentials before running the application.
