# MercaMorelos Frontend

This is the React frontend for the MercaMorelos e-commerce application. It is built using Vite, React, and Tailwind CSS, and it communicates directly with a Supabase backend for authentication, database, and storage.

## Features

-   User authentication (login, registration with email confirmation, password reset)
-   Product catalog with categories and collections
-   Product search and filtering
-   Shopping cart
-   Checkout process
-   Order history
-   User profiles
-   Wishlists
-   Admin panel for managing products, orders, and customers
-   Offline support for user registration

## Setup Instructions

### 1. Supabase Setup

This project requires a Supabase project to function.

1.  Create a new project on [supabase.com](https://supabase.com).
2.  In the SQL Editor, run the contents of `backend/init.sql` to create the necessary tables and relationships.
3.  After the tables are created, run the contents of `backend/seed.sql` to populate your database with sample data.
4.  Enable Row Level Security (RLS) on your tables and define policies for secure data access.
5.  In your Supabase project settings, find your Project URL and anon key.

### 2. Environment Variables

Create a `.env` file in the root of the project and add your Supabase credentials:

```env
VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### 3. Install Dependencies

Navigate to the project directory in your terminal and run:

```bash
npm install
```

### 4. Run the Development Server

To start the Vite development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).
