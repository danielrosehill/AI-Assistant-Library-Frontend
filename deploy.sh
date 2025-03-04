#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment to Cloudflare...${NC}"

# Make sure dependencies are installed
echo -e "${YELLOW}Making sure dependencies are installed...${NC}"
npm install

# Check if user is logged in to Cloudflare using locally installed Wrangler
echo -e "${YELLOW}Checking Cloudflare authentication...${NC}"
if ! npx wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}You need to log in to Cloudflare:${NC}"
    npx wrangler login
fi

# Deploy the site
echo -e "${YELLOW}Deploying site to Cloudflare Pages...${NC}"
npx wrangler pages deploy ./ --project-name=ai-assistant-library

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${GREEN}Your site should now be available on Cloudflare.${NC}"
else
    echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
    exit 1
fi