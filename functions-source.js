// Chainlink Functions JavaScript source code
// This code runs in the Chainlink Functions DON to fetch YouTube statistics

// Arguments passed from smart contract:
// args[0] = videoId (e.g., "LQAFm01IOT0")
// args[1] = endpoint ("views" or "likes")

const videoId = args[0];
const endpoint = args[1];

if (!videoId) {
  throw Error("Missing videoId parameter");
}

if (!endpoint || (endpoint !== "views" && endpoint !== "likes")) {
  throw Error("Invalid endpoint. Must be 'views' or 'likes'");
}

// YouTube API endpoint
const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${secrets.apiKey}`;

console.log(`Fetching ${endpoint} for video: ${videoId}`);

// Make HTTP request to YouTube API
const youtubeResponse = await Functions.makeHttpRequest({
  url: url,
  method: "GET",
});

// Check for errors
if (youtubeResponse.error) {
  console.error("YouTube API Error:", youtubeResponse.error);
  throw Error(`YouTube API request failed: ${youtubeResponse.message}`);
}

const data = youtubeResponse.data;

// Validate response
if (!data.items || data.items.length === 0) {
  throw Error(`Video not found: ${videoId}`);
}

const statistics = data.items[0].statistics;

// Extract the requested statistic
let value;
if (endpoint === "views") {
  value = statistics.viewCount;
} else if (endpoint === "likes") {
  value = statistics.likeCount;
}

if (!value) {
  throw Error(`${endpoint} data not available for video ${videoId}`);
}

console.log(`${endpoint}: ${value}`);

// Return as uint256 (Functions.encodeUint256)
return Functions.encodeUint256(BigInt(value));
