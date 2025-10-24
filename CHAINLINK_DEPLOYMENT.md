# 🔗 Chainlink Subscription Deployment Guide

## ✅ Your Chainlink Subscription Configuration

**Subscription ID**: `532`  
**Status**: ✅ Active  
**Balance**: 5 LINK  
**Admin Address**: `0x943f...641c`  
**Consumers**: 0 (needs to be added)  
**Network**: Sepolia Testnet

---

## 📋 Deployment Steps

### Step 1: Deploy the Smart Contract

Your smart contract is located at: `/workspace/contracts/YouTubeOracleConsumer.sol`

#### Using Remix IDE (Recommended for Testing)

1. **Open Remix**: Go to [remix.ethereum.org](https://remix.ethereum.org)

2. **Create New File**: Create `YouTubeOracleConsumer.sol` and paste the contract code

3. **Install Dependencies**: In Remix, the Chainlink imports will be automatically resolved

4. **Compile**:
   - Click "Solidity Compiler" tab
   - Select compiler version `0.8.7` or higher
   - Click "Compile YouTubeOracleConsumer.sol"

5. **Deploy**:
   - Click "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask"
   - Ensure you're on **Sepolia Testnet**
   - Enter constructor parameters:
     ```
     _jobIdForViews: "YOUR_VIEWS_JOB_ID"
     _jobIdForLikes: "YOUR_LIKES_JOB_ID"
     _youtubeVideoId: "dQw4w9WgXcQ"
     ```
   - Click "Deploy"
   - Confirm transaction in MetaMask

6. **Copy Contract Address**: Save the deployed contract address (e.g., `0x1234...5678`)

#### Using Hardhat (For Production)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat project in contracts directory
cd /workspace
npx hardhat init

# Deploy script will be created in Step 2
```

---

### Step 2: Add Contract as Consumer to Subscription 532

#### Option A: Using Chainlink UI

1. Go to [Chainlink VRF Subscription Manager](https://vrf.chain.link/)
2. Connect your wallet (admin address: `0x943f...641c`)
3. Select **Sepolia Testnet**
4. Find your subscription ID: **532**
5. Click "Add Consumer"
6. Enter your deployed contract address from Step 1
7. Confirm the transaction

#### Option B: Using CLI (ethers.js)

```javascript
const { ethers } = require("ethers");

// Configuration
const SUBSCRIPTION_ID = 532;
const CONSUMER_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const VRF_COORDINATOR_ADDRESS = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625"; // Sepolia

// Connect to provider and wallet
const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// VRF Coordinator ABI (minimal)
const vrfCoordinatorABI = [
  "function addConsumer(uint64 subId, address consumer) external"
];

async function addConsumer() {
  const coordinator = new ethers.Contract(
    VRF_COORDINATOR_ADDRESS,
    vrfCoordinatorABI,
    wallet
  );
  
  const tx = await coordinator.addConsumer(SUBSCRIPTION_ID, CONSUMER_ADDRESS);
  console.log("Adding consumer, tx:", tx.hash);
  await tx.wait();
  console.log("Consumer added successfully!");
}

addConsumer();
```

---

### Step 3: Configure Chainlink Job IDs

You need to create two jobs in your Chainlink node (or use existing ones):

#### Job Spec for Views

```toml
type = "directrequest"
schemaVersion = 1
name = "youtube-views-stats"
contractAddress = "YOUR_ORACLE_ADDRESS"
maxTaskDuration = "0s"
observationSource = """
    decode_log   [type="ethabidecodelog"
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type="cborparse" data="$(decode_log.data)"]
    
    fetch        [type="bridge" 
                  name="youtube-stats"
                  requestData="{\\"id\\": $(jobRun.id), \\"data\\": {\\"videoId\\": $(decode_cbor.videoId), \\"endpoint\\": \\"views\\"}}"]
    
    parse        [type="jsonparse" path="data,value" data="$(fetch)"]
    
    encode_data  [type="ethabiencode" abi="(uint256 value)" data="{ \\"value\\": $(parse) }"]
    
    encode_tx    [type="ethabiencode"
                  abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                  data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
                  ]

    submit_tx    [type="ethtx" to="YOUR_ORACLE_ADDRESS" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
"""
```

#### Job Spec for Likes

```toml
type = "directrequest"
schemaVersion = 1
name = "youtube-likes-stats"
contractAddress = "YOUR_ORACLE_ADDRESS"
maxTaskDuration = "0s"
observationSource = """
    decode_log   [type="ethabidecodelog"
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type="cborparse" data="$(decode_log.data)"]
    
    fetch        [type="bridge" 
                  name="youtube-stats"
                  requestData="{\\"id\\": $(jobRun.id), \\"data\\": {\\"videoId\\": $(decode_cbor.videoId), \\"endpoint\\": \\"likes\\"}}"]
    
    parse        [type="jsonparse" path="data,value" data="$(fetch)"]
    
    encode_data  [type="ethabiencode" abi="(uint256 value)" data="{ \\"value\\": $(parse) }"]
    
    encode_tx    [type="ethabiencode"
                  abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                  data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
                  ]

    submit_tx    [type="ethtx" to="YOUR_ORACLE_ADDRESS" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
"""
```

**Save the Job IDs** from both jobs - you'll need them for the constructor!

---

### Step 4: Create External Adapter Bridge

In your Chainlink node:

1. Go to **Bridges** tab
2. Click **"New Bridge"**
3. Configure:
   ```
   Name: youtube-stats
   URL: https://your-adapter-url.com (or http://localhost:8080 for testing)
   ```
4. Click **"Create Bridge"**

---

### Step 5: Fund Your Consumer Contract

The contract needs LINK to make requests:

```bash
# Using MetaMask or any wallet, send LINK to your contract address
# Recommended: 1-2 LINK to start

# Contract Address: YOUR_DEPLOYED_CONTRACT_ADDRESS
# Amount: 1 LINK
```

Or use the contract's subscription model by ensuring subscription 532 has enough balance (already has 5 LINK ✅).

---

### Step 6: Test the Integration

#### Using Remix

1. Go to deployed contract in Remix
2. Call `requestViews()` function
3. Confirm transaction
4. Wait 1-2 minutes for Chainlink node to fulfill
5. Check `latestViews` - should show current view count!
6. Check events for `ViewsUpdated` and potentially `ViewsTriggerMet`

#### Using Etherscan

1. Go to your contract on [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Go to "Write Contract" tab
3. Connect wallet
4. Call `requestViews()` or `requestLikes()`
5. Check "Read Contract" tab for `latestViews` and `latestLikes`
6. Check "Events" tab for emitted events

#### Using Web3/Ethers Script

```javascript
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT";
const ABI = [...]; // Your contract ABI

const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function testContract() {
  // Request views
  console.log("Requesting views...");
  const tx1 = await contract.requestViews();
  await tx1.wait();
  console.log("Views request sent:", tx1.hash);
  
  // Wait for fulfillment
  await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
  
  // Check latest views
  const views = await contract.latestViews();
  console.log("Latest views:", views.toString());
  
  // Request likes
  console.log("Requesting likes...");
  const tx2 = await contract.requestLikes();
  await tx2.wait();
  console.log("Likes request sent:", tx2.hash);
  
  // Wait for fulfillment
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  // Check latest likes
  const likes = await contract.latestLikes();
  console.log("Latest likes:", likes.toString());
  
  // Check triggers
  const [nextViews, nextLikes] = await contract.getTriggers();
  console.log("Next views trigger:", nextViews.toString());
  console.log("Next likes trigger:", nextLikes.toString());
}

testContract();
```

---

## 📊 Monitoring

### Check Subscription Status

Visit: https://vrf.chain.link/

- View subscription 532 details
- Monitor LINK balance
- See consumer contracts
- View request history

### Check Contract Events

Monitor these events:
- `ViewsUpdated(uint256 newViews, bytes32 requestId)`
- `LikesUpdated(uint256 newLikes, bytes32 requestId)`
- `ViewsTriggerMet(uint256 viewsCount)`
- `LikesTriggerMet(uint256 likesCount)`

### Check Supabase Database

Your external adapter saves state to Supabase:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Open `adapter_state` table
3. View tracked video statistics

---

## 🔧 Configuration Reference

### Networks

| Network | LINK Token | VRF Coordinator | Chain ID |
|---------|-----------|----------------|----------|
| Sepolia | `0x779877A7B0D9E8603169DdbD7836e478b4624789` | `0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625` | 11155111 |
| Ethereum Mainnet | `0x514910771AF9Ca656af840dff83E8264EcF986CA` | TBD | 1 |

### Constructor Parameters

```solidity
constructor(
    bytes32 _jobIdForViews,      // Get from Chainlink node after creating job
    bytes32 _jobIdForLikes,      // Get from Chainlink node after creating job
    string memory _youtubeVideoId // e.g., "dQw4w9WgXcQ"
)
```

### Contract Methods

**Owner Functions:**
- `requestViews()` - Request current views count
- `requestLikes()` - Request current likes count
- `updateVideoId(string)` - Change tracked video
- `updateJobIds(bytes32, bytes32)` - Update job IDs
- `updateFee(uint256)` - Update request fee
- `withdrawLink()` - Withdraw LINK from contract

**View Functions:**
- `latestViews()` - Get latest views count
- `latestLikes()` - Get latest likes count
- `getTriggers()` - Get next trigger thresholds
- `getLinkBalance()` - Get contract LINK balance
- `youtubeVideoId()` - Get tracked video ID

---

## ⚠️ Important Notes

### Subscription Model

This contract can work with two funding models:

1. **Direct Funding**: Send LINK directly to contract (traditional method)
2. **Subscription Model**: Use subscription 532 (requires VRF Coordinator V2 setup)

For subscription model, you'd need to:
- Modify contract to inherit from `VRFConsumerBaseV2`
- Use subscription ID 532 in requests
- No need to fund contract directly - subscription balance is used

### Gas and Fees

- Each request costs ~0.1 LINK (configurable)
- Gas costs vary by network (~100k-300k gas per request)
- Monitor subscription 532 balance (currently 5 LINK)

### Rate Limits

- YouTube API: 10,000 quota units/day
- Each stats request: 1 quota unit
- Plan request frequency accordingly

---

## 🆘 Troubleshooting

### "Insufficient LINK" Error
→ Fund the contract or ensure subscription 532 has balance

### Request Not Fulfilled
→ Check Chainlink node logs
→ Verify job IDs are correct
→ Ensure bridge is accessible
→ Check external adapter is running

### "Not authorized" Error
→ Ensure you're calling from owner address
→ Check MetaMask is connected to correct account

### Wrong Data Returned
→ Verify videoId is correct
→ Check YouTube API key in external adapter
→ Review external adapter logs

---

## 🎯 Next Steps

1. ✅ Deploy contract to Sepolia
2. ✅ Add contract as consumer to subscription 532
3. ✅ Configure Chainlink jobs with correct Job IDs
4. ✅ Create external adapter bridge
5. ✅ Test with `requestViews()` and `requestLikes()`
6. ✅ Monitor events and subscription balance
7. ✅ Scale to production when ready

---

## 📚 Additional Resources

- [Chainlink Documentation](https://docs.chain.link/)
- [Chainlink External Adapters](https://docs.chain.link/chainlink-nodes/external-adapters/external-adapters)
- [Subscription Manager](https://vrf.chain.link/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Sepolia LINK Faucet](https://faucets.chain.link/)

---

**Your subscription 532 is active and ready to go! Deploy the contract and start tracking YouTube stats on-chain! 🚀**
