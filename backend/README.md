# Backend API

Express backend with JWT authentication and Supabase database.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Setup Supabase:**
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Go to Project Settings > API
   - Copy your `URL` and `anon/public` key

3. **Create the users table in Supabase:**
   - Go to SQL Editor in Supabase dashboard
   - Run this SQL:
   ```sql
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     name TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Supabase credentials

5. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

**POST /api/auth/signup**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**GET /api/auth/profile**
Headers: `Authorization: Bearer <token>`

## Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `NODE_ENV` - Environment (development/production)
