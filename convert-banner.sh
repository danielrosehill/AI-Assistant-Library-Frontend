#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it first."
    echo "On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "On macOS with Homebrew: brew install imagemagick"
    exit 1
fi

# Convert WebP to JPG
echo "Converting banner.webp to banner-fb.jpg..."
convert banner.webp -quality 95 banner-fb.jpg

# Verify the file was created
if [ -f "banner-fb.jpg" ]; then
    echo "Conversion successful! banner-fb.jpg created."
    echo "File size:"
    du -h banner-fb.jpg
else
    echo "Conversion failed."
    exit 1
fi

echo "Done!"