// Example data for demonstration
const leaderboards = {
  projects: [
    { initials: "SJ", color: "warning", name: "Sarah Johnson", field: "Computer Science", org: "Tech University", projects: 12, downloads: 2847, rating: 4.8, reviews: 34, collaborators: 5, icon: "fa-crown" },
    { initials: "MC", color: "primary", name: "Michael Chen", field: "Engineering", org: "Green Tech Institute", projects: 8, downloads: 2156, rating: 4.7, reviews: 28, collaborators: 3, icon: "fa-medal" },
    { initials: "ER", color: "danger", name: "Emma Rodriguez", field: "Information Technology", org: "Digital University", projects: 6, downloads: 1893, rating: 4.9, reviews: 22, collaborators: 4, icon: "fa-award" },
    { initials: "DK", color: "danger", name: "David Kim", field: "Psychology", org: "Mindful College", projects: 5, downloads: 1456, rating: 4.6, reviews: 15, collaborators: 2 },
    { initials: "LW", color: "danger", name: "Lisa Wang", field: "Data Science", org: "Analytics Academy", projects: 4, downloads: 1387, rating: 4.7, reviews: 12, collaborators: 1 }
  ],
  rated: [
    { initials: "ER", color: "danger", name: "Emma Rodriguez", field: "Information Technology", org: "Digital University", projects: 6, downloads: 1893, rating: 4.9, reviews: 22, collaborators: 4, icon: "fa-crown" },
    { initials: "SJ", color: "warning", name: "Sarah Johnson", field: "Computer Science", org: "Tech University", projects: 12, downloads: 2847, rating: 4.8, reviews: 34, collaborators: 5, icon: "fa-medal" },
    { initials: "LW", color: "danger", name: "Lisa Wang", field: "Data Science", org: "Analytics Academy", projects: 4, downloads: 1387, rating: 4.7, reviews: 12, collaborators: 1, icon: "fa-award" },
    { initials: "MC", color: "primary", name: "Michael Chen", field: "Engineering", org: "Green Tech Institute", projects: 8, downloads: 2156, rating: 4.7, reviews: 28, collaborators: 3 },
    { initials: "DK", color: "danger", name: "David Kim", field: "Psychology", org: "Mindful College", projects: 5, downloads: 1456, rating: 4.6, reviews: 15, collaborators: 2 }
  ],
  viewed: [
    { initials: "MC", color: "primary", name: "Michael Chen", field: "Engineering", org: "Green Tech Institute", projects: 8, downloads: 3156, rating: 4.7, reviews: 28, collaborators: 3, icon: "fa-crown" },
    { initials: "SJ", color: "warning", name: "Sarah Johnson", field: "Computer Science", org: "Tech University", projects: 12, downloads: 2847, rating: 4.8, reviews: 34, collaborators: 5, icon: "fa-medal" },
    { initials: "ER", color: "danger", name: "Emma Rodriguez", field: "Information Technology", org: "Digital University", projects: 6, downloads: 1893, rating: 4.9, reviews: 22, collaborators: 4, icon: "fa-award" },
    { initials: "DK", color: "danger", name: "David Kim", field: "Psychology", org: "Mindful College", projects: 5, downloads: 1456, rating: 4.6, reviews: 15, collaborators: 2 },
    { initials: "LW", color: "danger", name: "Lisa Wang", field: "Data Science", org: "Analytics Academy", projects: 4, downloads: 1387, rating: 4.7, reviews: 12, collaborators: 1 }
  ]
};

const tableTitles = {
  projects: "Top Contributors",
  rated: "Top Contributors by Rating",
  viewed: "Top Contributors by Views"
};

const rankBadges = [
  { label: 'Gold', icon: 'fa-crown', color: 'gold', emoji: '🥇', class: 'gold', tooltip: 'Top Contributor' },
  { label: 'Silver', icon: 'fa-medal', color: 'silver', emoji: '🥈', class: 'silver', tooltip: '2nd Place' },
  { label: 'Bronze', icon: 'fa-award', color: 'bronze', emoji: '🥉', class: 'bronze', tooltip: '3rd Place' }
];

document.addEventListener('DOMContentLoaded', function() {
  // Sample user data (replace with API call)
  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      initials: 'SJ',
      color: 'warning', // For avatar background
      school: 'Computer Science', // Assuming this is their primary school/department affiliation
      totalViews: 5240, // Total views across all their projects/contributions
      totalDownloads: 890, // Total downloads across all their projects
      totalLikes: 1500, // Total likes across all their projects
      avgRating: 4.8, // Average rating of their projects
      numProjects: 12 // Number of projects submitted
    },
    {
      id: 2,
      name: 'Michael Chen',
      initials: 'MC',
      color: 'primary',
      school: 'Engineering',
      totalViews: 3100,
      totalDownloads: 750,
      totalLikes: 1200,
      avgRating: 4.7,
      numProjects: 10
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      initials: 'ER',
      color: 'danger',
      school: 'Information Technology',
      totalViews: 4500,
      totalDownloads: 950,
      totalLikes: 1800,
      avgRating: 4.9,
      numProjects: 15
    },
    {
      id: 4,
      name: 'David Kim',
      initials: 'DK',
      color: 'danger', // Using danger for placeholder, replace with actual logic or data
      school: 'Psychology',
      totalViews: 2800,
      totalDownloads: 600,
      totalLikes: 800,
      avgRating: 4.6,
      numProjects: 8
    },
    {
      id: 5,
      name: 'Lisa Wang',
      initials: 'LW',
      color: 'danger', // Using danger for placeholder, replace with actual logic or data
      school: 'Data Science',
      totalViews: 2500,
      totalDownloads: 550,
      totalLikes: 700,
      avgRating: 4.7,
      numProjects: 7
    }
    // Add more sample users as needed
  ];

  // Function to calculate a combined score for ranking (example logic)
  // This is a placeholder, the exact formula might need adjustment based on desired weighting
  function calculateCombinedScore(user) {
    // Simple weighted sum example: Likes have higher weight, then views, then downloads
    // Avg rating is also important
    return (user.totalLikes * 5) + (user.totalViews * 2) + (user.totalDownloads * 3) + (user.avgRating * 100);
  }

  // Function to calculate user rank based on combined score thresholds (similar to project ranks)
  function calculateUserRank(score) {
    if (score >= 15000) return 5;
    if (score >= 10000) return 4;
    if (score >= 7000) return 3;
    if (score >= 4000) return 2;
    if (score >= 1000) return 1; // Adjusted threshold for Rank 1
    return 0; // Unranked
  }

  // Sort users by combined score (descending)
  users.sort((a, b) => calculateCombinedScore(b) - calculateCombinedScore(a));

  // Get DOM elements - These IDs need to be added to leaderboard.html
  const topContributorsRow = document.getElementById('topContributorsRow');
  const rankedList = document.getElementById('rankedList'); // Assuming you'll change the ol id to rankedList

  // Render the top 3 contributors
  function renderTopContributors() {
    if (!topContributorsRow) return;

    // Clear existing content (static HTML)
    topContributorsRow.innerHTML = '';

    for (let i = 0; i < Math.min(users.length, 3); i++) {
      const user = users[i];
      const userScore = calculateCombinedScore(user);
      const userRank = calculateUserRank(userScore);
      let rankBadgeHtml = '';
      let cardBorderClass = '';
      let avatarBgClass = `bg-${user.color}`; // Use color property for avatar

      if (i === 0) { // Gold
        rankBadgeHtml = '<span class="badge bg-warning text-dark"><i class="fas fa-crown"></i> Gold</span>';
        cardBorderClass = 'border-warning';
      } else if (i === 1) { // Silver
        rankBadgeHtml = '<span class="badge bg-secondary"><i class="fas fa-medal"></i> Silver</span>';
        cardBorderClass = 'border-secondary';
      } else if (i === 2) { // Bronze
        rankBadgeHtml = '<span class="badge bg-danger"><i class="fas fa-medal"></i> Bronze</span>';
        cardBorderClass = 'border-danger';
      }

      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <div class="card h-100 border-2 ${cardBorderClass} leaderboard-card shadow-sm">
          <div class="card-body text-center">
            <div class="avatar avatar-lg ${avatarBgClass} text-white mb-2 mx-auto">${user.initials}</div>
            <h5 class="fw-bold mb-0">${user.name}</h5>
            <div class="text-muted small mb-2">${user.school}</div>
            <div class="mb-2">
              <span class="me-3"><strong>Views:</strong> ${user.totalViews}</span>
              <span class="me-3"><strong>Downloads:</strong> ${user.totalDownloads}</span>
              <span class="me-3"><strong>Likes:</strong> ${user.totalLikes}</span>
            </div>
            <div>
              <span class="me-3"><strong>Avg Rating:</strong> <span class="text-warning">★ ${user.avgRating.toFixed(1)}</span></span>
              ${rankBadgeHtml}
            </div>
          </div>
        </div>
      `;
      topContributorsRow.appendChild(col);
    }
  }

  // Render the rest of the ranked list
  function renderRankedList() {
    if (!rankedList) return; // Exit if ranked list container not found

    // Clear existing content (static HTML)
    rankedList.innerHTML = '';

    for (let i = 3; i < users.length; i++) { // Start from the 4th user
      const user = users[i];
      const userScore = calculateCombinedScore(user);
      const userRank = calculateUserRank(userScore);
      const rankText = userRank > 0 ? `Rank ${userRank}` : 'Unranked';

      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex align-items-center';
      // Add number to the list item based on index + 4 (since first 3 are separate)
      listItem.innerHTML = `
        <span class="me-3">${i + 1}.</span>
        <span class="avatar bg-${user.color} text-white me-3">${user.initials}</span>
        <div class="flex-grow-1">
          <div class="fw-bold">${user.name}</div>
          <div class="text-muted small">${user.school}</div>
        </div>
        <span class="me-3"><i class="fas fa-eye"></i> <strong>Views:</strong> <span class="badge bg-primary">${user.totalViews}</span></span>
        <span class="me-3"><i class="fas fa-download"></i> <strong>Downloads:</strong> <span class="badge bg-success">${user.totalDownloads}</span></span>
        <span class="me-3"><i class="fas fa-thumbs-up"></i> <strong>Likes:</strong> <span class="badge bg-info">${user.totalLikes}</span></span>
        <span class="text-warning me-3"><i class="fas fa-star"></i> <strong>Avg Rating:</strong> ${user.avgRating.toFixed(1)}</span>
        <span class="badge bg-secondary">${rankText}</span>
      `;
      rankedList.appendChild(listItem);
    }
  }

  // Initialize the leaderboard
  // Call render functions after DOM is ready
  renderTopContributors();
  renderRankedList();

  // Tab switching with fade animation
  document.querySelectorAll('#leaderboardTabs .nav-link').forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('#leaderboardTabs .nav-link').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      // Fade out
      document.getElementById('topContributors').style.opacity = 0;
      document.getElementById('contributorsList').style.opacity = 0;
      setTimeout(() => {
        renderLeaderboard(this.getAttribute('data-tab'));
        document.getElementById('topContributors').style.opacity = 1;
        document.getElementById('contributorsList').style.opacity = 1;
      }, 250);
    });
  });

  // Period switching (All Time, This Year, This Month)
  document.querySelectorAll('[data-period]').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      // You can add logic here to filter data by period if you have it
    });
  });

  // Initial render
  renderLeaderboard();
}); 