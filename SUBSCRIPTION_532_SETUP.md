# 🎯 Quick Setup for Subscription 532

## Your Subscription Details

```
✅ Subscription ID: 532
✅ Status: Active
✅ Balance: 5 LINK
✅ Admin Address: 0x943f...641c
⚠️ Consumers: 0 (needs your contract)
🌐 Network: Sepolia Testnet
```

---

## 🚀 3-Step Deployment (5 minutes)

### Step 1: Deploy Your Contract (2 min)

**Using Remix (Easiest):**

1. Open https://remix.ethereum.org
2. Create new file: `YouTubeOracleConsumer.sol`
3. Copy the contract from `/workspace/contracts/YouTubeOracleConsumer.sol`
4. Compile with Solidity `0.8.7+`
5. Deploy with these parameters:
   ```
   _jobIdForViews: 0x0000000000000000000000000000000000000000000000000000000000000000
   _jobIdForLikes: 0x0000000000000000000000000000000000000000000000000000000000000000
   _youtubeVideoId: "dQw4w9WgXcQ"
   ```
   (We'll update job IDs later)

6. **SAVE YOUR CONTRACT ADDRESS!** (e.g., `0x1234...5678`)

### Step 2: Add Contract to Subscription 532 (1 min)

**Option A - Using Chainlink UI:**

1. Go to: https://vrf.chain.link/
2. Connect wallet (`0x943f...641c`)
3. Select **Sepolia** network
4. Find subscription **#532**
5. Click **"Add Consumer"**
6. Enter your contract address from Step 1
7. Confirm transaction

**Option B - Quick Script:**

```javascript
// add-consumer.js
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
);
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

const VRF_COORDINATOR = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
const abi = ["function addConsumer(uint64 subId, address consumer) external"];

async function addConsumer() {
  const coordinator = new ethers.Contract(VRF_COORDINATOR, abi, wallet);
  const tx = await coordinator.addConsumer(532, "YOUR_CONTRACT_ADDRESS");
  console.log("Transaction:", tx.hash);
  await tx.wait();
  console.log("✅ Consumer added to subscription 532!");
}

addConsumer();
```

```bash
npm install ethers
node add-consumer.js
```

### Step 3: Test It! (2 min)

**In Remix:**

1. Find your deployed contract
2. Call `requestViews()`
3. Wait 1-2 minutes
4. Check `latestViews` → Should show real YouTube views!

**Or use Etherscan:**

1. Go to: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
2. "Write Contract" → Connect Wallet
3. Call `requestViews()`
4. Wait, then check "Read Contract" → `latestViews`

---

## 🔧 Configure Job IDs (If Using Custom Jobs)

If you created custom Chainlink jobs:

```solidity
// Call this after deployment
contract.updateJobIds(
  "0xYOUR_VIEWS_JOB_ID_HERE",
  "0xYOUR_LIKES_JOB_ID_HERE"
);
```

---

## 📋 Checklist

- [ ] External adapter running at accessible URL
- [ ] Contract deployed to Sepolia
- [ ] Contract added as consumer to subscription 532
- [ ] Chainlink node has jobs configured
- [ ] Bridge created pointing to external adapter
- [ ] Test request sent (`requestViews()`)
- [ ] Test request fulfilled (check `latestViews`)

---

## 🎯 What Happens When You Call `requestViews()`?

```mermaid
Your Contract (Sepolia)
    ↓
Chainlink Oracle (via subscription 532)
    ↓
Chainlink Node (executes job)
    ↓
External Adapter (your server at localhost:8080 or deployed URL)
    ↓
YouTube API (fetches real data)
    ↓
Supabase (saves state)
    ↓
Back through Chainlink Node
    ↓
Contract receives data (fulfillViews callback)
    ↓
latestViews updated! 🎉
```

---

## 💰 Cost Per Request

With subscription 532:
- **LINK Cost**: ~0.1 LINK per request
- **Gas Cost**: ~100k-300k gas (~$1-5 depending on network)
- **Current Balance**: 5 LINK = ~50 requests

---

## 🎨 Contract Functions You Can Use

**Read Functions (Free):**
```solidity
latestViews()           // Get current views count
latestLikes()           // Get current likes count
getTriggers()           // Get next trigger thresholds
youtubeVideoId()        // Get tracked video ID
getLinkBalance()        // Check contract LINK balance
```

**Write Functions (Costs Gas):**
```solidity
requestViews()                          // Fetch latest views (costs LINK)
requestLikes()                          // Fetch latest likes (costs LINK)
updateVideoId("NEW_VIDEO_ID")          // Change tracked video
updateJobIds(viewsJob, likesJob)       // Update job IDs
withdrawLink()                          // Withdraw unused LINK
```

---

## 📊 Monitor Your Integration

### Check Subscription:
https://vrf.chain.link/ → Subscription 532
- View balance
- See requests history
- Monitor consumers

### Check Contract Events:
```solidity
event ViewsUpdated(uint256 newViews, bytes32 requestId)
event ViewsTriggerMet(uint256 viewsCount)  // Emits at 525, 530, 535, 540...
event LikesUpdated(uint256 newLikes, bytes32 requestId)
event LikesTriggerMet(uint256 likesCount)  // Emits at 25, 50, 75, 100...
```

### Check Supabase:
https://app.supabase.com/ → Table Editor → `adapter_state`

---

## 🆘 Quick Troubleshooting

**"Consumer not added to subscription"**
→ Complete Step 2 above

**"Insufficient LINK"**
→ Subscription 532 has 5 LINK, should be fine
→ If depleted, add more LINK to subscription

**"Request not fulfilled"**
→ Wait 2-3 minutes (Chainlink nodes take time)
→ Check Chainlink node is running
→ Verify external adapter is accessible

**"Wrong data returned"**
→ Check YouTube API key in `.env`
→ Verify external adapter is running
→ Check video ID is correct

---

## 🎉 You're Done!

Your contract is now connected to:
- ✅ Chainlink Subscription 532
- ✅ YouTube Stats External Adapter
- ✅ Real-time YouTube API data
- ✅ On-chain trigger logic

**Start making requests and watch your YouTube stats flow on-chain!** 🚀

---

## 📚 Files Reference

- **Contract**: `/workspace/contracts/YouTubeOracleConsumer.sol`
- **External Adapter**: `/workspace/server.js`
- **Full Guide**: `/workspace/CHAINLINK_DEPLOYMENT.md`
- **Main README**: `/workspace/README.md`

---

**Need help?** Check the full deployment guide in `CHAINLINK_DEPLOYMENT.md`
