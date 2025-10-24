// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/operatorforwarder/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * @title YouTubeOracleConsumer
 * @notice A Chainlink consumer contract that fetches YouTube video statistics (views and likes)
 * @dev Uses Chainlink External Adapter for YouTube API integration with trigger logic
 */
contract YouTubeOracleConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // State variables for latest stats
    uint256 public latestViews;
    uint256 public latestLikes;
    
    // Trigger thresholds
    uint256 public constant INITIAL_VIEWS_TARGET = 525;
    uint256 public constant VIEWS_INCREMENT = 5;
    uint256 public constant LIKES_INCREMENT = 25;

    // Events
    event ViewsUpdated(uint256 newViews, bytes32 requestId);
    event LikesUpdated(uint256 newLikes, bytes32 requestId);
    event ViewsTriggerMet(uint256 viewsCount);
    event LikesTriggerMet(uint256 likesCount);
    event RequestFailed(bytes32 requestId, string errorMessage);

    // Trigger tracking
    uint256 private nextViewsTrigger;
    uint256 private nextLikesTrigger;

    // Chainlink configuration
    bytes32 private jobIdForViews;
    bytes32 private jobIdForLikes;
    uint256 private fee;

    // YouTube video ID being tracked
    string public youtubeVideoId;

    /**
     * @notice Initialize the contract with Chainlink configuration
     * @dev Network: Sepolia
     * @param _jobIdForViews Job ID for views endpoint
     * @param _jobIdForLikes Job ID for likes endpoint
     * @param _youtubeVideoId YouTube video ID to track (e.g., "dQw4w9WgXcQ")
     */
    constructor(
        bytes32 _jobIdForViews,
        bytes32 _jobIdForLikes,
        string memory _youtubeVideoId
    ) ConfirmedOwner(msg.sender) {
        // Sepolia testnet LINK token
        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        
        jobIdForViews = _jobIdForViews;
        jobIdForLikes = _jobIdForLikes;
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0.1 LINK per request
        youtubeVideoId = _youtubeVideoId;

        nextViewsTrigger = INITIAL_VIEWS_TARGET;
        nextLikesTrigger = LIKES_INCREMENT;
    }

    /**
     * @notice Request current views count from external adapter
     * @dev Makes a Chainlink request to fetch YouTube views
     * @return requestId The ID of the Chainlink request
     */
    function requestViews() public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobIdForViews,
            address(this),
            this.fulfillViews.selector
        );

        req.add("videoId", youtubeVideoId);
        req.add("endpoint", "views");

        return _sendChainlinkRequest(req, fee);
    }

    /**
     * @notice Request current likes count from external adapter
     * @dev Makes a Chainlink request to fetch YouTube likes
     * @return requestId The ID of the Chainlink request
     */
    function requestLikes() public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobIdForLikes,
            address(this),
            this.fulfillLikes.selector
        );

        req.add("videoId", youtubeVideoId);
        req.add("endpoint", "likes");

        return _sendChainlinkRequest(req, fee);
    }

    /**
     * @notice Callback function for views data
     * @dev Called by Chainlink node with views data
     * @param _requestId The request ID
     * @param _newViews The current views count
     */
    function fulfillViews(bytes32 _requestId, uint256 _newViews)
        public
        recordChainlinkFulfillment(_requestId)
    {
        latestViews = _newViews;
        emit ViewsUpdated(_newViews, _requestId);

        // Check if trigger threshold is met
        if (_newViews >= nextViewsTrigger) {
            emit ViewsTriggerMet(_newViews);
            
            // Calculate next trigger point
            if (_newViews >= INITIAL_VIEWS_TARGET) {
                uint256 currentMultiple = (_newViews - INITIAL_VIEWS_TARGET) / VIEWS_INCREMENT;
                nextViewsTrigger = INITIAL_VIEWS_TARGET + ((currentMultiple + 1) * VIEWS_INCREMENT);
            }
        }
    }

    /**
     * @notice Callback function for likes data
     * @dev Called by Chainlink node with likes data
     * @param _requestId The request ID
     * @param _newLikes The current likes count
     */
    function fulfillLikes(bytes32 _requestId, uint256 _newLikes)
        public
        recordChainlinkFulfillment(_requestId)
    {
        latestLikes = _newLikes;
        emit LikesUpdated(_newLikes, _requestId);

        // Check if trigger threshold is met
        if (_newLikes >= nextLikesTrigger) {
            emit LikesTriggerMet(_newLikes);
            
            // Calculate next trigger point
            uint256 currentMultiple = _newLikes / LIKES_INCREMENT;
            nextLikesTrigger = (currentMultiple + 1) * LIKES_INCREMENT;
        }
    }

    /**
     * @notice Update the YouTube video ID being tracked
     * @param _newVideoId New YouTube video ID
     */
    function updateVideoId(string memory _newVideoId) public onlyOwner {
        youtubeVideoId = _newVideoId;
    }

    /**
     * @notice Update job IDs for views and likes
     * @param _jobIdForViews New job ID for views
     * @param _jobIdForLikes New job ID for likes
     */
    function updateJobIds(bytes32 _jobIdForViews, bytes32 _jobIdForLikes) public onlyOwner {
        jobIdForViews = _jobIdForViews;
        jobIdForLikes = _jobIdForLikes;
    }

    /**
     * @notice Update the fee amount for requests
     * @param _newFee New fee in Juels (1 LINK = 10^18 Juels)
     */
    function updateFee(uint256 _newFee) public onlyOwner {
        fee = _newFee;
    }

    /**
     * @notice Get current trigger thresholds
     * @return nextViews Next views trigger threshold
     * @return nextLikes Next likes trigger threshold
     */
    function getTriggers() public view returns (uint256 nextViews, uint256 nextLikes) {
        return (nextViewsTrigger, nextLikesTrigger);
    }

    /**
     * @notice Withdraw LINK tokens from contract
     * @dev Only owner can withdraw
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    /**
     * @notice Get contract's LINK balance
     * @return balance LINK balance in Juels
     */
    function getLinkBalance() public view returns (uint256) {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        return link.balanceOf(address(this));
    }
}
