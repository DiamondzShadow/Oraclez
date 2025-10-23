# YouTube Stats Chainlink External Adapter

A Chainlink External Adapter that fetches YouTube video statistics (views and likes) and manages state using Supabase. This adapter triggers events based on configurable thresholds for views and likes.

## 🚀 Quick Start

**New to this project?** Follow these simple steps:

1. **Set up your Supabase database**: See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for a step-by-step guide
2. **Configure environment**: Run `./quick-setup.sh` or manually copy `.env.example` to `.env`
3. **Install dependencies**: `npm install`
4. **Start the server**: `npm start`

📖 **Detailed setup guide**: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

## Features

- 🎥 Fetches real-time YouTube video statistics (views and likes)
- 💾 Persistent state management using Supabase
- 🔔 Configurable trigger thresholds:
  - **Views**: Triggers at 525 views, then every 5 views thereafter
  - **Likes**: Triggers at every 25 likes milestone
- 🔄 Supports multiple video IDs with independent state tracking
- 🚀 Express-based REST API compatible with Chainlink node requests

## Prerequisites

- Node.js (>= 14.0.0)
- YouTube Data API v3 key
- Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=8080
YOUTUBE_API_KEY=your_youtube_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
INITIAL_LIKES_COUNT=0
```

## Supabase Database Setup

**Important**: Run the complete SQL script from `supabase-setup.sql` in your Supabase SQL Editor.

The script will create:
- `adapter_state` table with all required columns
- Indexes for better performance
- Row Level Security (RLS) policies
- Automatic timestamp update triggers
- A view for monitoring recent changes

**Quick setup**:
1. Go to [your Supabase SQL Editor](https://app.supabase.com/project/wnclwwvnyxmtkcukjrlc/sql/new)
2. Copy and paste the contents of `supabase-setup.sql`
3. Click "Run"

For detailed instructions, see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

## Getting API Keys

### YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Go to Credentials and create an API key
5. Copy the API key to your `.env` file

### Supabase Configuration
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the `URL` and `anon/public` key to your `.env` file

## Usage

### Starting the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8080).

### API Endpoint

**POST /**

Request body format:
```json
{
  "id": "job-run-id",
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "endpoint": "views"
  }
}
```

Parameters:
- `id`: Chainlink job run ID
- `data.videoId`: YouTube video ID
- `data.endpoint`: Either "views" or "likes"

Response format:
```json
{
  "jobRunID": "job-run-id",
  "data": {
    "value": 1234,
    "views": 1234,
    "likes": 56,
    "shouldTrigger": true
  },
  "result": 1234,
  "statusCode": 200
}
```

### Testing with cURL

Test views endpoint:
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

Test likes endpoint:
```bash
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-456",
    "data": {
      "videoId": "dQw4w9WgXcQ",
      "endpoint": "likes"
    }
  }'
```

## How It Works

### Views Endpoint
- Tracks view counts for each video
- Triggers when:
  - Views reach 525 for the first time
  - Every 5 views after 525 (530, 535, 540, etc.)

### Likes Endpoint
- Tracks like counts for each video
- Triggers at every 25-like milestone (25, 50, 75, 100, etc.)

### State Management
- Each video ID has its own independent state stored in Supabase
- State includes:
  - Last views count
  - Last likes count
  - Last triggered multiple for likes
- State is loaded on first request and updated after each request
- All state changes are persisted to Supabase

## Integration with Chainlink

To use this adapter with a Chainlink node:

1. Deploy this adapter to a server accessible by your Chainlink node
2. Create a bridge in your Chainlink node pointing to this adapter's URL
3. Use the bridge in your job specifications
4. The adapter will return the appropriate data for your smart contracts

Example job specification snippet:
```toml
[type="bridge" name="youtube-stats" requestData="{\\"id\\": $(jobRun.id), \\"data\\": {\\"videoId\\": \\"YOUR_VIDEO_ID\\", \\"endpoint\\": \\"views\\"}}"]
```

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| PORT | No | Server port | 8080 |
| YOUTUBE_API_KEY | Yes | YouTube Data API v3 key | - |
| SUPABASE_URL | Yes | Supabase project URL | - |
| SUPABASE_ANON_KEY | Yes | Supabase anonymous key | - |
| INITIAL_LIKES_COUNT | No | Initial likes count for new videos | 0 |

## Error Handling

The adapter handles various error scenarios:
- Missing API keys
- Invalid video IDs
- YouTube API errors
- Supabase connection errors
- Invalid request parameters

All errors are logged and returned with appropriate HTTP status codes.

## Deployment

### Docker (Optional)

You can containerize this application using Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t youtube-stats-adapter .
docker run -p 8080:8080 --env-file .env youtube-stats-adapter
```

### Cloud Platforms

This adapter can be deployed to:
- Heroku
- Google Cloud Run
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Any platform supporting Node.js applications

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
