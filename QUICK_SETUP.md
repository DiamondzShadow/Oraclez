# ⚡ Oracklez YouTube Oracle - Quick Setup

Your contract is already deployed! Just 3 steps to get it working.

## 📍 Deployed Contract

**Address**: `0xD66544E49c7407AcdE0a577BFB176f950a18DAAA`  
**Network**: Arbitrum Sepolia  
**Subscription**: 532

---

## 🚀 3-Step Setup

### Step 1: Check Status

```bash
npm run oracle:status
```

This shows your current oracle status and configuration.

### Step 2: Set JavaScript Code

```bash
npm run oracle:setup
```

This uploads the JavaScript code that fetches YouTube data.

### Step 3: Request Data

```bash
npm run oracle:request
```

This requests the latest YouTube views. Wait 1-2 minutes, then check status again!

---

## 📊 Quick Commands

| Command | Description |
|---------|-------------|
| `npm run oracle:status` | Check oracle status & data |
| `npm run oracle:setup` | Set source code (one time) |
| `npm run oracle:request` | Request YouTube views |
| `npm run oracle:monitor` | Watch events in real-time |
| `npm run oracle:add-consumer` | Add contract to subscription |
| `npm run web` | Launch web dashboard |

---

## 🌐 Web Dashboard

Launch the web interface:

```bash
npm install -g serve
npm run web
```

Then open: http://localhost:3000

The dashboard lets you:
- ✅ Connect your MetaMask wallet
- ✅ View current YouTube stats on-chain
- ✅ Request updates with a click
- ✅ See real-time events

---

## ✅ Checklist

Before you can request data, make sure:

1. **Contract added to subscription?**
   ```bash
   npm run oracle:add-consumer
   ```
   Or check at: https://functions.chain.link/arbitrum-sepolia/532

2. **YouTube API key uploaded?**
   - Go to: https://functions.chain.link/arbitrum-sepolia/532
   - Click "Secrets" tab
   - Add secret: Key=`apiKey`, Value=`YOUR_YOUTUBE_API_KEY`

3. **Source code set?**
   ```bash
   npm run oracle:setup
   ```

4. **Have Arbitrum Sepolia ETH?**
   - Get from: https://faucet.quicknode.com/arbitrum/sepolia

---

## 🧪 Full Test Flow

```bash
# 1. Check current status
npm run oracle:status

# 2. Set up source code (if not done)
npm run oracle:setup

# 3. Add to subscription (if not done)
npm run oracle:add-consumer

# 4. Request views
npm run oracle:request

# 5. Wait 2 minutes...

# 6. Check updated status
npm run oracle:status
```

---

## 📱 Using in Your App

### With ethers.js

```javascript
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA";
const ABI = [
  "function latestViews() view returns (uint256)",
  "function latestLikes() view returns (uint256)",
  "function youtubeVideoId() view returns (string)"
];

const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia-rollup.arbitrum.io/rpc"
);

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Get latest views (free, no wallet needed)
const views = await contract.latestViews();
console.log("Views:", views.toString());

// Get latest likes (free, no wallet needed)
const likes = await contract.latestLikes();
console.log("Likes:", likes.toString());

// Get video ID (free, no wallet needed)
const videoId = await contract.youtubeVideoId();
console.log("Video:", videoId);
```

### With Hardhat Console

```bash
npx hardhat console --network arbitrumSepolia
```

```javascript
const contract = await ethers.getContractAt(
  "YouTubeOracleFunctions",
  "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA"
);

// Read data
await contract.latestViews();
await contract.latestLikes();
await contract.youtubeVideoId();

// Request update (owner only)
await contract.requestViews();
```

---

## 🔗 Useful Links

- **Contract**: https://sepolia.arbiscan.io/address/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
- **Subscription**: https://functions.chain.link/arbitrum-sepolia/532
- **Functions Docs**: https://docs.chain.link/chainlink-functions
- **Arbitrum Sepolia Faucet**: https://faucet.quicknode.com/arbitrum/sepolia

---

## 🐛 Common Issues

### "Consumer not allowed"
→ Run: `npm run oracle:add-consumer`

### "EmptySource"
→ Run: `npm run oracle:setup`

### "Insufficient funds"
→ Get Arbitrum Sepolia ETH from faucet

### Request not fulfilled after 2 minutes?
Check:
1. YouTube API key uploaded to subscription secrets
2. Contract has source code set
3. Contract is added to subscription 532

---

## 💡 Pro Tips

1. **Monitor in real-time**: Run `npm run oracle:monitor` while testing
2. **Use the web dashboard**: Easier than CLI commands
3. **Check Arbiscan events**: See all contract activity
4. **Read is free**: Viewing data costs no gas!

---

**Ready? Run `npm run oracle:status` to start! 🚀**
