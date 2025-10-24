const hre = require("hardhat");

async function main() {
  console.log("📊 Checking YouTube Oracle Status...\n");

  const CONTRACT_ADDRESS = "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA";

  const contract = await hre.ethers.getContractAt(
    "YouTubeOracleFunctions",
    CONTRACT_ADDRESS
  );

  console.log("🌐 Network:", hre.network.name);
  console.log("📍 Contract:", CONTRACT_ADDRESS);
  console.log();

  // Get all contract data
  try {
    const videoId = await contract.youtubeVideoId();
    const latestViews = await contract.latestViews();
    const latestLikes = await contract.latestLikes();
    const [nextViewsTrigger, nextLikesTrigger] = await contract.getTriggers();
    const subscriptionId = await contract.subscriptionId();
    const lastRequestId = await contract.lastRequestId();
    const owner = await contract.owner();

    console.log("═".repeat(60));
    console.log("                 YOUTUBE ORACLE STATUS");
    console.log("═".repeat(60));
    
    console.log("\n📺 Video Configuration:");
    console.log("   Video ID:", videoId);
    console.log("   URL: https://www.youtube.com/watch?v=" + videoId);
    
    console.log("\n📊 Current Statistics:");
    console.log("   Latest Views:", latestViews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log("   Latest Likes:", latestLikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    
    console.log("\n🎯 Next Triggers:");
    console.log("   Views Trigger:", nextViewsTrigger.toString(), "(triggers every 5 views after 525)");
    console.log("   Likes Trigger:", nextLikesTrigger.toString(), "(triggers every 25 likes)");
    
    console.log("\n⚙️  Configuration:");
    console.log("   Subscription ID:", subscriptionId.toString());
    console.log("   Owner:", owner);
    console.log("   Last Request ID:", lastRequestId);
    
    // Check for errors
    const lastError = await contract.lastError();
    if (lastError && lastError !== "0x") {
      console.log("\n⚠️  Last Error:");
      try {
        const errorString = hre.ethers.utils.toUtf8String(lastError);
        console.log("   ", errorString);
      } catch {
        console.log("   ", lastError);
      }
    } else {
      console.log("\n✅ No errors");
    }

    // Check if source code is set
    const sourceCode = await contract.sourceCode();
    console.log("\n📄 Source Code:");
    if (sourceCode && sourceCode.length > 0) {
      console.log("   ✅ Set (" + sourceCode.length + " characters)");
    } else {
      console.log("   ❌ Not set - Run: npm run oracle:setup");
    }

    console.log("\n═".repeat(60));
    
    console.log("\n💡 Quick Actions:");
    console.log("   Request Views: contract.requestViews()");
    console.log("   Request Likes: contract.requestLikes()");
    
    // Dynamic explorer URL based on network
    const networkExplorers = {
      polygon: "https://polygonscan.com/address/",
      arbitrumSepolia: "https://sepolia.arbiscan.io/address/",
      sepolia: "https://sepolia.etherscan.io/address/",
      mainnet: "https://etherscan.io/address/"
    };
    const explorerUrl = networkExplorers[hre.network.name] || "https://etherscan.io/address/";
    console.log("   Check on Explorer:", explorerUrl + CONTRACT_ADDRESS);
    
    const networkSubscriptionUrls = {
      polygon: "https://functions.chain.link/polygon/",
      arbitrumSepolia: "https://functions.chain.link/arbitrum-sepolia/"
    };
    const subscriptionUrl = networkSubscriptionUrls[hre.network.name];
    if (subscriptionUrl) {
      console.log("   Check Subscription:", subscriptionUrl + subscriptionId);
    }

  } catch (error) {
    console.error("❌ Error reading contract:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
