document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const departmentFilter = document.getElementById('departmentFilter');
    const typeFilter = document.getElementById('typeFilter');
    const yearFilter = document.getElementById('yearFilter');
    const sortFilter = document.getElementById('sortFilter');
    // projectsGrid is declared here but will be re-fetched in setupEventListeners as a debugging step
    const projectsGrid = document.getElementById('projectsGrid'); 
    const projectDetailsModalElement = document.getElementById('projectDetailsModal');

    // Initialize Bootstrap Modal after confirming element exists
    let projectDetailsModal = null; // Initialize modal variable
    if (projectDetailsModalElement) {
        projectDetailsModal = new bootstrap.Modal(projectDetailsModalElement);
    } else {
        console.error('Project details modal element not found!'); // Simulated logging
    }

    // Sample project data (replace with API call)
    const projects = [
        {
            id: 1,
            title: 'Machine Learning for Image Recognition',
            department: 'Computer Science',
            type: 'development',
            year: 2024,
            abstract: 'A deep learning approach to image recognition using convolutional neural networks...',
            views: 1200,
            downloads: 450,
            likes: 1200,
            keywords: ['machine learning', 'computer vision', 'deep learning'],
            author: 'John Doe',
            supervisor: 'Dr. Jane Smith'
        },
        {
            id: 2,
            title: 'Sustainable Energy Solutions',
            department: 'Engineering',
            type: 'research',
            year: 2023,
            abstract: 'Analysis of renewable energy systems and their implementation in urban areas...',
            views: 850,
            downloads: 320,
            likes: 850,
            keywords: ['sustainability', 'renewable energy', 'urban planning'],
            author: 'Alice Johnson',
            supervisor: 'Prof. Robert Brown'
        }
        // Add more sample projects as needed
    ];

    // Initialize the projects grid
    function initializeProjects() {
        renderProjects(projects);
        // Only setup event listeners if the projects grid element is found
        // We will re-fetch projectsGrid inside setupEventListeners for robustness check
        setupEventListeners(); 
    }

    // Render projects in the grid
    function renderProjects(projectsToRender) {
        const currentProjectsGrid = document.getElementById('projectsGrid'); // Re-fetch here too for safety
        if (!currentProjectsGrid) {
            console.error('projectsGrid is null in renderProjects. Cannot render.');
            return;
        }
        currentProjectsGrid.innerHTML = '';
        
        projectsToRender.forEach(project => {
            const projectCard = createProjectCard(project);
            currentProjectsGrid.appendChild(projectCard);
        });
    }

    // Create a project card element
    function createProjectCard(project) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        
        const rank = calculateRank(project.likes);

        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${project.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${project.department}</h6>
                    <p class="card-text">${project.abstract.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary view-details" data-project-id="${project.id}">
                                View Details
                            </button>
                            <button class="btn btn-sm btn-outline-secondary download-project" data-project-id="${project.id}">
                                Download
                            </button>
                        </div>
                        <small class="text-muted">${project.year}</small>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="d-flex align-items-center mb-1">
                                <i class="fas fa-eye me-1"></i> <span class="view-count">${project.views}</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="fas fa-download me-1"></i> <span class="download-count">${project.downloads}</span>
                            </div>
                        </div>
                        <div class="d-flex flex-column align-items-center">
                            <button class="btn btn-primary btn-sm rounded-3 like-project mb-1" data-project-id="${project.id}">
                                <i class="fas fa-thumbs-up"></i>
                            </button>
                            <span class="like-count small text-muted">${project.likes}</span>
                            <span class="project-rank badge bg-warning mt-1">${rank > 0 ? `Rank ${rank}` : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return col;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search input
        if(searchInput) searchInput.addEventListener('input', debounce(handleSearch, 300));

        // Filter changes
        if(departmentFilter) departmentFilter.addEventListener('change', handleFilters);
        if(typeFilter) typeFilter.addEventListener('change', handleFilters);
        if(yearFilter) yearFilter.addEventListener('change', handleFilters);
        if(sortFilter) sortFilter.addEventListener('change', handleFilters);

        // Use event delegation for project card buttons
        // Try getting the element again right before adding the listener
        const projectsGridElement = document.getElementById('projectsGrid');

        if (projectsGridElement !== null) { 
             console.log('projectsGrid element found inside setupEventListeners.'); // Simulated logging
            projectsGridElement.addEventListener('click', function(e) {
                const target = e.target;
                const viewDetailsButton = target.closest('.view-details');
                const downloadButton = target.closest('.download-project');
                const likeButton = target.closest('.like-project');

                if (viewDetailsButton) {
                    handleViewDetails({
                        target: viewDetailsButton
                    });
                } else if (downloadButton) {
                    handleDownload({
                        target: downloadButton
                    });
                } else if (likeButton) {
                    handleLike({
                        target: likeButton
                    });
                }
            });
             console.log('Event listener added to projectsGridElement.'); // Simulated logging
        } else {
            console.error('Projects grid element is null when attempting to add event listener inside setupEventListeners.'); // Simulated logging
        }

    }

    // Handle search
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProjects = projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.abstract.toLowerCase().includes(searchTerm) ||
            project.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
        renderProjects(filteredProjects);
        setupEventListeners(); // Re-attach listeners after rendering
    }

    // Handle filters
    function handleFilters() {
        const department = departmentFilter.value;
        const type = typeFilter.value;
        const year = yearFilter.value;
        const sortBy = sortFilter.value;

        let filteredProjects = [...projects];

        // Apply filters
        if (department) {
            filteredProjects = filteredProjects.filter(project => 
                project.department.toLowerCase() === department.toLowerCase()
            );
        }

        if (type) {
            filteredProjects = filteredProjects.filter(project => 
                project.type === type
            );
        }

        if (year) {
            filteredProjects = filteredProjects.filter(project => 
                project.year.toString() === year
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'recent':
                filteredProjects.sort((a, b) => b.year - a.year);
                break;
            case 'popular':
                filteredProjects.sort((a, b) => b.views - a.views);
                break;
            case 'rating':
                filteredProjects.sort((a, b) => b.likes - a.likes);
                break;
        }

        renderProjects(filteredProjects);
        setupEventListeners(); // Re-attach listeners after rendering
    }

    // Named function for modal close listener to allow removal
    function handleModalClose() {
        // Get the project ID from the currently open modal if needed, or rely on the project variable scope
        // For now, we can rely on the `project` variable being accessible here due to closure

        // Increment view count after showing the modal
        // We need to find which project was associated with this modal instance
        // Let's get the project ID from the modal content if possible
         const modalBody = document.querySelector('#projectDetailsModal .modal-body');
         const projectId = modalBody ? modalBody.querySelector('.like-project')?.dataset.projectId : null;
         
         if(projectId) {
             const project = projects.find(p => p.id === parseInt(projectId));
              if(project) { // Ensure project is still in scope and defined
                project.views++;
                
                // Update the project card view count
                const projectCard = document.querySelector(`[data-project-id="${projectId}"]`)?.closest('.card');
                const viewCountElement = projectCard?.querySelector('.view-count');
                if(viewCountElement) viewCountElement.textContent = project.views;
            }
         }

        // No need to remove listener here if we only attach it once per project view
        // But we did remove it before adding to prevent duplicates from previous clicks
     }

    // Handle view details
    function handleViewDetails(e) {
        const projectId = e.target.dataset.projectId;
        const project = projects.find(p => p.id === parseInt(projectId));
        
        if (!project) {
            console.error('Project not found with ID:', projectId);
            return;
        }

        // Check if user has already viewed this project
        const viewedProjects = JSON.parse(localStorage.getItem('viewedProjects') || '[]');
        if (!viewedProjects.includes(projectId)) {
            // First time viewing - increment count
            project.views++;
            viewedProjects.push(projectId);
            localStorage.setItem('viewedProjects', JSON.stringify(viewedProjects));
            
            // Update view count in the card
            const projectCard = document.querySelector(`.card [data-project-id="${projectId}"]`)?.closest('.card');
            if (projectCard) {
                const viewCountElement = projectCard.querySelector('.view-count');
                if (viewCountElement) {
                    viewCountElement.textContent = project.views;
                }
            }
            showNotification('View counted!', 'success');
        } else {
            showNotification('You have already viewed this project.', 'info');
        }

        // Show modal with project details
        const modalElement = document.getElementById('projectDetailsModal');
        if (!modalElement) {
            console.error('Project details modal element not found!');
            return;
        }

        // Update modal content
        const modalBody = modalElement.querySelector('.modal-body');
        if (modalBody) {
            const preview = modalBody.querySelector('.project-preview');
            if (preview) {
                // Update all modal content
                preview.querySelector('.project-title').textContent = project.title;
                preview.querySelector('.department').textContent = project.department;
                preview.querySelector('.year').textContent = project.year;
                preview.querySelector('.preview-abstract').innerHTML = `
                    <p class="mb-2">${project.abstract.substring(0, 100)}...</p>
                    <p class="text-muted">Click to read more</p>
                `;
                preview.querySelector('.preview-keywords').innerHTML = `
                    <div class="d-flex flex-wrap gap-1">
                        ${project.keywords.map(keyword => 
                            `<span class="badge bg-primary">${keyword}</span>`
                        ).join('')}
                    </div>
                `;
                preview.querySelector('.author').textContent = project.author;
                preview.querySelector('.supervisor').textContent = project.supervisor;
                preview.querySelector('.views-count').textContent = project.views;
                preview.querySelector('.downloads-count').textContent = project.downloads;
                
                // Update like button and count
                const likeButton = preview.querySelector('.like-project');
                if (likeButton) {
                    likeButton.dataset.projectId = project.id;
                    const modalLikeCountEl = modalBody.querySelector('.like-count');
                    if (modalLikeCountEl) modalLikeCountEl.textContent = project.likes;
                    
                    const modalRankSpan = modalBody.querySelector('.project-rank');
                    if (modalRankSpan) modalRankSpan.textContent = calculateRank(project.likes) > 0 ? `Rank ${calculateRank(project.likes)}` : '';
                }
            }
        }

        // Show the modal
        if (projectDetailsModal) {
            projectDetailsModal.show();
        }
    }

    // Handle download
    function handleDownload(e) {
        const projectId = e.target.dataset.projectId;
        const project = projects.find(p => p.id === parseInt(projectId));
        
        if (!project) {
            console.error('Project not found for download with ID:', projectId);
            return;
        }

        // Check if user has already downloaded this project
        const downloadedProjects = JSON.parse(localStorage.getItem('downloadedProjects') || '[]');
        if (!downloadedProjects.includes(projectId)) {
            // First time downloading - increment count
            project.downloads++;
            downloadedProjects.push(projectId);
            localStorage.setItem('downloadedProjects', JSON.stringify(downloadedProjects));
            
            showNotification('Starting download...', 'info');
            
            // Simulate download delay
            setTimeout(() => {
                // Update download count in the card
                const projectCard = document.querySelector(`.card [data-project-id="${projectId}"]`)?.closest('.card');
                if (projectCard) {
                    const downloadCountElement = projectCard.querySelector('.download-count');
                    if (downloadCountElement) {
                        downloadCountElement.textContent = project.downloads;
                    }
                }

                // Update modal count if open
                const modalDownloadsCountEl = document.querySelector('#projectDetailsModal .downloads-count');
                if (modalDownloadsCountEl) {
                    modalDownloadsCountEl.textContent = project.downloads;
                }

                showNotification('Download complete! Count increased.', 'success');
            }, 2000);
        } else {
            showNotification('You have already downloaded this project. Count will not increase.', 'info');
            // Still show download complete notification even if not incrementing count
            setTimeout(() => {
                showNotification('Download complete!', 'success');
            }, 2000);
        }
    }

    // Calculate project rank based on likes
    function calculateRank(likes) {
        if (likes >= 5000) return 5;
        if (likes >= 4000) return 4;
        if (likes >= 3000) return 3;
        if (likes >= 2000) return 2;
        if (likes >= 1000) return 1;
        return 0;
    }

    // Handle liking a project (formerly handleRating)
    function handleLike(e) {
        const projectId = e.target.closest('.like-project').dataset.projectId;
        const project = projects.find(p => p.id === parseInt(projectId));
        
        if (!project) {
            console.error('Project not found for liking with ID:', projectId); // Simulated logging
            return;
        }

        // Check if the user has already liked this project using localStorage
        const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
        if (likedProjects.includes(projectId)) {
            showNotification('You have already liked this project.', 'info');
            console.log('Project already liked by user:', projectId); // Simulated logging
            return; // Exit the function if already liked
        }

        console.log('Liking project:', project.title); // Simulated logging
        
        // Increment like count
        project.likes++;
        console.log('New like count (in memory):', project.likes); // Simulated logging
        
        // Add project ID to liked projects in localStorage
        likedProjects.push(projectId);
        localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
        console.log('Project ID added to localStorage:', projectId); // Simulated logging
        
        // Calculate new rank
        const newRank = calculateRank(project.likes);
        console.log('Calculated new rank:', newRank); // Simulated logging

        // Update the like count and rank in the project card
        const projectCard = document.querySelector(`.card [data-project-id="${projectId}"]`)?.closest('.card');
        if(projectCard) {
             console.log('Project card found for update:', project.title); // Simulated logging
             const likeCountElement = projectCard.querySelector('.like-count');
             if(likeCountElement) {
                 console.log('Like count element found in card. Updating...'); // Simulated logging
                 likeCountElement.textContent = project.likes; // Update the text content
                 console.log('Card like count updated to:', likeCountElement.textContent); // Simulated logging
             } else {
                 console.error('Like count element not found in project card!'); // Simulated logging
             }
             const rankElement = projectCard.querySelector('.project-rank');
             if(rankElement) rankElement.textContent = newRank > 0 ? `Rank ${newRank}` : '';
        } else {
            console.error('Project card not found for update!'); // Simulated logging
        }

        // Update the like count and rank in the modal if it's open
        const modalElement = document.getElementById('projectDetailsModal');
        if (modalElement && modalElement.classList.contains('show')) { // Check if modal is open
             console.log('Modal is open. Updating modal counts.'); // Simulated logging
            const modalLikeCountEl = modalElement.querySelector('.like-count');
            if(modalLikeCountEl) modalLikeCountEl.textContent = project.likes;
            const modalRankEl = modalElement.querySelector('.project-rank');
            if(modalRankEl) modalRankEl.textContent = newRank > 0 ? `Rank ${newRank}` : '';
        } else {
            console.log('Modal is not open.'); // Simulated logging
        }

        showNotification('Project liked!', 'success');
         console.log('Like process completed for project:', project.title); // Simulated logging

    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize the page
    initializeProjects();
});