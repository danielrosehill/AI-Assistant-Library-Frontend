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
    const randomConfigBtn = document.getElementById('random-config-btn');
    const mobileRandomConfigBtn = document.getElementById('mobile-random-config-btn');
    
    // Mobile search elements
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchButton = document.getElementById('mobile-search-button');
    const mobileResetButton = document.getElementById('mobile-reset-button');
    
    // List of funny avatar images to randomly select from
    const avatarImages = [
        '/images/avatar-photos/glum-android.webp',
        '/images/avatar-photos/confused-looking-bot.webp',
        '/images/avatar-photos/unhappy-android-in-chair.webp',
        '/images/avatar-photos/bot-and-laptop-speech-bubble.webp',
        '/images/avatar-photos/sloth-detective.webp',
        '/images/avatar-photos/tech-support-penguin.webp',
        '/images/avatar-photos/cat-typing-on-computer.webp',
        '/images/avatar-photos/fox-typing.webp'
    ];

    // List of random loading messages about AI bots
    const loadingMessages = [
        "AI Bots Powering Up...",
        "Robots Learning Human Jokes...",
        "Digital Assistants Assembling...",
        "Neural Networks Syncing...",
        "AI Minions Getting Ready...",
        "Bots Calculating Responses...",
        "Virtual Helpers Activating...",
        "Artificial Intelligence Loading...",
        "Bot Army Mobilizing...",
        "Digital Brains Thinking...",
        "AI Assistants Waking Up...",
        "Robot Friends Connecting..."
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

    // Check if this is the first visit
    function isFirstVisit() {
        if (localStorage.getItem('hasVisitedBefore') === null) {
            localStorage.setItem('hasVisitedBefore', 'true');
            return true;
        }
        return false;
    }

    // Set loading message based on visit status
    function setLoadingMessage() {
        const loadingHeader = document.querySelector('.loading-modal h2');
        const desktopNotice = document.querySelector('.desktop-notice');
        
        if (!isFirstVisit() && loadingHeader) {
            loadingHeader.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
            if (desktopNotice) desktopNotice.style.display = 'none';
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
    
    // Function to update the configuration count
    function updateConfigCount(count) {
        const configCountElements = document.querySelectorAll('.config-count-small');
        if (configCountElements.length > 0) {
            configCountElements.forEach(element => {
                element.textContent = `(${count})`;
            });
        }
    }
    // Initialize loading animation
    selectRandomAvatar();
    setLoadingMessage();
    animateProgressBar();
    
    // Store all configurations
    let allConfigurations = [];
    // Function to load a random configuration
    function loadRandomConfiguration() {
        if (allConfigurations.length === 0) {
            showToast('No configurations available');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * allConfigurations.length);
        const randomConfig = allConfigurations[randomIndex];
        
        loadConfiguration(randomConfig.filename);
        
        // Highlight the selected config in the sidebar
        const configLinks = document.querySelectorAll('#config-list a');
        configLinks.forEach(link => {
            if (link.getAttribute('data-filename') === randomConfig.filename) {
                link.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
    // Fetch the list of configuration files
    fetch('configs-list.json')
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                configList.innerHTML = '<li>No configurations found. Please run the build script first.</li>';
                return;
            }
            
            allConfigurations = data;
            
            // Update the configuration count display
            updateConfigCount(allConfigurations.length);
            populateConfigList(allConfigurations);
            
            // Add event listeners for random config buttons
            if (randomConfigBtn) {
                randomConfigBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadRandomConfiguration();
                });
            }
            
            
        })
        .catch(error => {
            console.error('Error fetching configurations:', error);
            configList.innerHTML = '<li>Error loading configurations. Please make sure configs-list.json exists.</li>';
        });
    
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
                    <pre>${config.systemPrompt.replace(/</g, '<').replace(/>/g, '>')}</pre>
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
            performSearch(searchInput.value);
        }
    });
    
    // Reset search functionality
    resetSearchButton.addEventListener('click', function() {
        searchInput.value = '';
        if (mobileSearchInput) mobileSearchInput.value = '';
        populateConfigList(allConfigurations);
    });
    
    // Mobile search button
    if (mobileSearchButton) {
        mobileSearchButton.addEventListener('click', function() {
            performSearch(mobileSearchInput.value);
        });
    }
    
    // Mobile reset button
    if (mobileResetButton) {
        mobileResetButton.addEventListener('click', function() {
            if (mobileSearchInput) mobileSearchInput.value = '';
            populateConfigList(allConfigurations);
        });
    }
    
    // Mobile search input
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch(mobileSearchInput.value);
            }
        });
    }
    
    // Mobile random config button
    if (mobileRandomConfigBtn) {
        mobileRandomConfigBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadRandomConfiguration();
        });
    }
    
    function performSearch(inputValue) {
        const searchTerm = (inputValue || searchInput.value).toLowerCase().trim();
        
        // Sync the search inputs
        searchInput.value = searchTerm;
        if (mobileSearchInput) {
            mobileSearchInput.value = searchTerm;
        }
        
        if (searchTerm === '') {
            populateConfigList(allConfigurations);
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
                transform: translate(-50%, 0);
                background-color: rgba(106, 13, 173, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-family: 'Orbitron', sans-serif;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: opacity 0.3s;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                #toast {
                    bottom: 20px; /* Position at the bottom with space */
                }
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

// Set active state for mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    // Set active class for current page in mobile nav
    const currentPath = window.location.pathname;
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        if (itemPath === currentPath || (currentPath === '/' && itemPath === '/')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Sync search inputs
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    if (searchInput && mobileSearchInput) {
        // Sync desktop to mobile
        searchInput.addEventListener('input', function() {
            mobileSearchInput.value = this.value;
        });
        
        // Sync mobile to desktop
        mobileSearchInput.addEventListener('input', function() {
            searchInput.value = this.value;
        });
    }
});