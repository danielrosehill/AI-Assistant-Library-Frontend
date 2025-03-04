document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loadingModal = document.getElementById('loading-modal');
    const randomAvatarContainer = document.getElementById('random-avatar-container');
    const loadingProgressBar = document.getElementById('loading-progress-bar');
    const configList = document.getElementById('config-list');
    const configDisplay = document.getElementById('config-display');
    const welcomeMessage = document.getElementById('welcome-message');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resetSearchButton = document.getElementById('reset-search-button');
    const avatarModal = document.getElementById('avatar-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.querySelector('.modal-close');
    
    // List of funny avatar images to randomly select from
    const avatarImages = [
        'http://localhost:3000/images/avatar-photos/glum-android.webp',
        'http://localhost:3000/images/avatar-photos/confused-looking-bot.webp',
        'http://localhost:3000/images/avatar-photos/unhappy-android-in-chair.webp',
        'http://localhost:3000/images/avatar-photos/bot-and-laptop-speech-bubble.webp',
        'http://localhost:3000/images/avatar-photos/sloth-detective.webp',
        'http://localhost:3000/images/avatar-photos/tech-support-penguin.webp',
        'http://localhost:3000/images/avatar-photos/cat-typing-on-computer.webp',
        'http://localhost:3000/images/avatar-photos/fox-typing.webp'
    ];
    
    // Select a random avatar for the loading modal
    function selectRandomAvatar() {
        const randomIndex = Math.floor(Math.random() * avatarImages.length);
        const avatarSrc = avatarImages[randomIndex];
        
        // Create and add the image element
        const avatarImg = document.createElement('img');
        avatarImg.src = avatarSrc;
        avatarImg.alt = 'Random AI Avatar';
        
        // Clear any existing content and add the new image
        if (randomAvatarContainer) {
            randomAvatarContainer.innerHTML = '';
            randomAvatarContainer.appendChild(avatarImg);
        }
    }
    
    // Animate the loading progress bar
    function animateProgressBar() {
        let progress = 0;
        const progressEmoji = document.querySelector('.progress-emoji');
        
        const interval = setInterval(() => {
            progress += 1;
            
            if (loadingProgressBar) {
                loadingProgressBar.style.width = `${progress}%`;
            }
            
            if (progressEmoji) {
                progressEmoji.style.left = `${progress}%`;
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    if (loadingModal) loadingModal.style.display = 'none';
                }, 500);
            }
        }, 50); // 50ms * 100 steps = ~5 seconds total
    }
    
    // Initialize loading animation
    selectRandomAvatar();
    animateProgressBar();
    
    // Store all configurations
    let allConfigurations = [];
    
    // Define categories for grouping configurations
    const categories = {
        "Productivity": ["assistant-ideator-productivity", "daily-planner", "chore-helper", "data-organisation-sidekick"],
        "Development": ["code-editor-general", "code-generation-general", "api-finder", "debugger-general-purpose", "android-development"],
        "Entertainment": ["assistant-ideator-entertainment", "adventure-sloth", "alien-visitor", "confused-ai-bot"],
        "Business": ["business-assistant-ideator", "company-approach-strategist", "communications-strategist-on-call"],
        "Data & Analysis": ["data-visualization-ideator", "data-scraping-agent", "data-trends-identifier"],
        "Writing & Editing": ["assistant-ideator-writing-and-editing", "biography-creator-third-person", "dictated-text-doctor"],
        "Tech Support": ["debugger-general-tech-suport", "cloudflare-helper", "tech-support-penguin"],
        "AI Tools": ["ai-agent-debugger", "ai-capability-advisor", "ai-tool-finder", "assistant-configuration-editor"],
        "Miscellaneous": [] // For items that don't fit other categories
    };
    
    // Fetch the list of configuration files
    fetch('configs-list.json')
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                configList.innerHTML = '<li>No configurations found. Please run the build script first.</li>';
                return;
            }
            
            allConfigurations = data;
            categorizeConfigurations(allConfigurations);
        })
        .catch(error => {
            console.error('Error fetching configurations:', error);
            configList.innerHTML = '<li>Error loading configurations. Please make sure configs-list.json exists.</li>';
        });
    
    // Categorize configurations and populate the sidebar
    function categorizeConfigurations(configurations) {
        // Sort configurations alphabetically by name
        configurations.sort((a, b) => a.name.localeCompare(b.name));
        
        // Group configurations by category
        const categorizedConfigs = {};
        
        // Initialize categories
        Object.keys(categories).forEach(category => {
            categorizedConfigs[category] = [];
        });
        
        // Assign configurations to categories
        configurations.forEach(config => {
            let assigned = false;
            
            // Check if the configuration matches any category
            for (const [category, patterns] of Object.entries(categories)) {
                if (patterns.some(pattern => 
                    config.filename.toLowerCase().includes(pattern.toLowerCase()) || 
                    config.name.toLowerCase().includes(pattern.toLowerCase())
                )) {
                    categorizedConfigs[category].push(config);
                    assigned = true;
                    break;
                }
            }
            
            // If not assigned to any category, put in Miscellaneous
            if (!assigned) {
                categorizedConfigs["Miscellaneous"].push(config);
            }
        });
        
        populateCategorizedList(categorizedConfigs);
        populateHomepageCategories(categorizedConfigs);
    }
    
    // Populate the homepage with category buttons
    function populateHomepageCategories(categorizedConfigs) {
        const welcomeMessage = document.getElementById('welcome-message');
        
        // Create category buttons container
        const categoryButtonsContainer = document.createElement('div');
        categoryButtonsContainer.className = 'category-buttons';
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = 'Browse by Category';
        heading.className = 'category-heading';
        categoryButtonsContainer.appendChild(heading);
        
        // Add category buttons
        Object.entries(categorizedConfigs).forEach(([category, configs]) => {
            if (configs.length > 0) {
                const categoryButton = document.createElement('div');
                categoryButton.className = 'category-button';
                
                // Get a random avatar from this category if available
                let avatarSrc = '';
                if (configs.length > 0) {
                    // Use a default avatar from the list for now
                    // We'll update this when we load the actual config data
                    avatarSrc = avatarImages[Math.floor(Math.random() * avatarImages.length)];
                }
                
                categoryButton.innerHTML = `
                    <img src="${avatarSrc}" alt="${category}" class="category-avatar">
                    <h4>${category}</h4>
                    <span class="config-count">${configs.length} configs</span>
                `;
                
                categoryButton.addEventListener('click', function() {
                    // Expand this category in the sidebar
                    const categoryHeader = document.querySelector(`.category-header[data-category="${category}"]`);
                    if (categoryHeader) {
                        categoryHeader.click();
                        // Scroll to the category in the sidebar
                        categoryHeader.scrollIntoView({ behavior: 'smooth' });
                    }
                });
                
                categoryButtonsContainer.appendChild(categoryButton);
            }
        });
        
        // Insert after the welcome avatars
        const welcomeAvatars = document.querySelector('.welcome-avatars');
        if (welcomeAvatars && welcomeAvatars.nextSibling) {
            welcomeMessage.insertBefore(categoryButtonsContainer, welcomeAvatars.nextSibling);
        } else {
            welcomeMessage.appendChild(categoryButtonsContainer);
        }
    }
    
    // Populate the sidebar with configuration links
    function populateConfigList(configurations) {
        // Sort configurations alphabetically by name
        configurations.sort((a, b) => a.name.localeCompare(b.name));
        
        // Clear existing list
        configList.innerHTML = '';
        
        // Add each configuration to the list
        configurations.forEach(config => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = config.name;
            link.setAttribute('data-filename', config.filename);
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                loadConfiguration(config.filename);
            });
            
            listItem.appendChild(link);
            configList.appendChild(listItem);
        });
    }
    
    // Populate the sidebar with categorized configuration links
    function populateCategorizedList(categorizedConfigs) {
        // Clear existing list
        configList.innerHTML = '';
        
        // Add each category and its configurations
        Object.entries(categorizedConfigs).forEach(([category, configs]) => {
            if (configs.length > 0) {
                const categoryItem = document.createElement('li');
                categoryItem.className = 'category-item';
                
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'category-header';
                categoryHeader.setAttribute('data-category', category);
                categoryHeader.innerHTML = `
                    <span class="category-name">${category}</span>
                    <span class="category-count">${configs.length}</span>
                    <i class="fas fa-chevron-down"></i>
                `;
                
                const categoryContent = document.createElement('ul');
                categoryContent.className = 'category-content';
                
                // Add configuration links
                configs.forEach(config => {
                    const configItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = config.name;
                    link.setAttribute('data-filename', config.filename);
                    
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        loadConfiguration(config.filename);
                    });
                    
                    configItem.appendChild(link);
                    categoryContent.appendChild(configItem);
                });
                
                // Toggle category expansion
                categoryHeader.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const content = this.nextElementSibling;
                    const allContents = document.querySelectorAll('.category-content');
                    
                    // Close other open categories
                    allContents.forEach(item => {
                        if (item !== content && item.style.maxHeight) {
                            item.style.maxHeight = null;
                            item.previousElementSibling.classList.remove('active');
                        }
                    });
                    
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
                
                categoryItem.appendChild(categoryHeader);
                categoryItem.appendChild(categoryContent);
                configList.appendChild(categoryItem);
            }
        });
    }
    
    // Load a specific configuration
    function loadConfiguration(filename) {
        fetch(`generated-configs/${filename}`)
            .then(response => response.json())
            .then(config => {
                displayConfiguration(config);
            })
            .catch(error => {
                console.error('Error loading configuration:', error);
                configDisplay.innerHTML = '<p>Error loading configuration</p>';
            });
    }
    
    // Display a configuration in the main content area
    function displayConfiguration(config) {
        if (!config) {
            configDisplay.innerHTML = '<p>Error: Configuration data is missing or invalid.</p>';
            welcomeMessage.style.display = 'none';
            configDisplay.style.display = 'block';
            return;
        }
        
        // Hide welcome message and show configuration display
        welcomeMessage.style.display = 'none';
        configDisplay.style.display = 'block';
        
        // Create HTML for the configuration
        let html = `
            <div class="config-header">
                ${config.avatar ? `<img src="${config.avatar}" alt="${config.name}" class="config-avatar" onclick="openModal('${config.avatar}', '${escapeJS(config.name)}')">` : ''}
                <div class="config-title">
                    <h2>${config.name}</h2>
                </div>
            </div>
            
            <div class="config-section">
                <h3>Description</h3>
                <p>${config.description}</p>
            </div>
            
            <div class="config-section">
                <h3>System Prompt</h3>
                <div class="system-prompt">
                    <pre>${config.systemPrompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                    <button class="copy-btn" onclick="copyToClipboard('${escapeJS(config.systemPrompt)}')">
                        <i class="fas fa-clipboard"></i> Copy
                    </button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="action-btn" onclick="copyAllToClipboard('${escapeJS(config.name)}', '${escapeJS(config.description)}', '${escapeJS(config.systemPrompt)}')">
                    <i class="fas fa-copy"></i> Copy All
                </button>
                <button class="action-btn" onclick="copyToClipboard('${escapeJS(config.systemPrompt)}')">
                    <i class="fas fa-clipboard"></i> Copy System Prompt
                </button>
                <button class="action-btn" onclick="downloadMarkdown('${escapeJS(config.name)}', '${escapeJS(config.description)}', '${escapeJS(config.systemPrompt)}')">
                    <i class="fas fa-download"></i> Download Markdown
                </button>
            </div>
        `;
        
        configDisplay.innerHTML = html;
    }
    
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Reset search functionality
    resetSearchButton.addEventListener('click', function() {
        searchInput.value = '';
        categorizeConfigurations(allConfigurations);
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            categorizeConfigurations(allConfigurations);
            return;
        }
        
        const filteredConfigs = allConfigurations.filter(config => 
            config.name.toLowerCase().includes(searchTerm) || 
            config.description.toLowerCase().includes(searchTerm) || 
            config.systemPrompt.toLowerCase().includes(searchTerm)
        );
        
        populateConfigList(filteredConfigs);
    }
    
    // Modal close event
    modalClose.addEventListener('click', function() {
        avatarModal.style.display = "none";
    });
    
    // Close modal when clicking outside the image
    window.addEventListener('click', function(event) {
        if (event.target === avatarModal) {
            avatarModal.style.display = "none";
        }
    });
});

// Helper function to escape special characters in JavaScript strings
function escapeJS(string) {
    return string
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

// Open modal for avatar image
function openModal(src, name) {
    const modal = document.getElementById('avatar-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    
    modal.style.display = "block";
    modalImg.src = src;
    modalCaption.innerHTML = name;
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('System prompt copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for browsers that don't support clipboard API
            fallbackCopyToClipboard(text);
        });
}

// Copy all configuration details to clipboard
function copyAllToClipboard(name, description, systemPrompt) {
    const text = `# ${name}\n\n${description}\n\n## System Prompt\n\n${systemPrompt}`;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('All configuration details copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for browsers that don't support clipboard API
            fallbackCopyToClipboard(text);
        });
}

// Download configuration as markdown file
function downloadMarkdown(name, description, systemPrompt) {
    const text = `# ${name}\n\n${description}\n\n## System Prompt\n\n${systemPrompt}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show toast notification
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
        
        // Add CSS for toast
        const style = document.createElement('style');
        style.textContent = `
            #toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(106, 13, 173, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-family: 'Orbitron', sans-serif;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            #toast.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Fallback clipboard function for browsers without clipboard API
function fallbackCopyToClipboard(text) {
    // Create textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // Select and copy
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
    
    if (success) {
        showToast('Copied to clipboard!');
    } else {
        showToast('Failed to copy text. Your browser may not support this feature.');
    }
}