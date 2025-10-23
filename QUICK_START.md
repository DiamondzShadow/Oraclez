# 🚀 Quick Start - Supabase Setup Complete!

Your Supabase configuration files have been created! Here's what to do next:

## ✅ Files Created

1. **`supabase-setup.sql`** - SQL script to create your database table
2. **`.env`** - Environment configuration with your Supabase credentials
3. **`.env.example`** - Template for environment variables
4. **`SUPABASE_SETUP.md`** - Detailed setup guide

## 📋 Next Steps (3 minutes)

### Step 1: Create the Database Table (1 min)

1. Go to your Supabase dashboard: https://app.supabase.com/ and select your project
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy and paste the entire contents of `supabase-setup.sql`
5. Click **"Run"** (or press Ctrl+Enter)

You should see a success message!

### Step 2: Get Your YouTube API Key (2 min)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create or select a project
3. Enable **YouTube Data API v3** (if not already enabled)
4. Create an **API Key**
5. Copy the API key
6. Open `.env` and replace `your_youtube_api_key_here` with your actual key

### Step 3: Test Your Setup (30 seconds)

```bash
# Install dependencies (if not done)
npm install

# Start the server
npm start

# In another terminal, test it:
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "data": {
      "videoId": "dQw4w9WgXcQ",
      "endpoint": "views"
    }
  }'
```

If you see a response with view counts, you're all set! 🎉

## 📊 Verify in Supabase

Go to your Supabase dashboard → **Table Editor** → `adapter_state`

You should see your test data there!

## 🔑 Your Configuration

- **Supabase URL**: Found in Settings > API in your Supabase dashboard
- **Service Role Key**: Should be configured in `.env`
- **Table Name**: `adapter_state`

## 🆘 Troubleshooting

### "relation 'adapter_state' does not exist"
→ Run the SQL script in Step 1

### "YOUTUBE_API_KEY is not set"
→ Add your YouTube API key to `.env` in Step 2

### "Failed to fetch YouTube data"
→ Verify your YouTube API key and that the API is enabled

## 📚 More Information

- See `SUPABASE_SETUP.md` for detailed documentation
- See `README.md` for full project documentation

## 🎯 What's Configured

✅ Supabase connection configured  
✅ Database table schema ready to deploy  
✅ Environment variables set up  
✅ Row Level Security policies included  
✅ Auto-updating timestamps  
✅ Indexes for performance  

You're ready to go! Just complete Steps 1 & 2 above and you'll be running! 🚀
