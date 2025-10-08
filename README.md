# MercaMorelos Backend

This is the Node.js, Express, and PostgreSQL backend for the MercaMorelos e-commerce application.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root of this backend directory and add the following content. The `DATABASE_URL` is pre-filled with the Supabase instance you provided.

```
DATABASE_URL=postgresql://postgres:j5s82QSM.@db.ijgnbcpbejvnjfygnexy.supabase.co:5432/postgres
JWT_SECRET=your_super_secret_jwt_key_that_is_long_and_random
PORT=4000
```

**Important:** Change `JWT_SECRET` to your own long, random, and secret string.

### 2. Database Initialization

Connect to your PostgreSQL database using a client like `psql` or a GUI tool (e.g., pgAdmin, DBeaver).

Copy the entire content of the `backend/init.sql` file and run it against your database. This will create all the necessary tables (`users`, `products`, `reviews`, etc.). **This will erase existing data.**

### 3. Install Dependencies

Navigate to this backend directory in your terminal and run:

```bash
npm install
```

### 4. Run the Server

To start the server in development mode (with automatic reloading on file changes), run:

```bash
npm run dev
```

To start the server for production, run:

```bash
npm start
```

The server will be running on the port specified in your `.env` file (e.g., `http://localhost:4000`). Your React frontend will now be able to communicate with this API.
