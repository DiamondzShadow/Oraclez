# 🎯 You Have TWO Contracts!

## 📊 Contract Summary

You have **two identical contracts** deployed on different networks:

### 1️⃣ Arbitrum Sepolia (TESTNET) - Recommended for Testing ✅

```
Address:  0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061
Network:  Arbitrum Sepolia (Chain 421614)
Owner:    0x943F795b9F06E63b11adeb1fF3784247e2F6641C
Cost:     FREE (testnet tokens)
Status:   ✅ Deployed & Verified

Verification:
  ✅ Sourcify: https://repo.sourcify.dev/421614/0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061
  ✅ Arbiscan: https://sepolia.arbiscan.io/address/0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061
```

### 2️⃣ Polygon Mainnet (PRODUCTION) - Costs Real Money ⚠️

```
Address:  0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
Network:  Polygon Mainnet (Chain 137)
Owner:    0x943F795b9F06E63b11adeb1fF3784247e2F6641C
Cost:     ~$1-2 per request (real MATIC + LINK)
Status:   ✅ Deployed & Verified

Verification:
  ✅ Sourcify: https://repo.sourcify.dev/137/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
  ✅ Polygonscan: https://polygonscan.com/address/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
```

---

## 🎯 Recommended Setup: Use Testnet First!

I've updated **all default commands** to use the **Arbitrum Sepolia testnet** contract. This is perfect for:
- ✅ Testing without spending money
- ✅ Learning how it works
- ✅ Debugging issues
- ✅ Developing your app

### Why Testnet is Better for Development:

| Feature | Testnet (Arbitrum Sepolia) | Mainnet (Polygon) |
|---------|---------------------------|-------------------|
| **Cost** | ✅ FREE | ❌ ~$1-2 per request |
| **Tokens** | ✅ Free from faucets | ❌ Buy with real money |
| **Risk** | ✅ Zero risk | ⚠️ Real money at risk |
| **Speed** | ✅ Same as mainnet | ✅ Fast |
| **Testing** | ✅ Unlimited tests | ❌ Each test costs money |
| **Development** | ✅ Perfect | ❌ Expensive |

---

## 🚀 Commands (Updated for Testnet)

### Default Commands - Use Testnet (Arbitrum Sepolia)

```bash
# Check status (FREE - no wallet needed)
npm run oracle:status
✅ Now uses Arbitrum Sepolia testnet

# Set source code (FREE testnet tokens)
npm run oracle:setup

# Request YouTube data (FREE testnet LINK)
npm run oracle:request

# Monitor events
npm run oracle:monitor
```

### Mainnet Commands - Use Polygon (Real Money!)

```bash
# For production use (costs real money)
npm run oracle:status:polygon
npm run oracle:setup:polygon
npm run oracle:request:polygon
npm run oracle:monitor:polygon
```

---

## 📋 Quick Start Guide (Testnet)

### Step 1: Get Free Testnet Tokens

1. **Arbitrum Sepolia ETH** (for gas):
   ```
   https://faucet.quicknode.com/arbitrum/sepolia
   https://www.alchemy.com/faucets/arbitrum-sepolia
   ```
   - Connect your wallet (0x943F795b9F06E63b11adeb1fF3784247e2F6641C)
   - Get free ETH

2. **Testnet LINK** (optional, if subscription runs out):
   ```
   https://faucets.chain.link/arbitrum-sepolia
   ```

### Step 2: Add Private Key

Edit `.env` file:
```bash
PRIVATE_KEY=your_64_character_private_key_without_0x_prefix
```

**Important**: This should be the private key for wallet `0x943F795b9F06E63b11adeb1fF3784247e2F6641C`

### Step 3: Check Status

```bash
npm run oracle:status
```

Should show:
```
✅ Contract found on Arbitrum Sepolia
Owner: 0x943F795b9F06E63b11adeb1fF3784247e2F6641C
Video ID: LQAFm01IOT0
```

### Step 4: Set Source Code (One Time)

```bash
npm run oracle:setup
```

This uploads the JavaScript code to your contract. Only needs to be done once!

### Step 5: Request Data

```bash
npm run oracle:request
```

Wait 1-2 minutes, then check status again:
```bash
npm run oracle:status
```

Should show updated views!

### Step 6: Monitor Events (Optional)

```bash
npm run oracle:monitor
```

This will show real-time updates as they happen.

---

## 🔍 Detailed Configuration

### Both Contracts Share:

- **Owner**: 0x943F795b9F06E63b11adeb1fF3784247e2F6641C
- **Video ID**: LQAFm01IOT0
- **Subscription**: 532 (Chainlink Functions)
- **Contract Type**: YouTubeOracleFunctions
- **Source Code**: Not yet set on either contract

### Configuration Status:

```
┌─────────────────────┬────────────────────┬──────────────────┐
│ Component           │ Arbitrum Sepolia   │ Polygon Mainnet  │
├─────────────────────┼────────────────────┼──────────────────┤
│ Contract Deployed   │ ✅ Yes             │ ✅ Yes           │
│ Verified            │ ✅ Sourcify        │ ✅ Sourcify      │
│ Source Code Set     │ ❌ Not yet         │ ❌ Not yet       │
│ Subscription        │ 532                │ 532              │
│ Last Request        │ None               │ None             │
│ Views/Likes         │ 0 / 0              │ 0 / 0            │
│ Cost                │ FREE               │ ~$1-2/request    │
│ Tokens Needed       │ Free from faucets  │ Buy with money   │
└─────────────────────┴────────────────────┴──────────────────┘
```

---

## 💰 Cost Comparison

### Testnet (Arbitrum Sepolia) - FREE!

```
Setup (one time):
  ✅ Deploy contract: FREE (already done)
  ✅ Set source code: FREE (testnet ETH)
  ✅ Get tokens: FREE (from faucets)

Per Request:
  ✅ Gas: FREE (testnet ETH)
  ✅ LINK: FREE (testnet LINK)
  ✅ Total: $0.00

Unlimited testing: ✅ FREE
```

### Mainnet (Polygon) - Real Money

```
Setup (one time):
  💰 Deploy contract: ~$0.50-2 (already done)
  💰 Set source code: ~$0.05-0.20
  💰 Get tokens: Must buy

Per Request:
  💰 Gas: ~$0.05-0.10 (MATIC)
  💰 LINK: ~$1-2 (0.1 LINK)
  💰 Total per request: ~$1-2

For 10 requests: ~$10-20
For 100 requests: ~$100-200
```

---

## 🎯 Recommended Workflow

### Phase 1: Development & Testing (Testnet) ✅

1. Get free testnet tokens
2. Add private key to `.env`
3. Run `npm run oracle:setup` (testnet)
4. Test with `npm run oracle:request` (FREE!)
5. Monitor with `npm run oracle:monitor`
6. Debug and iterate (FREE unlimited tests!)
7. Build your app integration

### Phase 2: Production (Mainnet) 💰

Once everything works on testnet:

1. Get real MATIC and LINK
2. Update contracts to use mainnet:
   ```bash
   npm run oracle:setup:polygon
   npm run oracle:request:polygon
   ```
3. Update your app to use mainnet contract
4. Monitor costs carefully

---

## 🔧 Scripts & Addresses

All scripts have been updated to use **testnet by default**.

### Updated Files:

1. **scripts/check-status.js**
   - Default: `0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061` (Arbitrum Sepolia)

2. **scripts/set-source-code.js**
   - Default: `0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061` (Arbitrum Sepolia)

3. **scripts/request-views.js**
   - Default: `0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061` (Arbitrum Sepolia)

4. **scripts/monitor-events.js**
   - Default: `0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061` (Arbitrum Sepolia)

5. **package.json**
   - Default scripts use Arbitrum Sepolia
   - `:polygon` variants for mainnet

6. **.env**
   - Added both contract addresses

---

## 📚 Quick Reference

### Check Which Contract You're Using

```bash
npm run oracle:status
```

Look for the network in the output:
- `Network: arbitrumSepolia` → Testnet (FREE) ✅
- `Network: polygon` → Mainnet (COSTS MONEY) ⚠️

### Switch Between Networks

```bash
# Use testnet (default - recommended)
npm run oracle:status
npm run oracle:setup
npm run oracle:request

# Use mainnet (costs money)
npm run oracle:status:polygon
npm run oracle:setup:polygon
npm run oracle:request:polygon
```

---

## 🔗 Important Links

### Testnet (Arbitrum Sepolia)

- **Contract**: https://sepolia.arbiscan.io/address/0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061
- **Sourcify**: https://repo.sourcify.dev/421614/0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061
- **Subscription**: https://functions.chain.link/arbitrum-sepolia/532
- **Get ETH**: https://faucet.quicknode.com/arbitrum/sepolia
- **Get LINK**: https://faucets.chain.link/arbitrum-sepolia

### Mainnet (Polygon)

- **Contract**: https://polygonscan.com/address/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
- **Sourcify**: https://repo.sourcify.dev/137/0xD66544E49c7407AcdE0a577BFB176f950a18DAAA
- **Subscription**: https://functions.chain.link/polygon/532
- **Get MATIC**: https://wallet.polygon.technology/ (must buy)
- **Get LINK**: https://chain.link/ (must buy)

### YouTube Video

- **Video ID**: LQAFm01IOT0
- **URL**: https://www.youtube.com/watch?v=LQAFm01IOT0

---

## ✅ Summary

**What Changed:**
- ✅ Discovered you have TWO contracts (testnet + mainnet)
- ✅ Updated all scripts to use **testnet by default**
- ✅ Added `:polygon` commands for mainnet
- ✅ Updated all documentation

**Current Setup:**
- ✅ Default: Arbitrum Sepolia (FREE testnet)
- ✅ Optional: Polygon Mainnet (costs money)
- ✅ All commands working
- ✅ Ready to test!

**Recommendation:**
🎯 **Start with testnet!** Test everything for FREE, then move to mainnet when ready.

---

**Last Updated**: 2025-10-24  
**Status**: ✅ Both contracts configured and ready to use!
