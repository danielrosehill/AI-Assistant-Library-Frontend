const fs = require('fs');
const path = require('path');

// Configuration
const BATCH_SIZE = 50; // Process 50 files at a time

// Paths
const configsDir = path.join(__dirname, 'configs');
const imagesDir = path.join(__dirname, 'images/avatar-photos');
const outputDir = path.join(__dirname, 'generated-configs');
const outputListFile = path.join(__dirname, 'configs-list.json');

// Command line arguments
const args = process.argv.slice(2);
const startIndex = parseInt(args[0]) || 0;
const batchSize = parseInt(args[1]) || BATCH_SIZE;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all markdown files and sort them alphabetically
const configFiles = fs.readdirSync(configsDir)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));

// Get all image files
const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.webp'));

// Determine which files to process in this batch
const endIndex = Math.min(startIndex + batchSize, configFiles.length);
const filesToProcess = configFiles.slice(startIndex, endIndex);

console.log(`Processing files ${startIndex + 1} to ${endIndex} of ${configFiles.length}`);
console.log(`Found ${imageFiles.length} image files.`);

// Load existing configs list if it exists
let configsList = [];
if (fs.existsSync(outputListFile)) {
    try {
        configsList = JSON.parse(fs.readFileSync(outputListFile, 'utf8'));
        console.log(`Loaded ${configsList.length} existing configurations from configs-list.json`);
    } catch (error) {
        console.error('Error loading existing configs-list.json:', error);
    }
}

// Process each configuration file in this batch
filesToProcess.forEach(file => {
    try {
        const filePath = path.join(configsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Parse the markdown content
        const name = extractSection(content, '# Name', '# Description').trim();
        const description = extractSection(content, '# Description', '# System Prompt').trim();
        const systemPrompt = extractSection(content, '# System Prompt', null).trim();
        
        if (!name || !description || !systemPrompt) {
            console.warn(`Skipping ${file}: Missing required sections`);
            return;
        }
        
        // Find a matching avatar image
        const avatar = findMatchingAvatar(file, name, imageFiles);
        
        // Create JSON data for this configuration
        const configData = {
            name,
            description,
            systemPrompt,
            avatar: avatar ? `images/avatar-photos/${avatar}` : null
        };
        
        // Save individual JSON file
        const jsonFilename = file.replace('.md', '.json');
        fs.writeFileSync(path.join(outputDir, jsonFilename), JSON.stringify(configData, null, 2));

        // Check if this configuration is already in the list
        const existingIndex = configsList.findIndex(c => c.filename === jsonFilename);
        if (existingIndex !== -1) {
            // Update existing entry
            configsList[existingIndex] = { ...configData, filename: jsonFilename };
        } else {
            // Add to the list
            configsList.push({
                name,
                description,
                systemPrompt,
                filename: jsonFilename,
                avatar: avatar ? `images/avatar-photos/${avatar}` : null
            });
        }
        
        console.log(`Processed: ${file} (${configsList.length} total)`);
    } catch (error) {
        console.error(`Error processing ${file}:`, error);
    }
});

// Sort the list alphabetically by name
configsList.sort((a, b) => a.name.localeCompare(b.name));

// Save the updated list
fs.writeFileSync(outputListFile, JSON.stringify(configsList, null, 2));
console.log(`Updated configs-list.json with ${configsList.length} configurations.`);

// Print progress information
if (endIndex < configFiles.length) {
    console.log(`\nTo process the next batch, run:`);
    const nextCommand = `node build.js ${endIndex} ${batchSize}`;
    console.log(nextCommand);
    
    // Write to output file for build-all.sh
    fs.appendFileSync('build-output.txt', `To process the next batch, run:\n${nextCommand}\n`);
} else {
    console.log(`\nAll files processed successfully!`);
    
    // Write completion to output file
    fs.appendFileSync('build-output.txt', `All files processed successfully!\n`);
}

// Helper function to extract a section from markdown
function extractSection(content, startMarker, endMarker) {
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return '';
    
    const startContentIndex = startIndex + startMarker.length;
    
    let endContentIndex;
    if (endMarker) {
        const endIndex = content.indexOf(endMarker, startContentIndex);
        endContentIndex = endIndex !== -1 ? endIndex : content.length;
    } else {
        endContentIndex = content.length;
    }
    
    return content.substring(startContentIndex, endContentIndex);
}

// Helper function to find a matching avatar image
function findMatchingAvatar(filename, name, imageFiles) {
    // Remove extension from filename
    const baseFilename = path.basename(filename, '.md');
    
    // Try to find exact match by filename
    const exactMatch = imageFiles.find(img => {
        const imgBase = path.basename(img, '.webp');
        return imgBase.toLowerCase() === baseFilename.toLowerCase();
    });
    
    if (exactMatch) return exactMatch;
    
    // Try to find partial matches
    const partialMatches = imageFiles.filter(img => {
        const imgBase = path.basename(img, '.webp').toLowerCase();
        const filenameWords = baseFilename.toLowerCase().split(/[-_\s]+/);
        
        // Check if any word from the filename is in the image name
        return filenameWords.some(word => 
            word.length > 3 && imgBase.includes(word)
        );
    });
    
    if (partialMatches.length > 0) {
        // Return the first match
        return partialMatches[0];
    }
    
    // If no match found, try to find a thematically appropriate image
    // This is a simple approach - in a real system, you might use more sophisticated matching
    
    // Keywords to image mappings
    const keywordMappings = [
        { keywords: ['sloth', 'slow', 'lazy'], images: imageFiles.filter(img => img.includes('sloth')) },
        { keywords: ['tech', 'code', 'developer', 'programming'], images: imageFiles.filter(img => img.includes('laptop') || img.includes('computer')) },
        { keywords: ['android', 'robot', 'ai', 'assistant'], images: imageFiles.filter(img => img.includes('android') || img.includes('bot')) },
        { keywords: ['business', 'corporate', 'company'], images: imageFiles.filter(img => img.includes('business') || img.includes('corporate')) },
        { keywords: ['document', 'text', 'writing'], images: imageFiles.filter(img => img.includes('doc') || img.includes('text')) }
    ];
    
    for (const mapping of keywordMappings) {
        const matchesKeyword = mapping.keywords.some(keyword => 
            baseFilename.toLowerCase().includes(keyword) || 
            name.toLowerCase().includes(keyword)
        );
        
        if (matchesKeyword && mapping.images.length > 0) {
            // Return a random image from the matching category
            return mapping.images[Math.floor(Math.random() * mapping.images.length)];
        }
    }
    
    // If still no match, return a random image
    return imageFiles[Math.floor(Math.random() * imageFiles.length)];
}