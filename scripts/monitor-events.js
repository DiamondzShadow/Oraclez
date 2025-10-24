const hre = require("hardhat");

async function main() {
  console.log("👀 Monitoring YouTube Oracle Events...\n");

  const CONTRACT_ADDRESS = "0x1f4ae8c5fBc9B6350e5A01B93687fCcBfFA36061";

  const contract = await hre.ethers.getContractAt(
    "YouTubeOracleFunctions",
    CONTRACT_ADDRESS
  );

  console.log("📍 Contract:", CONTRACT_ADDRESS);
  console.log("🌐 Network:", hre.network.name);
  console.log("\n⏰ Listening for events... (Press Ctrl+C to stop)\n");
  console.log("─".repeat(60));

  // Listen for all events
  contract.on("ViewsUpdated", (newViews, requestId) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 📊 VIEWS UPDATED`);
    console.log("   New Views:", newViews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log("   Request ID:", requestId);
    console.log("─".repeat(60));
  });

  contract.on("LikesUpdated", (newLikes, requestId) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] ❤️  LIKES UPDATED`);
    console.log("   New Likes:", newLikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log("   Request ID:", requestId);
    console.log("─".repeat(60));
  });

  contract.on("ViewsTriggerMet", (viewsCount) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 🚀 VIEWS MILESTONE REACHED!`);
    console.log("   Views Count:", viewsCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log("   🎉 Threshold triggered!");
    console.log("─".repeat(60));
  });

  contract.on("LikesTriggerMet", (likesCount) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 🎯 LIKES MILESTONE REACHED!`);
    console.log("   Likes Count:", likesCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log("   🎉 Threshold triggered!");
    console.log("─".repeat(60));
  });

  contract.on("Response", (requestId, response, err) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 📡 CHAINLINK RESPONSE`);
    console.log("   Request ID:", requestId);
    if (err && err !== "0x") {
      console.log("   ⚠️  Error:", hre.ethers.utils.toUtf8String(err));
    } else {
      console.log("   ✅ Success");
    }
    console.log("─".repeat(60));
  });

  // Show current status first
  try {
    const videoId = await contract.youtubeVideoId();
    const latestViews = await contract.latestViews();
    const latestLikes = await contract.latestLikes();
    
    console.log("📺 Current Status:");
    console.log("   Video ID:", videoId);
    console.log("   Latest Views:", latestViews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log("   Latest Likes:", latestLikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log("─".repeat(60));
    console.log("\n✅ Monitoring active...\n");
  } catch (error) {
    console.error("Error reading initial status:", error.message);
  }

  // Keep the script running
  await new Promise(() => {});
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
