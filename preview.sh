#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting local preview server...${NC}"

# Make sure dependencies are installed
echo -e "${YELLOW}Making sure dependencies are installed...${NC}"
npm install

# Start the local development server using locally installed Wrangler
echo -e "${YELLOW}Starting Wrangler development server...${NC}"
echo -e "${GREEN}Your site will be available at http://localhost:8788${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"

# Run wrangler dev with the --local flag to use local assets
npx wrangler dev --local

# This will keep running until the user presses Ctrl+C