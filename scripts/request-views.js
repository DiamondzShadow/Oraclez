const hre = require("hardhat");

async function main() {
  console.log("📊 Requesting YouTube Views...\n");

  const CONTRACT_ADDRESS = "0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061";

  const contract = await hre.ethers.getContractAt(
    "YouTubeOracleFunctions",
    CONTRACT_ADDRESS
  );

  const [signer] = await hre.ethers.getSigners();
  const owner = await contract.owner();

  console.log("📍 Contract:", CONTRACT_ADDRESS);
  console.log("👤 Your address:", signer.address);
  console.log("👤 Contract owner:", owner);

  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    console.error("\n❌ Error: Only the contract owner can request data!");
    process.exit(1);
  }

  const videoId = await contract.youtubeVideoId();
  console.log("🎥 Video ID:", videoId);
  console.log("🔗 URL: https://www.youtube.com/watch?v=" + videoId);

  try {
    console.log("\n⏳ Sending request...");
    const tx = await contract.requestViews();
    console.log("📤 Transaction hash:", tx.hash);
    
    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Request sent successfully!");
    console.log("   Block:", receipt.blockNumber);
    console.log("   Gas used:", receipt.gasUsed.toString());

    // Get request ID
    const requestId = await contract.lastRequestId();
    console.log("\n🔍 Request ID:", requestId);

    console.log("\n⏰ Please wait 1-2 minutes for Chainlink Functions to fulfill the request...");
    console.log("\n📋 To check the result:");
    console.log("   npm run oracle:status");
    console.log("\nOr check on Arbiscan:");
    console.log("   https://sepolia.arbiscan.io/address/" + CONTRACT_ADDRESS + "#events");

  } catch (error) {
    console.error("\n❌ Error sending request:");
    console.error(error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Tip: Make sure you have enough Arbitrum Sepolia ETH for gas");
    } else if (error.message.includes("EmptySource")) {
      console.log("\n💡 Tip: Set the source code first:");
      console.log("   npx hardhat run scripts/set-source-code.js --network arbitrumSepolia");
    } else if (error.message.includes("Consumer not allowed")) {
      console.log("\n💡 Tip: Add contract to subscription 532:");
      console.log("   npx hardhat run scripts/add-consumer-functions.js --network arbitrumSepolia " + CONTRACT_ADDRESS);
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
