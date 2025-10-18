# MercaMorelos Backend

This is the Node.js, Express, and PostgreSQL backend for the MercaMorelos e-commerce application.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in this backend directory (`/backend/.env`) and add the following content, using the Supabase connection URL you provided.

**Important:** This file is critical for the backend to connect to the database.

```env
# Use the Supabase Connection Pooler URL for your application
DATABASE_URL="postgresql://postgres.ijgnbcpbejvnjfygnexy:j5s82QSM.@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Use the long, random JWT secret you provided
JWT_SECRET="nV/weyUAKcx/nKa71get6UmbK/EL7PKV9h/9vbcQ6whbUv+zsK72VBhSt6/kbz9hjPkdY033gqC0Km34yUkoAw=="

# The port on which your backend server will run
PORT=4000
```

### 2. Database Initialization

Connect to your PostgreSQL database using a client like `psql` or a GUI tool (e.g., pgAdmin, DBeaver, or the Supabase SQL Editor).

You will need to run an `init.sql` script to create all the necessary tables (`users`, `products`, `orders`, etc.). If you have an `init.sql` file, copy its entire content and execute it. **This will erase existing data in the tables it modifies.**

### 3. Install Dependencies

Navigate to this backend directory in your terminal and run:

```bash
npm install
```

### 4. Run the Server

You can now run the server from the **root directory of the project** using the new helper scripts:

To start in development mode (with automatic reloading):
```bash
npm run server:dev
```

To start for production:
```bash
npm run server:start
```

The server will be running on the port specified in your `.env` file (e.g., `http://localhost:4000`). Your React frontend will now be able to communicate with this API.