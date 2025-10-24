# YouTube Stats Chainlink External Adapter

A complete Chainlink integration that fetches YouTube video statistics (views and likes) and manages state using Supabase. Includes both an **External Adapter** (off-chain) and a **Smart Contract** (on-chain) for end-to-end functionality.

## 🏗️ Architecture

This project consists of two main components:

1. **External Adapter** (`server.js`) - Off-chain Node.js service that:
   - Fetches YouTube API data
   - Manages state in Supabase
   - Responds to Chainlink oracle requests

2. **Smart Contract** (`contracts/YouTubeOracleConsumer.sol`) - On-chain Solidity contract that:
   - Makes Chainlink oracle requests
   - Receives YouTube statistics on-chain
   - Triggers events at configurable thresholds
   - Works with Chainlink subscriptions

## ✨ Features

- 🎥 Fetches real-time YouTube video statistics (views and likes)
- 💾 Persistent state management using Supabase
- 🔔 Configurable trigger thresholds:
  - **Views**: Triggers at 525 views, then every 5 views thereafter
  - **Likes**: Triggers at every 25 likes milestone
- 🔄 Supports multiple video IDs with independent state tracking
- 🚀 Express-based REST API compatible with Chainlink node requests
- ⛓️ Production-ready Solidity smart contract
- 📊 Chainlink subscription support (Subscription #532 ready)

## 📦 What's Included

```
/workspace/
├── server.js                           # External Adapter (off-chain)
├── contracts/
│   └── YouTubeOracleConsumer.sol      # Smart Contract (on-chain)
├── scripts/
│   ├── deploy.js                       # Hardhat deployment script
│   └── add-consumer.js                 # Add contract to Chainlink subscription
├── hardhat.config.js                   # Hardhat configuration
├── CHAINLINK_DEPLOYMENT.md             # Comprehensive deployment guide
├── SUBSCRIPTION_532_SETUP.md           # Quick start for subscription 532
├── SUPABASE_SETUP.md                   # Database setup guide
└── package.json                        # Dependencies & scripts
```

## 🚀 Quick Start

### ⚡ Deployed Contract Ready!

**Your Oracklez contract is already deployed:**  
Contract: `0xD66544E49c7407AcdE0a577BFB176f950a18DAAA`  
Network: Arbitrum Sepolia  

**➡️ [QUICK SETUP GUIDE](./QUICK_SETUP.md)** - Get started in 3 steps!  
**➡️ [IMPLEMENTATION GUIDE](./ORACLEZ_IMPLEMENTATION.md)** - Full integration docs

### For New Deployments

1. **Setup External Adapter** (Off-chain service)
2. **Deploy Smart Contract** (On-chain consumer)
3. **Configure Chainlink Jobs**
4. **Connect & Test**

See the full guide: **[CHAINLINK_DEPLOYMENT.md](./CHAINLINK_DEPLOYMENT.md)**

## Prerequisites

### External Adapter (Off-chain)
- Node.js (>= 14.0.0)
- YouTube Data API v3 key
- Supabase account and project

### Smart Contract (On-chain)
- MetaMask or Web3 wallet
- Sepolia testnet ETH (for gas)
- Chainlink subscription or LINK tokens
- Hardhat (for deployment)

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

Create a table in your Supabase project with the following schema:

```sql
CREATE TABLE adapter_state (
    id TEXT PRIMARY KEY,
    last_views_count INTEGER DEFAULT 0,
    last_likes_count INTEGER DEFAULT 0,
    last_likes_triggered_multiple INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE adapter_state ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust based on your security needs)
CREATE POLICY "Enable all operations for authenticated users"
ON adapter_state
FOR ALL
USING (true)
WITH CHECK (true);
```

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

## 🔗 Smart Contract Deployment

### Using Hardhat

```bash
# Install Hardhat dependencies
npm install

# Compile contracts
npm run compile

# Configure environment
cp .env.example .env
# Add: PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY

# Deploy to Sepolia
npm run deploy

# Add contract to subscription 532
npm run add-consumer
```

### Using Remix

1. Open [Remix IDE](https://remix.ethereum.org)
2. Copy `contracts/YouTubeOracleConsumer.sol`
3. Compile with Solidity 0.8.7+
4. Deploy to Sepolia with constructor parameters
5. Add contract address to subscription 532

**Detailed instructions:** [CHAINLINK_DEPLOYMENT.md](./CHAINLINK_DEPLOYMENT.md)

## 🎯 Integration with Chainlink

### Complete Flow

```
1. Smart Contract (on-chain)
   └─> Makes Chainlink request
2. Chainlink Oracle
   └─> Triggers Chainlink Node
3. Chainlink Node
   └─> Executes job → calls external adapter
4. External Adapter (this server)
   └─> Fetches YouTube data
   └─> Saves state to Supabase
   └─> Returns data to node
5. Chainlink Node
   └─> Fulfills on-chain request
6. Smart Contract
   └─> Receives data & emits events
```

### Bridge Configuration

Create a bridge in your Chainlink node:

```json
{
  "name": "youtube-stats",
  "url": "https://your-adapter-url.com"
}
```

### Job Specifications

See [CHAINLINK_DEPLOYMENT.md](./CHAINLINK_DEPLOYMENT.md) for complete job specs for both views and likes endpoints.

## Environment Variables

### External Adapter

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| PORT | No | Server port | 8080 |
| YOUTUBE_API_KEY | Yes | YouTube Data API v3 key | - |
| SUPABASE_URL | Yes | Supabase project URL | - |
| SUPABASE_ANON_KEY | Yes | Supabase anonymous key | - |
| INITIAL_LIKES_COUNT | No | Initial likes count for new videos | 0 |

### Smart Contract Deployment

| Variable | Required | Description |
|----------|----------|-------------|
| PRIVATE_KEY | Yes | Wallet private key for deployment |
| SEPOLIA_RPC_URL | Yes | Sepolia RPC endpoint (Infura/Alchemy) |
| ETHERSCAN_API_KEY | No | For contract verification |
| VIEWS_JOB_ID | No | Chainlink job ID for views (or use 0x0 placeholder) |
| LIKES_JOB_ID | No | Chainlink job ID for likes (or use 0x0 placeholder) |
| YOUTUBE_VIDEO_ID | No | Default video to track (default: "dQw4w9WgXcQ") |
| CONSUMER_ADDRESS | No | For add-consumer script |

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

## 📚 Documentation

- **[CHAINLINK_DEPLOYMENT.md](./CHAINLINK_DEPLOYMENT.md)** - Complete deployment guide
- **[SUBSCRIPTION_532_SETUP.md](./SUBSCRIPTION_532_SETUP.md)** - Quick start for subscription 532
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Database setup guide
- **[START_GUIDE.md](./START_GUIDE.md)** - External adapter quick start
- **[DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)** - Post-setup checklist

## 🧪 Testing

### Test External Adapter

```bash
npm start

# In another terminal
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"id":"test","data":{"videoId":"dQw4w9WgXcQ","endpoint":"views"}}'
```

### Test Smart Contract

```bash
# Using Hardhat
npx hardhat console --network sepolia

# In console:
const contract = await ethers.getContractAt("YouTubeOracleConsumer", "YOUR_ADDRESS");
await contract.requestViews();
await contract.latestViews(); // Check after 1-2 minutes
```

## 🛠️ NPM Scripts

```bash
# External Adapter
npm start              # Start adapter server
npm run dev            # Start with auto-reload

# Smart Contract
npm run compile        # Compile Solidity contracts
npm run deploy         # Deploy to Sepolia
npm run add-consumer   # Add contract to subscription 532
npm test               # Run tests
```

## 🔐 Security

- ✅ `.gitignore` protects sensitive files
- ✅ Environment variables for all secrets
- ✅ Supabase Row Level Security enabled
- ✅ Smart contract uses OpenZeppelin libraries
- ✅ Owner-only functions protected

**Never commit:**
- `.env` file
- Private keys
- API keys

## 📊 Monitoring

- **Smart Contract**: [Sepolia Etherscan](https://sepolia.etherscan.io/)
- **Subscription**: [Chainlink VRF Manager](https://vrf.chain.link/)
- **Database**: [Supabase Dashboard](https://app.supabase.com/)
- **Adapter Logs**: Check server console or logs

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT

## 💬 Support

For issues and questions:
- Open an issue in the repository
- Check documentation files listed above
- Review Chainlink docs: https://docs.chain.link/
