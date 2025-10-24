# 🔄 Server Update Guide - Important Changes!

## 🚨 Important: Your New Contract Doesn't Need server.js!

Your deployed contract `0xD66544E49c7407AcdE0a577BFB176f950a18DAAA` uses **Chainlink Functions**, which is **serverless**. 

**You can STOP the old `server.js` external adapter!** ✅

---

## 📊 What Changed?

| Old Setup (server.js) | New Setup (Chainlink Functions) |
|----------------------|----------------------------------|
| Needs external adapter running | ❌ **No server needed!** |
| Uses `server.js` + Supabase | ✅ JavaScript runs in Chainlink DON |
| Requires Chainlink node | ✅ Serverless |
| Contract: YouTubeOracleConsumer | ✅ Contract: YouTubeOracleFunctions |
| Network: Sepolia | ✅ Network: Arbitrum Sepolia |

---

## 🛑 Step 1: Stop the Old Server

On your server, run:

```bash
# Find the PM2 process
pm2 list

# Stop the youtube-adapter
pm2 stop youtube-adapter

# Optional: Delete it
pm2 delete youtube-adapter
```

---

## 📥 Step 2: Update Your Server Repository

SSH into your server and pull the latest changes:

```bash
# Navigate to your Oracklez directory
cd ~/Oraclez  # or wherever you have it

# Check current branch
git branch

# Pull latest changes
git fetch origin
git pull origin main

# Or if you're on a feature branch, merge main
git merge origin/main
```

---

## 📦 Step 3: Install New Dependencies

```bash
npm install
```

---

## 🎯 Step 4: Use the New Contract

Your new contract is **already deployed** and ready:

**Contract**: `0xD66544E49c7407AcdE0a577BFB176f950a18DAAA`  
**Network**: Arbitrum Sepolia  
**No server needed!**

---

## ✅ Step 5: Set Up (One Time)

From your server or local machine:

```bash
# 1. Check status
npm run oracle:status

# 2. Set JavaScript source code (one time only)
npm run oracle:setup

# 3. Add to subscription 532 (if not done)
npm run oracle:add-consumer

# 4. Upload YouTube API key as secret
# Go to: https://functions.chain.link/arbitrum-sepolia/532
# Add secret: apiKey = YOUR_YOUTUBE_API_KEY
```

---

## 🧪 Step 6: Test It!

```bash
# Request views
npm run oracle:request

# Wait 1-2 minutes, then check
npm run oracle:status
```

---

## 🌐 Optional: Run Web Dashboard

The new setup includes a web dashboard:

```bash
# Install serve (if not already installed)
npm install -g serve

# Launch dashboard
npm run web

# Open in browser: http://YOUR_SERVER_IP:3000
```

---

## 📋 Full Update Commands (Copy-Paste)

Run these on your server:

```bash
# Stop old server
pm2 stop youtube-adapter
pm2 delete youtube-adapter

# Navigate to repo
cd ~/Oraclez

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Check oracle status
npm run oracle:status

# Set up (if not done)
npm run oracle:setup

# Test
npm run oracle:request
```

---

## 🔍 Verify You Have Latest Files

Check that these files exist:

```bash
ls -la ORACLEZ_IMPLEMENTATION.md
ls -la QUICK_SETUP.md
ls -la scripts/check-status.js
ls -la scripts/set-source-code.js
ls -la public/index.html
```

If any are missing, you need to pull again!

---

## 💡 Understanding the New Architecture

### Old Way (External Adapter)
```
Contract → Chainlink Node → Your Server (server.js) → YouTube API
                              ↓
                          Supabase
```

### New Way (Chainlink Functions)
```
Contract → Chainlink Functions DON → YouTube API
           (JavaScript runs in DON)
```

**Benefits:**
- ✅ No server to maintain
- ✅ No Supabase needed (state in contract)
- ✅ No Node.js hosting costs
- ✅ Fully decentralized
- ✅ Lower latency

---

## 🎮 How to Use Your Oracle Now

### Reading Data (FREE - No Gas!)

From anywhere (no server needed):

```javascript
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia-rollup.arbitrum.io/rpc"
);

const contract = new ethers.Contract(
  "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA",
  ["function latestViews() view returns (uint256)"],
  provider
);

const views = await contract.latestViews();
console.log("Views:", views.toString());
```

### Requesting Updates (Requires Wallet)

```bash
# From CLI
npm run oracle:request

# Or from Hardhat console
npx hardhat console --network arbitrumSepolia
> const contract = await ethers.getContractAt("YouTubeOracleFunctions", "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA")
> await contract.requestViews()
```

---

## 🔗 Important Links

- **Your Contract**: https://sepolia.arbiscan.io/address/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
- **Subscription 532**: https://functions.chain.link/arbitrum-sepolia/532
- **Setup Guide**: Read `QUICK_SETUP.md`
- **Full Docs**: Read `ORACLEZ_IMPLEMENTATION.md`

---

## ❓ FAQ

### Do I still need server.js running?
**No!** Your new contract uses Chainlink Functions. You can stop the server.

### What about Supabase?
**Not needed anymore!** State is managed in the smart contract.

### Can I still use the old contract?
Yes, but the old contract requires a Chainlink node. The new contract is serverless and better!

### How do I track different videos?
```bash
npx hardhat console --network arbitrumSepolia
> const contract = await ethers.getContractAt("YouTubeOracleFunctions", "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA")
> await contract.updateVideoId("NEW_VIDEO_ID")
```

### Where's the YouTube API key stored?
In Chainlink Functions subscription secrets (encrypted, secure). Upload at:
https://functions.chain.link/arbitrum-sepolia/532

---

## 🎉 Summary

1. ✅ **Stop old server**: `pm2 stop youtube-adapter`
2. ✅ **Pull latest code**: `git pull origin main`
3. ✅ **Use new contract**: `0xD66544E49c7407AcdE0a577BFB176f950a18DAAA`
4. ✅ **No server needed**: Chainlink Functions is serverless!
5. ✅ **Test it**: `npm run oracle:request`

**Your oracle is now fully serverless!** 🚀
