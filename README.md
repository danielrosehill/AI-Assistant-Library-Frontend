# AI Assistant Library

A static website showcasing a collection of AI assistant configurations and system prompts created by Daniel Rosehill between 2024 and 2025. The site is deployed at [aiagents.bydanielrosehill.com](https://aiagents.bydanielrosehill.com).

## Features

- Displays a navigable list of AI assistant configurations
- Search functionality to find specific configurations
- Reset button for search
- Clipboard functionality to copy system prompts
- Download configurations as markdown files
- Responsive design for desktop and mobile devices
- Flamboyant and eccentric design
- Clickable avatar images with modal view
- SEO optimized

## Project Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styling
- `scripts.js` - JavaScript functionality
- `build.js` - Node.js script to process markdown files
- `configs/` - Original markdown configuration files
- `generated-configs/` - Generated JSON files for each configuration
- `configs-list.json` - Generated JSON file with all configurations
- `images/avatar-photos/` - Avatar images for configurations
- `favicon.ico` - Website favicon
- `.github/workflows/deploy.yml` - GitHub Actions workflow for Cloudflare Pages deployment

## How to Build

1. Make sure you have Node.js installed
2. Install dependencies (optional, only needed for the serve script):

```bash
npm install
```

3. You can build the site in two ways:

### Option 1: Automated Build (Recommended)

Run the build-all.sh script to automatically process all files:

```bash
# Make the script executable
chmod +x build-all.sh

# Run the script
./build-all.sh
```

Or use the npm script:

```bash
npm run build:all
```

### Option 2: Manual Batch Processing

Run the build script manually to process the markdown files. The script processes files in batches to handle the large number of configurations:

```bash
# Process the first batch of files (default: 50 files)
node build.js

# Process the next batch (the script will tell you the command to run)
node build.js 50 50

# Continue until all files are processed
```

This will:
- Read all markdown files in the `configs/` directory
- Parse each file to extract the name, description, and system prompt
- Match each configuration with an appropriate avatar image
- Generate JSON files for each configuration in the `generated-configs/` directory
- Create a `configs-list.json` file with metadata about all configurations

### Batch Processing

The build script processes files in batches to handle the large number of configurations. By default, it processes 50 files at a time. You can customize the batch size by providing a second argument:

```bash
node build.js [startIndex] [batchSize]
```
## How to Run Locally

You can run the website locally using any static file server. For example:

```bash
# Using Python
python3 -m http.server

# Using Node.js
npx serve

# Or using the npm script
npm run serve
```

Then open your browser and navigate to `http://localhost:8000` (or the port specified by your server).

## How to Deploy to Cloudflare Pages

### Option 1: Automatic Deployment (Recommended)

This project includes a GitHub Actions workflow that automatically builds and deploys the website to Cloudflare Pages whenever changes are pushed to the main branch.

1. Push the entire project to a GitHub repository
2. Set up the following secrets in your GitHub repository:
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token with Pages permissions
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
3. Push a change to the main branch or manually trigger the workflow
4. Your website will be automatically built and deployed to Cloudflare Pages
5. In the Cloudflare Pages dashboard, set up the custom domain `aiagents.bydanielrosehill.com`

### Option 2: Manual Deployment

If you prefer to deploy manually:

1. Build the website locally using the build script
2. Log in to your Cloudflare dashboard
3. Navigate to Pages and create a new project
4. Upload your built files
5. Configure the custom domain to `aiagents.bydanielrosehill.com`

Your website will be available at `https://aiagents.bydanielrosehill.com`

## Customization

- **Banner Image**: Replace `banner.webp` with your own banner image
- **Colors**: Edit the CSS variables in `styles.css` to change the color scheme
- **Fonts**: The website uses Google Fonts, which can be changed in `index.html` and `styles.css`
- **SEO**: Update the meta tags in `index.html` to customize SEO settings

## NPM Scripts

The project includes several npm scripts to make development easier:

- `npm run build` - Run the build script once (processes a batch of files)
- `npm run build:all` - Run the build-all.sh script to process all files
- `npm run serve` - Start a local development server

## License

This project is created for Daniel Rosehill and contains his AI assistant configurations.
