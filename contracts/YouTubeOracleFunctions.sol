// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * @title YouTubeOracleFunctions
 * @notice Chainlink Functions consumer for fetching YouTube video statistics
 * @dev Uses Chainlink Functions DON for serverless YouTube API calls
 */
contract YouTubeOracleFunctions is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // State variables
    bytes32 public lastRequestId;
    bytes public lastResponse;
    bytes public lastError;
    
    uint256 public latestViews;
    uint256 public latestLikes;
    
    // Configuration
    uint64 public subscriptionId;
    uint32 public gasLimit;
    bytes32 public donID;
    
    // Trigger thresholds
    uint256 public constant INITIAL_VIEWS_TARGET = 525;
    uint256 public constant VIEWS_INCREMENT = 5;
    uint256 public constant LIKES_INCREMENT = 25;
    
    // Trigger tracking
    uint256 private nextViewsTrigger;
    uint256 private nextLikesTrigger;
    
    // YouTube video being tracked
    string public youtubeVideoId;
    
    // JavaScript source code for Chainlink Functions
    string public sourceCode;

    // Events
    event Response(bytes32 indexed requestId, bytes response, bytes err);
    event ViewsUpdated(uint256 newViews, bytes32 requestId);
    event LikesUpdated(uint256 newLikes, bytes32 requestId);
    event ViewsTriggerMet(uint256 viewsCount);
    event LikesTriggerMet(uint256 likesCount);

    /**
     * @notice Initialize the contract
     * @param router Chainlink Functions router address
     * @param _subscriptionId Chainlink Functions subscription ID
     * @param _donID DON ID for the Chainlink Functions DON
     * @param _youtubeVideoId YouTube video ID to track
     */
    constructor(
        address router,
        uint64 _subscriptionId,
        bytes32 _donID,
        string memory _youtubeVideoId
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        subscriptionId = _subscriptionId;
        donID = _donID;
        gasLimit = 300000;
        youtubeVideoId = _youtubeVideoId;
        
        nextViewsTrigger = INITIAL_VIEWS_TARGET;
        nextLikesTrigger = LIKES_INCREMENT;
    }

    /**
     * @notice Set the JavaScript source code for Functions
     * @param _sourceCode The JavaScript code to execute
     */
    function setSourceCode(string memory _sourceCode) external onlyOwner {
        sourceCode = _sourceCode;
    }

    /**
     * @notice Request YouTube views data
     * @return requestId The ID of the request
     */
    function requestViews() external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sourceCode);
        
        // Set arguments: [videoId, endpoint]
        string[] memory args = new string[](2);
        args[0] = youtubeVideoId;
        args[1] = "views";
        req.setArgs(args);

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        
        lastRequestId = requestId;
        return requestId;
    }

    /**
     * @notice Request YouTube likes data
     * @return requestId The ID of the request
     */
    function requestLikes() external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sourceCode);
        
        // Set arguments: [videoId, endpoint]
        string[] memory args = new string[](2);
        args[0] = youtubeVideoId;
        args[1] = "likes";
        req.setArgs(args);

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        
        lastRequestId = requestId;
        return requestId;
    }

    /**
     * @notice Callback function for Chainlink Functions
     * @param requestId The request ID
     * @param response The response data
     * @param err Any error that occurred
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        lastResponse = response;
        lastError = err;
        
        emit Response(requestId, response, err);
        
        if (response.length > 0) {
            // Decode the response (uint256)
            uint256 value = abi.decode(response, (uint256));
            
            // Determine if this was views or likes based on value comparison
            // This is a simplified approach - in production you'd want better tracking
            if (value > latestViews) {
                // Likely a views update
                latestViews = value;
                emit ViewsUpdated(value, requestId);
                
                // Check trigger
                if (value >= nextViewsTrigger) {
                    emit ViewsTriggerMet(value);
                    
                    if (value >= INITIAL_VIEWS_TARGET) {
                        uint256 currentMultiple = (value - INITIAL_VIEWS_TARGET) / VIEWS_INCREMENT;
                        nextViewsTrigger = INITIAL_VIEWS_TARGET + ((currentMultiple + 1) * VIEWS_INCREMENT);
                    }
                }
            } else {
                // Likely a likes update
                latestLikes = value;
                emit LikesUpdated(value, requestId);
                
                // Check trigger
                if (value >= nextLikesTrigger) {
                    emit LikesTriggerMet(value);
                    
                    uint256 currentMultiple = value / LIKES_INCREMENT;
                    nextLikesTrigger = (currentMultiple + 1) * LIKES_INCREMENT;
                }
            }
        }
    }

    /**
     * @notice Update the YouTube video ID
     * @param _newVideoId New YouTube video ID
     */
    function updateVideoId(string memory _newVideoId) external onlyOwner {
        youtubeVideoId = _newVideoId;
    }

    /**
     * @notice Update subscription ID
     * @param _subscriptionId New subscription ID
     */
    function updateSubscriptionId(uint64 _subscriptionId) external onlyOwner {
        subscriptionId = _subscriptionId;
    }

    /**
     * @notice Update gas limit for Functions requests
     * @param _gasLimit New gas limit
     */
    function updateGasLimit(uint32 _gasLimit) external onlyOwner {
        gasLimit = _gasLimit;
    }

    /**
     * @notice Get current trigger thresholds
     * @return nextViews Next views trigger
     * @return nextLikes Next likes trigger
     */
    function getTriggers() external view returns (uint256 nextViews, uint256 nextLikes) {
        return (nextViewsTrigger, nextLikesTrigger);
    }
}
