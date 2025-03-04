const fs = require('fs');
const path = require('path');

// Path to the avatar photos directory
const avatarDir = path.join(__dirname, 'images', 'avatar-photos');

// Categories based on filename patterns
const categoryPatterns = [
    { pattern: /android|bot|robot/, category: 'robots' },
    { pattern: /sloth/, category: 'sloths' },
    { pattern: /cat|dog|fox|monkey|penguin|koala|animal/, category: 'animals' },
    { pattern: /icon|cloud|api|vision|words/, category: 'abstract' }
];

// Function to determine category based on filename
function determineCategory(filename) {
    for (const { pattern, category } of categoryPatterns) {
        if (pattern.test(filename.toLowerCase())) {
            return category;
        }
    }
    return 'other'; // Default category
}

// Function to generate a display name from filename
function generateDisplayName(filename) {
    // Remove extension and replace hyphens with spaces
    const name = filename.replace(/\.webp$/, '').replace(/-/g, ' ');
    
    // Capitalize each word
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Read all files in the avatar directory
fs.readdir(avatarDir, (err, files) => {
    if (err) {
        console.error('Error reading avatar directory:', err);
        return;
    }
    
    // Filter for webp files only
    const avatarFiles = files.filter(file => file.endsWith('.webp'));
    
    // Create avatar data array
    const avatarData = avatarFiles.map(file => ({
        file,
        category: determineCategory(file),
        name: generateDisplayName(file)
    }));
    
    // Write to JSON file
    fs.writeFileSync(
        path.join(__dirname, 'avatar-list.json'),
        JSON.stringify(avatarData, null, 2)
    );
    
    console.log(`Generated avatar list with ${avatarData.length} images`);
});