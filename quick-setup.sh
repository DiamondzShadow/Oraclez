#!/bin/bash

# Quick Setup Script for YouTube Stats Chainlink Adapter
# This script helps you set up your environment quickly

echo "🚀 YouTube Stats Chainlink Adapter - Quick Setup"
echo "================================================"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Your existing .env file was not modified."
        exit 0
    fi
fi

# Copy .env.example to .env
echo "📝 Creating .env file from template..."
cp .env.example .env
echo "✅ .env file created!"
echo ""

# Prompt for YouTube API Key
echo "📺 YouTube API Key Setup"
echo "------------------------"
echo "You need a YouTube Data API v3 key from Google Cloud Console"
echo "Get it here: https://console.cloud.google.com/apis/credentials"
echo ""
read -p "Enter your YouTube API Key (or press Enter to skip): " YOUTUBE_KEY

if [ ! -z "$YOUTUBE_KEY" ]; then
    # Update the .env file with the API key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/YOUTUBE_API_KEY=your_youtube_api_key_here/YOUTUBE_API_KEY=$YOUTUBE_KEY/" .env
    else
        # Linux
        sed -i "s/YOUTUBE_API_KEY=your_youtube_api_key_here/YOUTUBE_API_KEY=$YOUTUBE_KEY/" .env
    fi
    echo "✅ YouTube API Key configured!"
else
    echo "⚠️  Skipped. You'll need to add it to .env manually later."
fi

echo ""
echo "✨ Environment file setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Run the SQL script in Supabase (see SETUP_INSTRUCTIONS.md)"
echo "2. If you skipped the YouTube key, edit .env and add it"
echo "3. Install dependencies: npm install"
echo "4. Start the server: npm start"
echo ""
echo "📚 For detailed instructions, see: SETUP_INSTRUCTIONS.md"
echo ""
