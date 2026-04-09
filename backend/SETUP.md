# Backend Setup Guide

## Step 1: Get Supabase Credentials (5 minutes)

### Create Supabase Account
1. Go to **https://supabase.com**
2. Click "Start your project" or "Sign In"
3. Sign up with GitHub, Google, or Email

### Create New Project
1. Click "New Project"
2. Fill in:
   - **Name**: `strategy-lab` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### Get API Credentials
1. In your project dashboard, click the **Settings** icon (⚙️) in the sidebar
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **API Keys** section with `anon` `public` key

4. Copy these values to your `.env` file:
   ```
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Create Database Tables
1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click "New query"
3. Copy the entire content from `backend/database-setup.sql` file
4. Paste it into the SQL Editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see "Success" messages

This will create:
- `users` table - For user accounts
- `discussions` table - For community discussions
- `discussion_replies` table - For replies to discussions
- `discussion_likes` table - To track likes

## Step 2: Configure Backend

Your `.env` file should look like this:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345678
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Install & Run

```bash
# Install dependencies
cd backend
npm install

# Start server
npm start
```

You should see:
```
🚀 Server running on http://localhost:3001
📝 Health check: http://localhost:3001/health
```

## Step 4: Test API

Open browser or use curl:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","message":"Server is running"}
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env` file exists in `backend/` folder
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are filled in

### Error: "relation 'users' does not exist"
- You forgot to create the users table
- Go back to Supabase SQL Editor and run the CREATE TABLE command

### Error: "Invalid API key"
- Double-check you copied the `anon` `public` key (not the `service_role` key)
- Make sure there are no extra spaces in the `.env` file

## Next Steps

Once backend is running, start the frontend:
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173
