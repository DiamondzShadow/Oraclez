const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔧 Setting JavaScript source code on contract...\n");

  const CONTRACT_ADDRESS = "0xD66544E49c7407AcdE0a577BFB176f950a18DAAA";

  // Read the source code from functions-source.js
  const sourceCode = fs.readFileSync("./functions-source.js", "utf8");

  console.log("📄 Source code loaded:");
  console.log("─".repeat(60));
  console.log(sourceCode.substring(0, 200) + "...");
  console.log("─".repeat(60));
  console.log(`Total length: ${sourceCode.length} characters\n`);

  // Get contract instance
  const contract = await hre.ethers.getContractAt(
    "YouTubeOracleFunctions",
    CONTRACT_ADDRESS
  );

  console.log("📍 Contract:", CONTRACT_ADDRESS);
  console.log("🌐 Network:", hre.network.name);

  // Check current owner
  const owner = await contract.owner();
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Owner:", owner);
  console.log("💼 Your address:", signer.address);

  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    console.error("\n❌ Error: You are not the contract owner!");
    console.log("   Owner:", owner);
    console.log("   Your address:", signer.address);
    process.exit(1);
  }

  console.log("\n⏳ Setting source code...");

  try {
    const tx = await contract.setSourceCode(sourceCode);
    console.log("📤 Transaction hash:", tx.hash);
    
    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Source code set successfully!");
    console.log("   Block:", receipt.blockNumber);
    console.log("   Gas used:", receipt.gasUsed.toString());

    // Verify it was set
    const storedCode = await contract.sourceCode();
    console.log("\n✅ Verification:");
    console.log("   Source code is now stored on-chain");
    console.log("   Length:", storedCode.length, "characters");

    console.log("\n🎉 Setup complete!");
    console.log("\n📋 Next steps:");
    console.log("   1. Test with: contract.requestViews()");
    console.log("   2. Wait 1-2 minutes");
    console.log("   3. Check: contract.latestViews()");

  } catch (error) {
    console.error("\n❌ Error setting source code:");
    console.error(error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Tip: Make sure you have enough Arbitrum Sepolia ETH for gas");
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
