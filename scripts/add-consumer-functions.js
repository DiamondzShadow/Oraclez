const hre = require("hardhat");

async function main() {
  console.log("🔗 Adding consumer to Chainlink Functions subscription 532...");

  const SUBSCRIPTION_ID = 532;
  const ROUTER_ADDRESS = "0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C"; // Arbitrum Sepolia
  const CONSUMER_ADDRESS = process.env.CONSUMER_ADDRESS || process.argv[2];

  if (!CONSUMER_ADDRESS) {
    console.error("❌ Error: Consumer address is required");
    console.log("Usage: npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia CONSUMER_ADDRESS");
    console.log("Or set CONSUMER_ADDRESS environment variable");
    process.exit(1);
  }

  console.log("\n📋 Configuration:");
  console.log("  Subscription ID:", SUBSCRIPTION_ID);
  console.log("  Router:", ROUTER_ADDRESS);
  console.log("  Consumer Address:", CONSUMER_ADDRESS);

  // Functions Router ABI (minimal - just addConsumer function)
  const routerABI = [
    "function addConsumer(uint64 subscriptionId, address consumer) external"
  ];

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("\n👤 Signer:", signer.address);

  // Connect to router
  const router = new hre.ethers.Contract(ROUTER_ADDRESS, routerABI, signer);

  // Add consumer
  console.log("\n⏳ Adding consumer to subscription...");
  const tx = await router.addConsumer(SUBSCRIPTION_ID, CONSUMER_ADDRESS);
  console.log("📝 Transaction hash:", tx.hash);
  
  console.log("⏳ Waiting for confirmation...");
  await tx.wait();
  
  console.log("\n✅ Consumer added successfully!");
  console.log("🎉 Your contract can now use subscription 532!");
  
  console.log("\n📋 Next Steps:");
  console.log("1. Upload YouTube API key as a secret in Functions UI:");
  console.log("   → https://functions.chain.link/");
  console.log("   → Go to subscription 532");
  console.log("   → Secrets tab → Add secret");
  console.log("   → Key: 'apiKey', Value: 'YOUR_YOUTUBE_API_KEY'");
  console.log("\n2. Test the contract:");
  console.log("   → Call requestViews() from your contract");
  console.log("   → Wait 1-2 minutes for fulfillment");
  console.log("   → Check latestViews value");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Failed to add consumer:", error);
    process.exit(1);
  });
