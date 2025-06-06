// Admin Dashboard JavaScript

function showSection(sectionId) {
    const sections = [
        'dashboard-section',
        'projects-section',
        'users-section',
        'submissions-section',
        'qa-section',
        'settings-section',
        'reports-section'
    ];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === sectionId) ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle sidebar navigation
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                const targetId = href.substring(1) + '-section';
                showSection(targetId);
            }
        });
    });

    // Handle form submissions
    const settingsForm = document.querySelector('form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }

    // Handle project review actions
    const reviewButtons = document.querySelectorAll('.btn-primary');
    reviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectTitle = this.closest('tr').querySelector('td').textContent;
            reviewProject(projectTitle);
        });
    });

    // Handle user management actions
    const userActionButtons = document.querySelectorAll('.btn-danger');
    userActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userName = this.closest('tr').querySelector('td').textContent;
            if (this.textContent.trim() === 'Disable') {
                disableUser(userName);
            } else if (this.textContent.trim() === 'Reject') {
                rejectProject(userName);
            }
        });
    });
});

// Dashboard Functions
function showDashboard() {
    // Update dashboard statistics
    updateStatistics();
}

function showProjects() {
    // Load and display projects
    loadProjects();
}

function showUsers() {
    // Load and display users
    loadUsers();
}

function showSubmissions() {
    // Load and display submissions
    loadSubmissions();
}

function showQA() {
    // Load and display Q&A management
    loadQA();
}

function showSettings() {
    // Load and display settings
    loadSettings();
}

function showReports() {
    // Load and display reports
    loadReports();
}

// Data Management Functions
function updateStatistics() {
    // Fetch and update dashboard statistics
    fetch('/api/statistics')
        .then(response => response.json())
        .then(data => {
            // Update statistics cards
            document.querySelector('.stat-card:nth-child(1) h3').textContent = data.totalProjects;
            document.querySelector('.stat-card:nth-child(2) h3').textContent = data.activeUsers;
            document.querySelector('.stat-card:nth-child(3) h3').textContent = data.pendingReviews;
            document.querySelector('.stat-card:nth-child(4) h3').textContent = data.systemHealth + '%';
        })
        .catch(error => console.error('Error fetching statistics:', error));
}

function saveSettings() {
    const formData = new FormData(document.querySelector('form'));
    const settings = Object.fromEntries(formData.entries());

    // Send settings to server
    fetch('/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Settings saved successfully', 'success');
        } else {
            showNotification('Error saving settings', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving settings:', error);
        showNotification('Error saving settings', 'error');
    });
}

function reviewProject(projectTitle) {
    // Open project review modal
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
}

function disableUser(userName) {
    if (confirm(`Are you sure you want to disable user ${userName}?`)) {
        fetch(`/api/users/${userName}/disable`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`User ${userName} disabled successfully`, 'success');
                // Refresh user list
                loadUsers();
            } else {
                showNotification('Error disabling user', 'error');
            }
        })
        .catch(error => {
            console.error('Error disabling user:', error);
            showNotification('Error disabling user', 'error');
        });
    }
}

function rejectProject(projectTitle) {
    if (confirm(`Are you sure you want to reject project "${projectTitle}"?`)) {
        fetch(`/api/projects/${projectTitle}/reject`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`Project "${projectTitle}" rejected successfully`, 'success');
                // Refresh submissions list
                loadSubmissions();
            } else {
                showNotification('Error rejecting project', 'error');
            }
        })
        .catch(error => {
            console.error('Error rejecting project:', error);
            showNotification('Error rejecting project', 'error');
        });
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '1050';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Data Loading Functions
function loadProjects() {
    fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
            // Update projects table
            const tbody = document.querySelector('#projectsTable tbody');
            tbody.innerHTML = data.projects.map(project => `
                <tr>
                    <td>${project.title}</td>
                    <td>${project.student}</td>
                    <td>${project.department}</td>
                    <td>${project.submissionDate}</td>
                    <td><span class="badge bg-${project.status === 'Approved' ? 'success' : 'warning'}">${project.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary">Review</button>
                        <button class="btn btn-sm btn-danger">Reject</button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error loading projects:', error));
}

function loadUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            // Update users table
            const tbody = document.querySelector('#usersTable tbody');
            tbody.innerHTML = data.users.map(user => `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><span class="badge bg-${user.status === 'Active' ? 'success' : 'danger'}">${user.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary">Edit</button>
                        <button class="btn btn-sm btn-danger">Disable</button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error loading users:', error));
}

function loadSubmissions() {
    fetch('/api/submissions')
        .then(response => response.json())
        .then(data => {
            // Update submissions table
            const tbody = document.querySelector('#submissionsTable tbody');
            tbody.innerHTML = data.submissions.map(submission => `
                <tr>
                    <td>${submission.title}</td>
                    <td>${submission.student}</td>
                    <td>${submission.department}</td>
                    <td>${submission.date}</td>
                    <td><span class="badge bg-${submission.status === 'Approved' ? 'success' : 'warning'}">${submission.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary">Review</button>
                        <button class="btn btn-sm btn-danger">Reject</button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error loading submissions:', error));
}

function loadQA() {
    fetch('/api/qa')
        .then(response => response.json())
        .then(data => {
            // Update Q&A section
            const qaContainer = document.querySelector('#qaContainer');
            qaContainer.innerHTML = data.questions.map(question => `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${question.title}</h5>
                        <p class="card-text">${question.content}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Asked by ${question.author} on ${question.date}</small>
                            <div>
                                <button class="btn btn-sm btn-primary">Answer</button>
                                <button class="btn btn-sm btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error loading Q&A:', error));
}

function loadSettings() {
    fetch('/api/settings')
        .then(response => response.json())
        .then(data => {
            // Update settings form
            Object.entries(data).forEach(([key, value]) => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = value;
                }
            });
        })
        .catch(error => console.error('Error loading settings:', error));
}

function loadReports() {
    fetch('/api/reports')
        .then(response => response.json())
        .then(data => {
            // Update reports section
            const reportsContainer = document.querySelector('#reportsContainer');
            reportsContainer.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title">Submission Statistics</h5>
                                <canvas id="submissionsChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title">User Activity</h5>
                                <canvas id="activityChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize charts
            initializeCharts(data);
        })
        .catch(error => console.error('Error loading reports:', error));
}

function initializeCharts(data) {
    // Initialize submission statistics chart
    const submissionsCtx = document.getElementById('submissionsChart').getContext('2d');
    new Chart(submissionsCtx, {
        type: 'line',
        data: {
            labels: data.submissions.labels,
            datasets: [{
                label: 'Submissions',
                data: data.submissions.data,
                borderColor: '#3498db',
                tension: 0.1
            }]
        }
    });

    // Initialize user activity chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: data.activity.labels,
            datasets: [{
                label: 'Active Users',
                data: data.activity.data,
                backgroundColor: '#2ecc71'
            }]
        }
    });
} 