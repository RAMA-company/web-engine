// Builder Components Configuration
const builderComponents = [
    {
        type: "input",
        id: "title",
        placeholder: "Enter your page title...",
        icon: "✏️",
        label: "Page Title",
        description: "The main heading for your landing page"
    },
    {
        type: "input",
        id: "subtitle",
        placeholder: "Enter your page subtitle...",
        icon: "📝",
        label: "Page Subtitle",
        description: "A short description that appears under the title"
    },
    {
        type: "section-manager",
        actions: ["add", "remove", "reorder"],
        sections: [
            {
                title: "About Us",
                description: "A brief description of your company or service...",
                buttons: [
                    { text: "Learn More", link: "#", icon: "→" }
                ]
            },
            {
                title: "Features",
                description: "Highlight your key features or benefits...",
                buttons: [
                    { text: "View Features", link: "#", icon: "🔍" }
                ]
            }
        ],
        label: "Page Sections",
        description: "Add, remove and reorder content sections",
        icon: "📑"
    },
    {
        type: "input",
        id: "footer-text",
        placeholder: "Enter footer text...",
        icon: "📌",
        label: "Footer Text",
        description: "Text that appears at the bottom of the page"
    },
    {
        type: "color-palette",
        options: ["#4F46E5", "#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED"],
        label: "Color Theme",
        description: "Choose a primary color for your landing page",
        icon: "🎨"
    },
    {
        type: "seo-selector",
        topics: ["Portfolio", "Product", "Blog", "Service", "Event", "Personal"],
        label: "SEO Category",
        description: "Select a category for SEO optimization",
        icon: "🔍"
    },
    {
        type: "save-panel",
        features: ["Auto-save to localStorage", "Preview", "Download ZIP"],
        label: "Export Options",
        icon: "💾"
    }
];

// State Management
let currentSections = [];
let currentTheme = "#4F46E5";
let currentSeoTopic = "Portfolio";
let pageData = {
    title: "Minimal Landing Page",
    subtitle: "Create your beautiful landing page",
    footer: "© 2023 My Landing Page"
};

// DOM Elements
const builderContainer = document.getElementById('builder-components');
const notification = document.getElementById('notification');

// Initialize the Builder
function initBuilder() {
    // Load saved data if exists
    const savedData = localStorage.getItem('landingProject');
    if (savedData) {
        const data = JSON.parse(savedData);
        currentSections = data.sections || [];
        currentTheme = data.theme || "#4F46E5";
        currentSeoTopic = data.seoTopic || "Portfolio";
        pageData = data.pageData || {
            title: "Minimal Landing Page",
            subtitle: "Create your beautiful landing page",
            footer: "© 2023 My Landing Page"
        };
    } else {
        currentSections = [...builderComponents[2].sections];
    }
    
    // Render all components
    builderComponents.forEach(component => {
        const componentEl = createComponent(component);
        builderContainer.appendChild(componentEl);
    });
    
    // Set initial values
    document.getElementById('title').value = pageData.title;
    document.getElementById('subtitle').value = pageData.subtitle;
    document.getElementById('footer-text').value = pageData.footer;
    
    // Initialize auto-save
    initAutoSave();
}

// Create a single builder component
function createComponent(component) {
    const div = document.createElement('div');
    div.className = 'builder-component';
    
    // Create header with icon
    div.innerHTML = `
        <div class="component-header">
            <div class="component-icon">${component.icon}</div>
            <div>
                <h3>${component.label}</h3>
                <p class="light-text">${component.description || ''}</p>
            </div>
        </div>
    `;
    
    switch(component.type) {
        case 'input':
            div.innerHTML += `
                <div class="input-group">
                    <span class="icon">${component.icon}</span>
                    <input type="text" id="${component.id}" placeholder="${component.placeholder}" value="">
                </div>
            `;
            break;
            
        case 'section-manager':
            div.innerHTML += `
                <div class="section-manager">
                    <div class="sections-container" id="sections-container">
                        ${renderSections()}
                    </div>
                    <button class="btn" id="add-section" style="margin-top: 1rem;">
                        <span>+</span> Add New Section
                    </button>
                </div>
            `;
            const addButton = div.querySelector('#add-section');
            addButton.addEventListener('click', addSection);
            break;
            
        case 'color-palette':
            div.innerHTML += `
                <div class="color-palette">
                    ${component.options.map((color, index) => `
                        <div class="color-option ${color === currentTheme ? 'active' : ''}" 
                             data-color="${color}" 
                             style="background: ${color};"
                             onclick="selectTheme('${color}')"></div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'seo-selector':
            div.innerHTML += `
                <div class="seo-selector">
                    ${component.topics.map(topic => `
                        <div class="seo-option ${topic === currentSeoTopic ? 'active' : ''}" 
                             onclick="selectSeoTopic('${topic}')">${topic}</div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'save-panel':
            div.innerHTML += `
                <div class="save-panel">
                    <div class="auto-save">${component.features[0]}</div>
                    <div class="action-buttons">
                        <button class="btn btn-outline" id="preview-btn">${component.features[1]}</button>
                        <button class="btn" id="export-btn">${component.features[2]}</button>
                    </div>
                </div>
                <div class="preview-container" id="preview-container">
                    <div class="preview-header">
                        <h3>Page Preview</h3>
                        <button class="btn btn-outline" onclick="closePreview()">Close</button>
                    </div>
                    <div class="preview-content" id="preview-content"></div>
                </div>
            `;
            document.getElementById('export-btn').addEventListener('click', generateZip);
            document.getElementById('preview-btn').addEventListener('click', previewLandingPage);
            break;
    }
    
    return div;
}

// Render sections for section manager
function renderSections() {
    return currentSections.map((section, index) => `
        <div class="section" data-index="${index}">
            <div class="move-handle">≡</div>
            <div class="section-title">Section ${index + 1}</div>
            <div class="input-group">
                <input type="text" placeholder="Section Title" value="${section.title}" 
                       oninput="updateSectionTitle(${index}, this.value)">
            </div>
            <div class="input-group">
                <textarea placeholder="Section Description" 
                          oninput="updateSectionDescription(${index}, this.value)">${section.description}</textarea>
            </div>
            <div>
                <h4 style="margin: 1rem 0 0.5rem;">Buttons</h4>
                ${section.buttons.map((button, btnIndex) => `
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <div class="input-group" style="flex: 3;">
                            <input type="text" placeholder="Button Text" value="${button.text}" 
                                   oninput="updateButtonText(${index}, ${btnIndex}, this.value)">
                        </div>
                        <div class="input-group" style="flex: 5;">
                            <input type="text" placeholder="Button Link" value="${button.link}" 
                                   oninput="updateButtonLink(${index}, ${btnIndex}, this.value)">
                        </div>
                        <button class="btn btn-outline" 
                                onclick="removeButton(${index}, ${btnIndex})">Remove</button>
                    </div>
                `).join('')}
                <button class="btn btn-outline" onclick="addButtonToSection(${index})">
                    + Add Button
                </button>
            </div>
            <div class="section-actions">
                <button class="btn btn-outline" onclick="moveSectionUp(${index})">Move Up</button>
                <button class="btn btn-outline" onclick="moveSectionDown(${index})">Move Down</button>
                <button class="btn btn-outline" onclick="removeSection(${index})">Remove Section</button>
            </div>
        </div>
    `).join('');
}

// Section management functions
function addSection() {
    currentSections.push({
        title: "New Section",
        description: "Describe what this section is about...",
        buttons: []
    });
    document.getElementById('sections-container').innerHTML = renderSections();
}

function updateSectionTitle(index, value) {
    currentSections[index].title = value;
}

function updateSectionDescription(index, value) {
    currentSections[index].description = value;
}

function addButtonToSection(sectionIndex) {
    currentSections[sectionIndex].buttons.push({
        text: "New Button",
        link: "#",
        icon: ""
    });
    document.getElementById('sections-container').innerHTML = renderSections();
}

function updateButtonText(sectionIndex, buttonIndex, value) {
    currentSections[sectionIndex].buttons[buttonIndex].text = value;
}

function updateButtonLink(sectionIndex, buttonIndex, value) {
    currentSections[sectionIndex].buttons[buttonIndex].link = value;
}

function removeButton(sectionIndex, buttonIndex) {
    currentSections[sectionIndex].buttons.splice(buttonIndex, 1);
    document.getElementById('sections-container').innerHTML = renderSections();
}

function removeSection(index) {
    if (currentSections.length > 1) {
        currentSections.splice(index, 1);
        document.getElementById('sections-container').innerHTML = renderSections();
    } else {
        showNotification("You need at least one section");
    }
}

function moveSectionUp(index) {
    if (index > 0) {
        const temp = currentSections[index];
        currentSections[index] = currentSections[index-1];
        currentSections[index-1] = temp;
        document.getElementById('sections-container').innerHTML = renderSections();
    }
}

function moveSectionDown(index) {
    if (index < currentSections.length - 1) {
        const temp = currentSections[index];
        currentSections[index] = currentSections[index+1];
        currentSections[index+1] = temp;
        document.getElementById('sections-container').innerHTML = renderSections();
    }
}

// Theme selection
function selectTheme(color) {
    currentTheme = color;
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.toggle('active', option.dataset.color === color);
    });
    document.body.style.backgroundColor = lightenColor(color, 0.9);
    showNotification("Theme updated");
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R<255?R<0?0:R:255)*0x10000 + 
            (G<255?G<0?0:G:255)*0x100 + 
            (B<255?B<0?0:B:255)).toString(16).slice(1)}`;
}

// SEO topic selection
function selectSeoTopic(topic) {
    currentSeoTopic = topic;
    document.querySelectorAll('.seo-option').forEach(option => {
        option.classList.toggle('active', option.textContent === topic);
    });
    showNotification(`SEO category set to: ${topic}`);
}

// Auto-save functionality
function initAutoSave() {
    setInterval(() => {
        // Gather all page data
        pageData.title = document.getElementById('title').value;
        pageData.subtitle = document.getElementById('subtitle').value;
        pageData.footer = document.getElementById('footer-text').value;
        
        const projectData = {
            pageData: pageData,
            sections: currentSections,
            theme: currentTheme,
            seoTopic: currentSeoTopic
        };
        
        localStorage.setItem('landingProject', JSON.stringify(projectData));
        showNotification('Changes saved locally');
    }, 10000);
}

// Notification system
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Preview functionality
function previewLandingPage() {
    const previewContainer = document.getElementById('preview-container');
    const previewContent = document.getElementById('preview-content');
    
    // Generate preview HTML
    previewContent.innerHTML = `
        <div style="padding: 2rem; font-family: 'Inter', sans-serif;">
            <h1 style="color: ${currentTheme};">${pageData.title}</h1>
            <p style="color: #64748B; margin-bottom: 2rem;">${pageData.subtitle}</p>
            
            ${currentSections.map((section, index) => `
                <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h2 style="color: ${currentTheme};">${section.title}</h2>
                    <p style="color: #475569; margin-bottom: 1rem;">${section.description}</p>
                    <div>
                        ${section.buttons.map(button => `
                            <a href="${button.link}" style="display: inline-block; background: ${currentTheme}; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; margin-right: 0.5rem;">
                                ${button.text}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            
            <div style="text-align: center; padding: 2rem; color: #64748B; margin-top: 2rem; border-top: 1px solid #E2E8F0;">
                <p>${pageData.footer}</p>
            </div>
        </div>
    `;
    
    previewContainer.style.display = 'block';
}

function closePreview() {
    document.getElementById('preview-container').style.display = 'none';
}

// ZIP export functionality
function generateZip() {
    const title = pageData.title || 'My Landing Page';
    
    // Generate HTML content
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                :root {
                    --primary-color: ${currentTheme};
                    --text-color: #1E293B;
                    --background-color: ${lightenColor(currentTheme, 0.9)};
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: var(--background-color);
                    color: var(--text-color);
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                
                header {
                    text-align: center;
                    padding: 4rem 1rem;
                }
                
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: var(--primary-color);
                }
                
                section {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }
                
                .btn {
                    display: inline-block;
                    background: var(--primary-color);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    text-decoration: none;
                    margin-top: 1rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                
                footer {
                    text-align: center;
                    padding: 2rem;
                    color: #64748B;
                    font-size: 0.9rem;
                    border-top: 1px solid #E2E8F0;
                    margin-top: 2rem;
                }
                
                @media (min-width: 768px) {
                    h1 {
                        font-size: 3rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>${pageData.title}</h1>
                    <p>${pageData.subtitle}</p>
                </header>
                
                ${currentSections.map((section, index) => `
                    <section id="section-${index+1}">
                        <h2>${section.title}</h2>
                        <p>${section.description}</p>
                        <div style="margin-top: 1.5rem;">
                            ${section.buttons.map(button => `
                                <a href="${button.link}" class="btn">${button.text}</a>
                            `).join(' ')}
                        </div>
                    </section>
                `).join('')}
                
                <footer>
                    <p>${pageData.footer}</p>
                </footer>
            </div>
        </body>
        </html>
    `;
    
    // Create ZIP file
    const zip = new JSZip();
    zip.file("index.html", htmlContent);
    
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "landing-page.zip");
    });
    
    showNotification("Landing page exported as ZIP!");
}

// Initialize the builder when page loads
document.addEventListener('DOMContentLoaded', initBuilder);

// Expose functions to global scope for inline event handlers
window.updateSectionTitle = updateSectionTitle;
window.updateSectionDescription = updateSectionDescription;
window.addButtonToSection = addButtonToSection;
window.updateButtonText = updateButtonText;
window.updateButtonLink = updateButtonLink;
window.removeButton = removeButton;
window.removeSection = removeSection;
window.moveSectionUp = moveSectionUp;
window.moveSectionDown = moveSectionDown;
window.selectTheme = selectTheme;
window.selectSeoTopic = selectSeoTopic;
window.previewLandingPage = previewLandingPage;
window.closePreview = closePreview;
