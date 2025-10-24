# 🎯 Oracklez YouTube Oracle - Implementation Guide

## Your Deployed Contract

**Contract Address**: `0xD66544E49c7407AcdE0a577BFB176f950a18DAAA`  
**Network**: Arbitrum Sepolia  
**Subscription**: #532  
**Video Tracking**: LQAFm01IOT0

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Verify Contract is Added to Subscription

Check if your contract is already a consumer:

```bash
# Visit Chainlink Functions UI
https://functions.chain.link/arbitrum-sepolia/532
```

**If not added**, run:
```bash
export CONSUMER_ADDRESS=0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia
```

### Step 2: Upload YouTube API Key as Secret

1. Go to https://functions.chain.link/arbitrum-sepolia/532
2. Connect your wallet
3. Click **"Secrets"** tab
4. Add secret:
   - **Key**: `apiKey`
   - **Value**: Your YouTube API key
5. Confirm transaction

### Step 3: Set Source Code (JavaScript)

The contract needs the JavaScript code to fetch YouTube data. Run this script:

```bash
npx hardhat run scripts/set-source-code.js --network arbitrumSepolia
```

---

## 🧪 Testing Your Oracle

### Option 1: Using Remix (Easiest)

1. Go to https://remix.ethereum.org
2. Connect MetaMask to **Arbitrum Sepolia**
3. Go to "Deploy & Run Transactions"
4. At "At Address", enter: `0xD66544E49c7407AcdE0a577BFB176f950a18DAAA`
5. Click "At Address"

**Test Functions:**
```solidity
// Check current video
youtubeVideoId()  // Should return: "LQAFm01IOT0"

// Request views
requestViews()    // Wait 1-2 minutes

// Check result
latestViews()     // Should show YouTube views!

// Request likes
requestLikes()    // Wait 1-2 minutes

// Check result
latestLikes()     // Should show YouTube likes!
```

### Option 2: Using Hardhat Console

```bash
npx hardhat console --network arbitrumSepolia
```

```javascript
const contract = await ethers.getContractAt(
  "YouTubeOracleFunctions",
  "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA"
);

// Check configuration
console.log("Video ID:", await contract.youtubeVideoId());
console.log("Subscription:", await contract.subscriptionId());

// Request views
const tx = await contract.requestViews();
await tx.wait();
console.log("Request sent! Wait 1-2 minutes...");

// After waiting, check results
const views = await contract.latestViews();
console.log("Views:", views.toString());

const likes = await contract.latestLikes();
console.log("Likes:", likes.toString());
```

### Option 3: Using Arbiscan

1. Go to https://sepolia.arbiscan.io/address/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
2. **Write Contract** tab → Connect wallet
3. Call `requestViews()` or `requestLikes()`
4. Wait 1-2 minutes
5. **Read Contract** tab → Check `latestViews()` or `latestLikes()`

---

## 📊 Contract Functions Reference

### Owner Functions (Only You)

| Function | Parameters | Description |
|----------|-----------|-------------|
| `requestViews()` | none | Fetch current YouTube views |
| `requestLikes()` | none | Fetch current YouTube likes |
| `updateVideoId(string)` | New video ID | Change tracked video |
| `setSourceCode(string)` | JavaScript code | Update Functions code |
| `updateSubscriptionId(uint64)` | New sub ID | Change subscription |
| `updateGasLimit(uint32)` | Gas limit | Adjust gas for requests |

### Public View Functions (Anyone)

| Function | Returns | Description |
|----------|---------|-------------|
| `latestViews()` | uint256 | Latest YouTube views |
| `latestLikes()` | uint256 | Latest YouTube likes |
| `youtubeVideoId()` | string | Current video being tracked |
| `getTriggers()` | (uint256, uint256) | Next trigger thresholds |
| `subscriptionId()` | uint64 | Subscription ID |
| `lastRequestId()` | bytes32 | Last Chainlink request ID |
| `lastResponse()` | bytes | Last raw response |
| `lastError()` | bytes | Last error (if any) |

### Events

```solidity
event ViewsUpdated(uint256 newViews, bytes32 requestId)
event LikesUpdated(uint256 newLikes, bytes32 requestId)
event ViewsTriggerMet(uint256 viewsCount)      // Triggers at 525, 530, 535...
event LikesTriggerMet(uint256 likesCount)      // Triggers at 25, 50, 75...
event Response(bytes32 requestId, bytes response, bytes err)
```

---

## 🎮 Usage Examples

### Example 1: Simple Monitoring Script

Create `monitor.js`:

```javascript
const { ethers } = require("hardhat");

async function monitor() {
  const contract = await ethers.getContractAt(
    "YouTubeOracleFunctions",
    "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA"
  );

  // Listen for events
  contract.on("ViewsUpdated", (newViews, requestId) => {
    console.log(`🎥 Views Updated: ${newViews}`);
  });

  contract.on("LikesUpdated", (newLikes, requestId) => {
    console.log(`❤️ Likes Updated: ${newLikes}`);
  });

  contract.on("ViewsTriggerMet", (viewsCount) => {
    console.log(`🚀 VIEWS MILESTONE: ${viewsCount}`);
  });

  contract.on("LikesTriggerMet", (likesCount) => {
    console.log(`🎯 LIKES MILESTONE: ${likesCount}`);
  });

  console.log("Monitoring events... (Ctrl+C to stop)");
}

monitor().catch(console.error);
```

Run it:
```bash
node monitor.js
```

### Example 2: Automated Polling

Create `auto-poll.js`:

```javascript
const { ethers } = require("hardhat");

async function poll() {
  const contract = await ethers.getContractAt(
    "YouTubeOracleFunctions",
    "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA"
  );

  console.log("Starting auto-polling...");

  // Request views every 10 minutes
  setInterval(async () => {
    try {
      const tx = await contract.requestViews();
      console.log("📊 Requested views:", tx.hash);
      
      // Wait 2 minutes for result
      setTimeout(async () => {
        const views = await contract.latestViews();
        console.log("✅ Current views:", views.toString());
      }, 120000);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }, 600000); // 10 minutes
}

poll().catch(console.error);
```

### Example 3: Check Thresholds

```javascript
const { ethers } = require("hardhat");

async function checkStatus() {
  const contract = await ethers.getContractAt(
    "YouTubeOracleFunctions",
    "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA"
  );

  const videoId = await contract.youtubeVideoId();
  const views = await contract.latestViews();
  const likes = await contract.latestLikes();
  const [nextViews, nextLikes] = await contract.getTriggers();

  console.log("\n=== YouTube Oracle Status ===");
  console.log("Video ID:", videoId);
  console.log("Current Views:", views.toString());
  console.log("Next Views Trigger:", nextViews.toString());
  console.log("Current Likes:", likes.toString());
  console.log("Next Likes Trigger:", nextLikes.toString());
  console.log("============================\n");
}

checkStatus().catch(console.error);
```

---

## 🔧 Advanced: Track a Different Video

To track a different YouTube video:

```javascript
// New video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
// Video ID: dQw4w9WgXcQ

const contract = await ethers.getContractAt(
  "YouTubeOracleFunctions",
  "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA"
);

await contract.updateVideoId("dQw4w9WgXcQ");
console.log("Updated to track:", await contract.youtubeVideoId());
```

---

## 🌐 Web3 Frontend Integration

### Using ethers.js

```javascript
import { ethers } from "ethers";

// Contract ABI (minimal for reads)
const ABI = [
  "function latestViews() view returns (uint256)",
  "function latestLikes() view returns (uint256)",
  "function youtubeVideoId() view returns (string)",
  "function requestViews() returns (bytes32)",
  "function requestLikes() returns (bytes32)",
  "event ViewsUpdated(uint256 newViews, bytes32 requestId)",
  "event LikesUpdated(uint256 newLikes, bytes32 requestId)"
];

// Setup
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(
  "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA",
  ABI,
  signer
);

// Read data (free)
async function getStats() {
  const views = await contract.latestViews();
  const likes = await contract.latestLikes();
  const videoId = await contract.youtubeVideoId();
  
  return {
    views: views.toString(),
    likes: likes.toString(),
    videoId
  };
}

// Request update (requires wallet + gas)
async function updateViews() {
  const tx = await contract.requestViews();
  console.log("Transaction:", tx.hash);
  await tx.wait();
  console.log("Request submitted!");
}

// Listen for events
contract.on("ViewsUpdated", (newViews, requestId) => {
  console.log("Views updated:", newViews.toString());
  // Update your UI here
});
```

### React Component Example

```jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function YouTubeOracle() {
  const [stats, setStats] = useState({ views: 0, likes: 0, videoId: '' });
  const [loading, setLoading] = useState(false);

  const CONTRACT_ADDRESS = "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA";
  const ABI = [
    "function latestViews() view returns (uint256)",
    "function latestLikes() view returns (uint256)",
    "function youtubeVideoId() view returns (string)",
    "function requestViews() returns (bytes32)"
  ];

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    const views = await contract.latestViews();
    const likes = await contract.latestLikes();
    const videoId = await contract.youtubeVideoId();
    
    setStats({
      views: views.toString(),
      likes: likes.toString(),
      videoId
    });
  }

  async function requestUpdate() {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      const tx = await contract.requestViews();
      await tx.wait();
      
      // Wait 2 minutes then reload
      setTimeout(loadStats, 120000);
      alert("Request sent! Check back in 2 minutes");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>YouTube Oracle</h2>
      <p>Video: {stats.videoId}</p>
      <p>Views: {stats.views}</p>
      <p>Likes: {stats.likes}</p>
      <button onClick={requestUpdate} disabled={loading}>
        {loading ? "Requesting..." : "Update Stats"}
      </button>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Request Not Fulfilled?

**Check:**
```javascript
const error = await contract.lastError();
console.log("Last error:", ethers.utils.toUtf8String(error));
```

**Common issues:**
1. ❌ Contract not added to subscription → Run add-consumer script
2. ❌ API key not uploaded → Add secret at functions.chain.link
3. ❌ Source code not set → Run set-source-code script
4. ❌ No LINK balance → Top up subscription 532

### Monitor Request Status

```javascript
const requestId = await contract.lastRequestId();
console.log("Request ID:", requestId);

// Check response
const response = await contract.lastResponse();
console.log("Response:", response);
```

### View Events

Go to Arbiscan:
https://sepolia.arbiscan.io/address/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA#events

Filter by:
- `ViewsUpdated` - See all views updates
- `LikesUpdated` - See all likes updates
- `ViewsTriggerMet` - See when milestones hit

---

## 💰 Cost Estimate

Per request:
- **LINK**: ~0.1-0.3 LINK
- **Gas**: ~100k-300k gas on Arbitrum Sepolia (very cheap!)

Current subscription: **532** with 5 LINK balance  
Estimated requests: ~16-50 requests

---

## 📚 Resources

- **Contract**: https://sepolia.arbiscan.io/address/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
- **Subscription**: https://functions.chain.link/arbitrum-sepolia/532
- **Functions Docs**: https://docs.chain.link/chainlink-functions
- **Video**: https://www.youtube.com/watch?v=LQAFm01IOT0

---

## ✅ Next Steps

1. ✅ Verify contract is added to subscription 532
2. ✅ Upload YouTube API key as secret
3. ✅ Set source code (run script)
4. 🧪 Test with `requestViews()` in Remix
5. 🎯 Build your app/integration!

**Your oracle is ready to use! 🚀**
