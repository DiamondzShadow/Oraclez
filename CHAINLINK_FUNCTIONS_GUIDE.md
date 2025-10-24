# 🚀 Chainlink Functions Deployment Guide

## 📋 Your Configuration

```
✅ Network: Arbitrum Sepolia
✅ Subscription ID: 532
✅ DON ID: fun-arbitrum-sepolia-1
✅ Functions Router: 0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C
✅ LINK Token: 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E
✅ YouTube Video ID: LQAFm01IOT0
✅ Deployed Contract: 0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
```

## 🎯 What Changed

Your original contract (`YouTubeOracleConsumer.sol`) was built for **Chainlink Any API** which requires running a Chainlink node. 

The new contract (`YouTubeOracleFunctions.sol`) uses **Chainlink Functions** which:
- ✅ No node required (serverless)
- ✅ Uses JavaScript instead of external adapter
- ✅ Works with your subscription 532
- ✅ Runs on Arbitrum Sepolia

## 🚀 Quick Deployment (5 Steps)

### Step 1: Install Dependencies

```bash
cd /workspace
npm install @chainlink/contracts
```

### Step 2: Set Environment Variables

Create/update `.env` file:

```env
# Your wallet private key (for deployment)
PRIVATE_KEY=your_private_key_here

# Arbitrum Sepolia RPC (public endpoint works)
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# YouTube API key (for the Functions script)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Your video ID
YOUTUBE_VIDEO_ID=LQAFm01IOT0

# Optional: For contract verification
ARBISCAN_API_KEY=your_arbiscan_key_here
```

### Step 3: Compile the Contract

```bash
npx hardhat compile
```

### Step 4: Deploy the Contract

```bash
npx hardhat run scripts/deploy-functions.js --network arbitrumSepolia
```

This will:
- ✅ Deploy the contract to Arbitrum Sepolia
- ✅ Set the JavaScript source code
- ✅ Give you the contract address

**SAVE THE CONTRACT ADDRESS!**

### Step 5: Add Contract as Consumer

**Option A - Using Chainlink UI (Recommended):**

1. Go to https://functions.chain.link/
2. Connect your wallet (Arbitrum Sepolia network)
3. Find subscription **#532**
4. Click **"Add Consumer"**
5. Enter your deployed contract address
6. Confirm transaction

**Option B - Using Script:**

```bash
export CONSUMER_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia
```

### Step 6: Upload YouTube API Key as Secret

1. Go to https://functions.chain.link/
2. Select subscription **#532**
3. Go to **"Secrets"** tab
4. Click **"Add Secret"**
5. Enter:
   - **Key**: `apiKey`
   - **Value**: Your YouTube API key
6. Confirm transaction

---

## 🧪 Testing Your Contract

### Using Remix IDE

1. Go to https://remix.ethereum.org
2. Connect MetaMask to **Arbitrum Sepolia**
3. Go to "Deploy & Run Transactions"
4. Select "At Address" and enter your contract address
5. Call functions:

**To fetch views:**
```solidity
requestViews()  // Wait 1-2 minutes, then check:
latestViews()   // Should show YouTube views!
```

**To fetch likes:**
```solidity
requestLikes()  // Wait 1-2 minutes, then check:
latestLikes()   // Should show YouTube likes!
```

### Using Hardhat Console

```bash
npx hardhat console --network arbitrumSepolia
```

```javascript
const contract = await ethers.getContractAt(
  "YouTubeOracleFunctions", 
  "YOUR_CONTRACT_ADDRESS"
);

// Request views
await contract.requestViews();
// Wait 1-2 minutes...

// Check result
const views = await contract.latestViews();
console.log("Views:", views.toString());

// Check video ID
const videoId = await contract.youtubeVideoId();
console.log("Video ID:", videoId);
```

### Using Etherscan

1. Go to https://sepolia.arbiscan.io/address/YOUR_CONTRACT_ADDRESS
2. Go to **"Write Contract"** tab
3. Connect your wallet
4. Call `requestViews()` or `requestLikes()`
5. Wait 1-2 minutes
6. Go to **"Read Contract"** tab
7. Check `latestViews()` or `latestLikes()`

---

## 📊 How It Works

### The Flow

```
1. You call requestViews() on your contract
   ↓
2. Contract sends request to Functions DON
   ↓
3. DON executes functions-source.js in a secure sandbox
   ↓
4. JavaScript code fetches data from YouTube API
   ↓
5. Data is returned to DON
   ↓
6. DON calls fulfillRequest() on your contract
   ↓
7. Your contract updates latestViews and emits events! 🎉
```

### The JavaScript Code

The JavaScript in `functions-source.js` runs in the Chainlink Functions DON:

```javascript
// Takes args: [videoId, endpoint]
const videoId = args[0];      // "LQAFm01IOT0"
const endpoint = args[1];     // "views" or "likes"

// Fetches from YouTube API using your secret API key
const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${secrets.apiKey}`;

// Returns the count as uint256
return Functions.encodeUint256(BigInt(value));
```

---

## 🛠️ Contract Functions

### Owner Functions (Only you can call)

```solidity
requestViews()                    // Fetch current views
requestLikes()                    // Fetch current likes
updateVideoId(string newId)       // Change tracked video
updateSubscriptionId(uint64 id)   // Change subscription
setSourceCode(string code)        // Update JavaScript code
```

### View Functions (Anyone can call, free)

```solidity
latestViews()                     // Get latest views count
latestLikes()                     // Get latest likes count
youtubeVideoId()                  // Get current video ID
getTriggers()                     // Get next trigger thresholds
subscriptionId()                  // Get subscription ID
lastRequestId()                   // Get last request ID
lastResponse()                    // Get last raw response
lastError()                       // Get last error (if any)
```

### Events

```solidity
event Response(bytes32 requestId, bytes response, bytes err)
event ViewsUpdated(uint256 newViews, bytes32 requestId)
event LikesUpdated(uint256 newLikes, bytes32 requestId)
event ViewsTriggerMet(uint256 viewsCount)   // Triggers at 525, 530, 535...
event LikesTriggerMet(uint256 likesCount)   // Triggers at 25, 50, 75...
```

---

## 💰 Costs

### Per Request
- **LINK Cost**: ~0.1-0.3 LINK per request (depends on DON)
- **Gas Cost**: ~100k-300k gas on Arbitrum Sepolia

### Your Subscription
- Check balance at https://functions.chain.link/
- Top up with LINK when needed

---

## 🔧 Advanced: Update Video ID

To track a different video:

```javascript
// New video URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
// Video ID: dQw4w9WgXcQ

await contract.updateVideoId("dQw4w9WgXcQ");
```

---

## 🔧 Advanced: Update JavaScript Code

If you need to modify the JavaScript logic:

1. Edit `functions-source.js`
2. Read the updated code:
```javascript
const fs = require("fs");
const newCode = fs.readFileSync("functions-source.js", "utf8");
await contract.setSourceCode(newCode);
```

---

## 🐛 Troubleshooting

### Request Not Fulfilled

**Check:**
1. ✅ Contract added as consumer to subscription 532?
2. ✅ YouTube API key uploaded as secret `apiKey`?
3. ✅ Subscription has LINK balance?
4. ✅ Waited 1-2 minutes?

**View logs:**
- Check `lastError()` in contract
- Check Events tab on Arbiscan
- Check subscription history on functions.chain.link

### "Consumer not added" Error

**Solution:**
```bash
npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia YOUR_CONTRACT_ADDRESS
```

### Wrong Data Returned

**Check:**
1. Video ID is correct: `await contract.youtubeVideoId()`
2. API key is valid (test it: https://www.googleapis.com/youtube/v3/videos?part=statistics&id=LQAFm01IOT0&key=YOUR_KEY)
3. Video is public (not private/unlisted)

### JavaScript Errors

**Check `lastError()`:**
```javascript
const error = await contract.lastError();
console.log(ethers.utils.toUtf8String(error));
```

Common errors:
- `Missing videoId parameter` → JavaScript args issue
- `Video not found` → Invalid video ID
- `YouTube API request failed` → API key issue

---

## 📚 Resources

- **Chainlink Functions Docs**: https://docs.chain.link/chainlink-functions
- **Functions UI**: https://functions.chain.link/
- **Arbitrum Sepolia Explorer**: https://sepolia.arbiscan.io/
- **YouTube API Docs**: https://developers.google.com/youtube/v3

---

## 🎯 Key Differences from Old Contract

| Old (Any API) | New (Functions) |
|---------------|-----------------|
| ChainlinkClient | FunctionsClient |
| Job IDs (bytes32) | JavaScript source code |
| Needs Chainlink node | No node needed |
| External adapter (server.js) | JavaScript runs in DON |
| Sepolia | Arbitrum Sepolia |
| Subscription not required | Subscription required |

---

## ✅ Deployment Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Set environment variables in `.env`
- [ ] Compile contracts (`npx hardhat compile`)
- [ ] Deploy contract (`npx hardhat run scripts/deploy-functions.js --network arbitrumSepolia`)
- [ ] Save contract address
- [ ] Add contract as consumer to subscription 532
- [ ] Upload YouTube API key as secret `apiKey`
- [ ] Test with `requestViews()`
- [ ] Verify data in `latestViews()`
- [ ] Celebrate! 🎉

---

## 🚀 Ready to Deploy?

```bash
# 1. Install
npm install

# 2. Configure .env
nano .env  # Add PRIVATE_KEY and YOUTUBE_API_KEY

# 3. Deploy
npx hardhat run scripts/deploy-functions.js --network arbitrumSepolia

# 4. Add consumer (use contract address from step 3)
npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia YOUR_CONTRACT_ADDRESS

# 5. Upload API key as secret at https://functions.chain.link/

# 6. Test!
```

**Need help?** Check the troubleshooting section or open an issue!
