# 🎉 Your Chainlink YouTube Adapter is Ready!

## ✅ What's Been Set Up

1. **Supabase Database**: ✅ Table `adapter_state` created successfully
2. **Environment File**: ✅ `.env` configured with Supabase credentials
3. **Dependencies**: ✅ All npm packages installed
4. **Server Code**: ✅ Ready to run with Supabase integration

## 🔑 Add Your YouTube API Key

**You need to add a YouTube API key to start using the adapter.**

### Get your YouTube API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - APIs & Services → Library
   - Search "YouTube Data API v3"
   - Click Enable
4. Create API Key:
   - APIs & Services → Credentials
   - Create Credentials → API Key
   - Copy the key

### Add it to your .env file:

Edit `/workspace/.env` and replace this line:
```
YOUTUBE_API_KEY=
```

With your actual key:
```
YOUTUBE_API_KEY=AIzaSyC... (your key here)
```

## 🚀 Start the Server

```bash
cd /workspace
node server.js
```

Or use pm2 for production:
```bash
pm2 start server.js --name youtube-adapter
pm2 logs youtube-adapter
```

## 🧪 Test the Adapter

Once running, test with:

```bash
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

## 📊 Check Supabase Data

View your data in Supabase:
1. Go to: https://app.supabase.com/ and select your project
2. Click "Table Editor"
3. Open `adapter_state` table
4. See your video stats being tracked!

## 🔧 Your Credentials

All credentials are stored securely in your `.env` file:
- **Supabase URL**: Found in Settings > API in your Supabase dashboard
- **Anon Key**: Found in Settings > API (anon/public key)
- **Database Password**: Found in Settings > Database
- **YouTube API Key**: From Google Cloud Console

⚠️ **Never commit your `.env` file to git!**

## 📝 How It Works

1. **State Persistence**: Every request saves video stats to Supabase
2. **Survives Restarts**: State is loaded from database on startup
3. **Multi-Video Support**: Tracks multiple videos independently
4. **Trigger Logic**:
   - Views: Triggers at 525, then every 5 views
   - Likes: Triggers every 25 likes (25, 50, 75, 100...)

## 🎯 Next Steps

1. Add your YouTube API key to `.env`
2. Start the server
3. Test with a real video ID
4. Check Supabase to see data persisting
5. Integrate with your Chainlink node

---

Need help? Check the logs and verify all environment variables are set correctly!
