const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying YouTubeOracleConsumer...");

  // Configuration
  const VIEWS_JOB_ID = process.env.VIEWS_JOB_ID || "0x0000000000000000000000000000000000000000000000000000000000000000";
  const LIKES_JOB_ID = process.env.LIKES_JOB_ID || "0x0000000000000000000000000000000000000000000000000000000000000000";
  const YOUTUBE_VIDEO_ID = process.env.YOUTUBE_VIDEO_ID || "dQw4w9WgXcQ";

  console.log("\n📋 Deployment Configuration:");
  console.log("  Views Job ID:", VIEWS_JOB_ID);
  console.log("  Likes Job ID:", LIKES_JOB_ID);
  console.log("  YouTube Video ID:", YOUTUBE_VIDEO_ID);

  // Get the contract factory
  const YouTubeOracleConsumer = await hre.ethers.getContractFactory("YouTubeOracleConsumer");

  // Deploy the contract
  console.log("\n⏳ Deploying contract...");
  const contract = await YouTubeOracleConsumer.deploy(
    VIEWS_JOB_ID,
    LIKES_JOB_ID,
    YOUTUBE_VIDEO_ID
  );

  await contract.deployed();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", contract.address);
  console.log("🔗 Network:", hre.network.name);

  // Display next steps
  console.log("\n📋 Next Steps:");
  console.log("1. Add this contract as a consumer to subscription 532:");
  console.log("   → Go to: https://vrf.chain.link/");
  console.log("   → Select Sepolia network");
  console.log("   → Find subscription #532");
  console.log("   → Click 'Add Consumer'");
  console.log("   → Enter contract address:", contract.address);
  console.log("\n2. Or use this script:");
  console.log("   npx hardhat run scripts/add-consumer.js --network sepolia");
  console.log("\n3. Test the contract:");
  console.log("   → Call requestViews() function");
  console.log("   → Wait 1-2 minutes");
  console.log("   → Check latestViews value");

  // Wait for block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await contract.deployTransaction.wait(5);
  console.log("✅ Confirmed!");

  // Verify contract on Etherscan (if API key is provided)
  if (process.env.ETHERSCAN_API_KEY && hre.network.name !== "hardhat") {
    console.log("\n🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [
          VIEWS_JOB_ID,
          LIKES_JOB_ID,
          YOUTUBE_VIDEO_ID
        ],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
      console.log("   You can verify manually later at:");
      console.log("   https://sepolia.etherscan.io/address/" + contract.address);
    }
  }

  console.log("\n🎉 Deployment complete!");
  console.log("📝 Save this information:");
  console.log("   Contract Address:", contract.address);
  console.log("   Network:", hre.network.name);
  console.log("   Deployer:", (await hre.ethers.getSigners())[0].address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
