const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying YouTubeOracleFunctions to Arbitrum Sepolia...");

  // Arbitrum Sepolia Chainlink Functions configuration
  const ROUTER_ADDRESS = "0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C";
  const SUBSCRIPTION_ID = 532;
  const DON_ID = "0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000"; // fun-arbitrum-sepolia-1
  const YOUTUBE_VIDEO_ID = process.env.YOUTUBE_VIDEO_ID || "LQAFm01IOT0";

  console.log("\n📋 Deployment Configuration:");
  console.log("  Network: Arbitrum Sepolia");
  console.log("  Router:", ROUTER_ADDRESS);
  console.log("  Subscription ID:", SUBSCRIPTION_ID);
  console.log("  DON ID:", DON_ID);
  console.log("  YouTube Video ID:", YOUTUBE_VIDEO_ID);

  // Get contract factory
  const YouTubeOracleFunctions = await hre.ethers.getContractFactory("YouTubeOracleFunctions");

  // Deploy contract
  console.log("\n⏳ Deploying contract...");
  const contract = await YouTubeOracleFunctions.deploy(
    ROUTER_ADDRESS,
    SUBSCRIPTION_ID,
    DON_ID,
    YOUTUBE_VIDEO_ID
  );

  await contract.deployed();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", contract.address);

  // Read the JavaScript source code
  const fs = require("fs");
  const path = require("path");
  const sourceCode = fs.readFileSync(
    path.join(__dirname, "../functions-source.js"),
    "utf8"
  );

  // Set the source code in the contract
  console.log("\n⏳ Setting JavaScript source code...");
  const setSourceTx = await contract.setSourceCode(sourceCode);
  await setSourceTx.wait();
  console.log("✅ Source code set!");

  // Display next steps
  console.log("\n📋 Next Steps:");
  console.log("\n1. Add this contract as a consumer to your Functions subscription:");
  console.log("   → Go to: https://functions.chain.link/");
  console.log("   → Connect wallet on Arbitrum Sepolia");
  console.log("   → Find subscription #532");
  console.log("   → Click 'Add Consumer'");
  console.log("   → Enter contract address:", contract.address);
  
  console.log("\n2. Upload your YouTube API key as a secret:");
  console.log("   → In Functions UI, go to your subscription");
  console.log("   → Go to 'Secrets' tab");
  console.log("   → Add secret: key='apiKey', value='YOUR_YOUTUBE_API_KEY'");
  
  console.log("\n3. Test the contract:");
  console.log("   → Call requestViews() function");
  console.log("   → Wait 1-2 minutes");
  console.log("   → Check latestViews value");

  console.log("\n4. Or use this command to add consumer:");
  console.log(`   npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia`);

  // Wait for confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await contract.deployTransaction.wait(5);
  console.log("✅ Confirmed!");

  console.log("\n🎉 Deployment complete!");
  console.log("\n📝 Important Information:");
  console.log("   Contract Address:", contract.address);
  console.log("   Network: Arbitrum Sepolia");
  console.log("   Subscription ID: 532");
  console.log("   Video ID:", YOUTUBE_VIDEO_ID);
  console.log("\n⚠️  Remember to:");
  console.log("   1. Add contract as consumer to subscription 532");
  console.log("   2. Upload YouTube API key as secret 'apiKey'");
  console.log("   3. Test with requestViews() or requestLikes()");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
