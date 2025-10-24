# Quick Answer 🎯

## Your YouTube Video ID

From: `https://www.youtube.com/watch?v=LQAFm01IOT0`

**Video ID: `LQAFm01IOT0`**

---

## Your Chainlink Setup

```javascript
// Arbitrum Sepolia Configuration
Network: Arbitrum Sepolia
Subscription ID: 532
DON ID: fun-arbitrum-sepolia-1
Functions Router: 0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C
LINK Token: 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E
```

---

## Deploy Your Contract (3 Commands)

```bash
# 1. Compile
npx hardhat compile

# 2. Deploy (video ID already set to LQAFm01IOT0)
npx hardhat run scripts/deploy-functions.js --network arbitrumSepolia

# 3. Add as consumer (replace with your deployed address)
npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia YOUR_CONTRACT_ADDRESS
```

---

## What You Need to Do

1. ✅ **Set `.env` file:**
   ```env
   PRIVATE_KEY=your_wallet_private_key
   YOUTUBE_API_KEY=your_youtube_api_key
   YOUTUBE_VIDEO_ID=LQAFm01IOT0
   ```

2. ✅ **Deploy contract** (see commands above)

3. ✅ **Upload API key as secret:**
   - Go to https://functions.chain.link/
   - Find subscription 532
   - Secrets tab → Add secret
   - Key: `apiKey`, Value: YOUR_YOUTUBE_API_KEY

4. ✅ **Test it:**
   ```solidity
   contract.requestViews()  // Wait 2 minutes
   contract.latestViews()   // Should show views!
   ```

---

## Files Created for You

- ✅ `contracts/YouTubeOracleFunctions.sol` - New contract for Functions
- ✅ `functions-source.js` - JavaScript code that runs in DON
- ✅ `scripts/deploy-functions.js` - Deployment script
- ✅ `scripts/add-consumer-functions.js` - Add consumer script
- ✅ `hardhat.config.js` - Updated with Arbitrum Sepolia
- ✅ `CHAINLINK_FUNCTIONS_GUIDE.md` - Full guide

---

## Deployed Contract Address

Your current contract: **`0xD66544E49c7407AcdE0a577BFB176f950a18DAAA`**

This contract is configured for **Chainlink Functions** (subscription 532) which is serverless.

---

## Why a New Contract?

Your old contract address `0x4dba078729b72704db89520530922063932E43a7` was for **Chainlink Any API** (requires node).

You're using **Chainlink Functions** (subscription 532) which is serverless.

These are **incompatible** - you need the new contract!

---

**Full guide:** `CHAINLINK_FUNCTIONS_GUIDE.md`
