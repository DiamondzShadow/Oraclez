const hre = require("hardhat");

async function main() {
  console.log("🔗 Adding consumer to Chainlink subscription 532...");

  // Configuration
  const SUBSCRIPTION_ID = 532;
  const CONSUMER_ADDRESS = process.env.CONSUMER_ADDRESS || "";
  const VRF_COORDINATOR_ADDRESS = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625"; // Sepolia

  if (!CONSUMER_ADDRESS) {
    console.error("❌ Error: CONSUMER_ADDRESS not set in .env file");
    console.log("   Add this to your .env:");
    console.log("   CONSUMER_ADDRESS=0xYourContractAddress");
    process.exit(1);
  }

  console.log("\n📋 Configuration:");
  console.log("  Subscription ID:", SUBSCRIPTION_ID);
  console.log("  Consumer Address:", CONSUMER_ADDRESS);
  console.log("  VRF Coordinator:", VRF_COORDINATOR_ADDRESS);
  console.log("  Network:", hre.network.name);

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("\n📝 Using wallet:", signer.address);

  // VRF Coordinator ABI (minimal)
  const coordinatorABI = [
    "function addConsumer(uint64 subId, address consumer) external",
    "function getSubscription(uint64 subId) external view returns (uint96 balance, uint64 reqCount, address owner, address[] memory consumers)"
  ];

  // Connect to VRF Coordinator
  const coordinator = new hre.ethers.Contract(
    VRF_COORDINATOR_ADDRESS,
    coordinatorABI,
    signer
  );

  // Check subscription before
  console.log("\n🔍 Checking subscription before...");
  try {
    const subBefore = await coordinator.getSubscription(SUBSCRIPTION_ID);
    console.log("  Balance:", hre.ethers.utils.formatEther(subBefore.balance), "LINK");
    console.log("  Owner:", subBefore.owner);
    console.log("  Current Consumers:", subBefore.consumers.length);
    
    // Check if already added
    if (subBefore.consumers.includes(CONSUMER_ADDRESS)) {
      console.log("\n⚠️  Consumer already added to subscription!");
      return;
    }
  } catch (error) {
    console.log("  ⚠️  Could not read subscription:", error.message);
  }

  // Add consumer
  console.log("\n⏳ Adding consumer to subscription...");
  try {
    const tx = await coordinator.addConsumer(SUBSCRIPTION_ID, CONSUMER_ADDRESS);
    console.log("  Transaction:", tx.hash);
    
    console.log("  Waiting for confirmation...");
    await tx.wait();
    
    console.log("\n✅ Consumer added successfully!");
  } catch (error) {
    console.error("❌ Failed to add consumer:", error.message);
    console.log("\n💡 Common issues:");
    console.log("   - You're not the subscription owner");
    console.log("   - Consumer already added");
    console.log("   - Insufficient gas");
    console.log("   - Wrong network");
    process.exit(1);
  }

  // Verify subscription after
  console.log("\n🔍 Verifying subscription after...");
  try {
    const subAfter = await coordinator.getSubscription(SUBSCRIPTION_ID);
    console.log("  Balance:", hre.ethers.utils.formatEther(subAfter.balance), "LINK");
    console.log("  Total Consumers:", subAfter.consumers.length);
    console.log("  Consumers:", subAfter.consumers);
    
    if (subAfter.consumers.includes(CONSUMER_ADDRESS)) {
      console.log("\n✅ Verified: Consumer successfully added!");
    } else {
      console.log("\n⚠️  Warning: Consumer not found in subscription list");
    }
  } catch (error) {
    console.log("  ⚠️  Could not verify subscription:", error.message);
  }

  console.log("\n🎉 Done!");
  console.log("\n📋 Next Steps:");
  console.log("1. Test the contract:");
  console.log("   → Call requestViews() on your contract");
  console.log("   → Wait 1-2 minutes for fulfillment");
  console.log("   → Check latestViews value");
  console.log("\n2. Monitor subscription:");
  console.log("   → https://vrf.chain.link/");
  console.log("   → View subscription #532");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
