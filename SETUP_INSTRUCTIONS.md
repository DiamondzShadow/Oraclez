# 🚀 Quick Setup Instructions - Supabase Tables

Your tables are empty because they haven't been created yet. Due to network restrictions in this environment, I can't connect directly to your database, but I'll guide you through the simple manual setup.

## ⚡ Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

Click this link to go directly to your SQL editor:
**https://app.supabase.com/project/wnclwwvnyxmtkcukjrlc/sql/new**

### Step 2: Copy and Paste the SQL Script

1. Open the file `supabase-setup.sql` in this project
2. Copy **ALL** the contents (Ctrl+A, Ctrl+C)
3. Paste into the Supabase SQL Editor
4. Click the **"Run"** button (or press Ctrl+Enter)

### Step 3: Verify Table Creation

After running the script, you should see:
- ✅ Success message in the SQL editor
- ✅ A new table called `adapter_state` in your Table Editor

You can verify by going to:
**https://app.supabase.com/project/wnclwwvnyxmtkcukjrlc/editor**

## 🎯 What the SQL Script Does

The script will create:
1. **adapter_state table** - Stores YouTube video statistics and state
2. **Indexes** - For better query performance
3. **RLS Policies** - Security policies allowing your service key to access data
4. **Triggers** - Automatically updates timestamps
5. **View** - For easy monitoring of recent changes

## 📋 Next Steps After Setup

Once your table is created:

### 1. Create your .env file

```bash
cp .env.example .env
```

Or create a new `.env` file with this content:

```env
PORT=8080
YOUTUBE_API_KEY=your_youtube_api_key_here
SUPABASE_URL=https://wnclwwvnyxmtkcukjrlc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduY2x3d3ZueXhtdGtjdWtqcmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1NDI1MSwiZXhwIjoyMDc2ODMwMjUxfQ.KLbUGzoFKB7y4wFyywPP_gkulNOulC0bF4WDY-54Ac0
INITIAL_LIKES_COUNT=0
```

### 2. Get Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**
4. Create an API Key
5. Add it to your `.env` file

### 3. Test Your Setup

```bash
# Install dependencies
npm install

# Start the server
npm start

# Test with a sample request
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

### 4. Verify Data in Supabase

After testing, check your Supabase Table Editor:
**https://app.supabase.com/project/wnclwwvnyxmtkcukjrlc/editor**

You should see a new row in `adapter_state` with your test video data!

## 🔧 Troubleshooting

### "Table 'adapter_state' not found"
- ✅ Go back to Step 1 and run the SQL script
- ✅ Make sure you clicked "Run" in the SQL editor
- ✅ Check for any errors in the SQL editor output

### "SUPABASE_URL or SUPABASE_ANON_KEY is not set"
- ✅ Make sure your `.env` file exists in the project root
- ✅ Verify the contents match the template above
- ✅ Restart your server after creating/editing `.env`

### "Failed to fetch YouTube data"
- ✅ Verify your YouTube API key is correct
- ✅ Make sure YouTube Data API v3 is enabled in Google Cloud
- ✅ Check you haven't exceeded your API quota

## 📊 Monitoring Your Adapter

### View Recent Activity

In Supabase SQL Editor, run:
```sql
SELECT * FROM adapter_state_recent;
```

This shows:
- All tracked video IDs
- Current view and like counts
- Last update times
- How long since last update

### Check Specific Video

```sql
SELECT * FROM adapter_state WHERE id = 'YOUR_VIDEO_ID';
```

## 🎉 You're All Set!

Once you've completed these steps:
- ✅ Tables are created
- ✅ Environment variables configured
- ✅ YouTube API key added
- ✅ Adapter tested and working
- ✅ Data visible in Supabase

Your Chainlink External Adapter is ready to track YouTube statistics!

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Chainlink External Adapters](https://docs.chain.link/chainlink-nodes/external-adapters/external-adapters)

---

**Need Help?** Check the error messages in your server logs - they'll tell you exactly what's missing or misconfigured.
