# Supabase Setup Guide

This guide will help you set up your Supabase database for the YouTube Stats Chainlink Adapter.

## Your Supabase Project Details

Based on your service role key, your Supabase project details are:
- **Project URL**: `https://wnclwwvnyxmtkcukjrlc.supabase.co`
- **Project Ref**: `wnclwwvnyxmtkcukjrlc`

## Step 1: Access Your Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in to your account
3. Select your project: `wnclwwvnyxmtkcukjrlc`

## Step 2: Run the SQL Migration

1. In your Supabase dashboard, click on the **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)

The script will create:
- ✅ `adapter_state` table with all required columns
- ✅ Indexes for better performance
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamp updates
- ✅ A view to monitor recent state changes

## Step 3: Verify the Table Was Created

1. Click on **"Table Editor"** in the left sidebar
2. You should see the `adapter_state` table listed
3. Click on it to view its structure

The table should have these columns:
- `id` (text, primary key) - Video ID
- `last_views_count` (int4) - Last recorded view count
- `last_likes_count` (int4) - Last recorded like count
- `last_likes_triggered_multiple` (int4) - Last triggered multiple for likes
- `updated_at` (timestamptz) - Last update timestamp
- `created_at` (timestamptz) - Creation timestamp

## Step 4: Configure Your Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   PORT=8080
   YOUTUBE_API_KEY=your_youtube_api_key_here
   SUPABASE_URL=https://wnclwwvnyxmtkcukjrlc.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduY2x3d3ZueXhtdGtjdWtqcmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1NDI1MSwiZXhwIjoyMDc2ODMwMjUxfQ.KLbUGzoFKB7y4wFyywPP_gkulNOulC0bF4WDY-54Ac0
   INITIAL_LIKES_COUNT=0
   ```

   **Note**: You're using the `service_role` key which has full database access. This is correct for server-side operations but keep it secure!

## Step 5: Get Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to **APIs & Services** > **Library**
   - Search for "YouTube Data API v3"
   - Click **Enable**
4. Create credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **API Key**
   - Copy the API key and add it to your `.env` file

## Step 6: Test Your Setup

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Test with a sample request:
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

4. Verify data in Supabase:
   - Go to **Table Editor** > `adapter_state`
   - You should see a new row with the video ID and stats

## Monitoring Your Data

You can use the `adapter_state_recent` view to monitor recent activity:

```sql
SELECT * FROM adapter_state_recent;
```

This view shows:
- All video IDs being tracked
- Their current stats
- How long since they were last updated

## Troubleshooting

### Error: "relation 'adapter_state' does not exist"
- Make sure you ran the SQL migration script in Step 2
- Check that you're connected to the correct Supabase project

### Error: "SUPABASE_URL or SUPABASE_ANON_KEY is not set"
- Verify your `.env` file exists in the project root
- Check that the environment variables are correctly set
- Restart your server after updating `.env`

### Error: "Failed to fetch YouTube data"
- Verify your YouTube API key is correct
- Make sure the YouTube Data API v3 is enabled in your Google Cloud project
- Check that you haven't exceeded your YouTube API quota

### RLS Policy Issues
- If you're having permission issues, the SQL script includes a policy that allows all operations
- With the `service_role` key, RLS policies are bypassed by default

## Security Best Practices

⚠️ **Important Security Notes**:
1. **Never commit your `.env` file** to version control
2. **Keep your service_role key secret** - it has full database access
3. Consider using the `anon` key with proper RLS policies for production
4. Regularly rotate your API keys
5. Use environment-specific configurations for development/staging/production

## Next Steps

Once your database is set up and your environment is configured:
1. Deploy your adapter to your preferred hosting platform (GCP Cloud Run, Heroku, etc.)
2. Configure your Chainlink node to use this external adapter
3. Set up monitoring and logging for production use

## Need Help?

If you encounter any issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test your Supabase connection using the Supabase dashboard
4. Ensure your YouTube API key has the necessary permissions

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Chainlink External Adapters Documentation](https://docs.chain.link/chainlink-nodes/external-adapters/external-adapters)
