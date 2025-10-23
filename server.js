require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js'); // Import Supabase client
const app = express();
const port = process.env.PORT || 8080;

// --- Supabase Configuration ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Using the anon key you provided

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables.");
    process.exit(1); // Exit if critical env vars are missing
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initial internal state (will be loaded from Supabase)
// IMPORTANT: THESE WILL BE OVERWRITTEN BY DATABASE VALUES ON STARTUP.
// Ensure your adapter's logic accounts for this initial load for each unique videoId.
const adapterState = {}; // Object to hold state for different video IDs

app.use(express.json());

console.log(`External Adapter listening on port ${port}`);

// --- Helper function to fetch YouTube data ---
async function fetchYouTubeStats(videoId) {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
        console.error("YOUTUBE_API_KEY is not set in environment variables.");
        return { views: 0, likes: 0, error: "API key missing" };
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=statistics`;

    try {
        const response = await axios.get(url);
        const items = response.data.items;
        if (items && items.length > 0) {
            const statistics = items[0].statistics;
            const viewCount = parseInt(statistics.viewCount || '0');
            const likeCount = parseInt(statistics.likeCount || '0');
            return { views: viewCount, likes: likeCount, error: null };
        } else {
            return { views: 0, likes: 0, error: "Video not found or no statistics" };
        }
    } catch (error) {
        console.error(`Error fetching YouTube data for videoId ${videoId}:`, error.message);
        return { views: 0, likes: 0, error: error.message };
    }
}

// --- Function to load state from Supabase ---
async function loadAdapterState(videoId) {
    const { data, error } = await supabase
        .from('adapter_state')
        .select('*')
        .eq('id', videoId)
        .single(); // Expecting one row for each videoId

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error(`Error loading state for videoId ${videoId}:`, error.message);
        return null; // Indicate failure to load
    }

    if (data) {
        console.log(`Loaded state for videoId ${videoId}:`, data);
        return {
            lastViewsCount: data.last_views_count,
            lastLikesCount: data.last_likes_count,
            lastLikesTriggeredMultiple: data.last_likes_triggered_multiple
        };
    } else {
        // Initialize default state if no record found
        const initialLikesCount = parseInt(process.env.INITIAL_LIKES_COUNT || '0'); // Still use env for initial if new
        const initialState = {
            lastViewsCount: 0,
            lastLikesCount: initialLikesCount,
            lastLikesTriggeredMultiple: Math.floor(initialLikesCount / 25) * 25
        };
        console.log(`No state found for videoId ${videoId}. Initializing to:`, initialState);
        return initialState;
    }
}

// --- Function to save state to Supabase ---
async function saveAdapterState(videoId, state) {
    const { data, error } = await supabase
        .from('adapter_state')
        .upsert({ // upsert will insert if ID doesn't exist, update if it does
            id: videoId,
            last_views_count: state.lastViewsCount,
            last_likes_count: state.lastLikesCount,
            last_likes_triggered_multiple: state.lastLikesTriggeredMultiple,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'id' // Specify the primary key to use for conflict resolution
        });

    if (error) {
        console.error(`Error saving state for videoId ${videoId}:`, error.message);
        return false;
    }
    console.log(`Saved state for videoId ${videoId}.`);
    return true;
}


// --- Chainlink External Adapter Endpoint ---
app.post('/', async (req, res) => {
    const { id, data } = req.body;
    const videoId = data.videoId;
    const endpoint = data.endpoint;

    if (!videoId || !endpoint) {
        return res.status(400).json({ jobRunID: id, status: 'errored', error: 'Missing videoId or endpoint' });
    }

    // Load the current state for this videoId
    let currentState = adapterState[videoId];
    if (!currentState) {
        currentState = await loadAdapterState(videoId);
        if (!currentState) {
            return res.status(500).json({ jobRunID: id, status: 'errored', error: `Failed to load initial state for videoId ${videoId}` });
        }
        adapterState[videoId] = currentState; // Store in memory for this run
    }

    const { views, likes, error } = await fetchYouTubeStats(videoId);

    if (error) {
        return res.status(500).json({ jobRunID: id, status: 'errored', error: `Failed to fetch YouTube data: ${error}` });
    }

    let valueToSend = 0;
    let shouldTrigger = false;

    // Use currentState for checks and update it
    if (endpoint === 'views') {
        valueToSend = views;
        if (views >= 525) {
            if (currentState.lastViewsCount < 525) {
                shouldTrigger = true;
            } else if (Math.floor(views / 5) > Math.floor(currentState.lastViewsCount / 5)) {
                shouldTrigger = true;
            }
        }
        currentState.lastViewsCount = views; // Update state in memory
    } else if (endpoint === 'likes') {
        valueToSend = likes;
        const currentLikesMultiple = Math.floor(likes / 25) * 25;

        if (currentLikesMultiple > currentState.lastLikesTriggeredMultiple) {
            shouldTrigger = true;
            currentState.lastLikesTriggeredMultiple = currentLikesMultiple; // Update state in memory
        }
        currentState.lastLikesCount = likes; // Update state in memory
    } else {
        return res.status(400).json({ jobRunID: id, status: 'errored', error: `Unknown endpoint: ${endpoint}` });
    }

    // --- Persist the updated state to Supabase ---
    await saveAdapterState(videoId, currentState);

    res.status(200).json({
        jobRunID: id,
        data: {
            value: valueToSend,
            views: views,
            likes: likes,
            shouldTrigger: shouldTrigger
        },
        result: valueToSend,
        statusCode: 200
    });

    console.log(`Processed request for videoId: ${videoId}, endpoint: ${endpoint}. Views: ${views}, Likes: ${likes}. Should trigger: ${shouldTrigger}. State saved.`);
});

app.listen(port, () => {
    console.log(`External Adapter listening on port ${port}`);
});
