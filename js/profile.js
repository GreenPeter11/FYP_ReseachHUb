// Add logic here to fetch and display user information and projects

document.addEventListener('DOMContentLoaded', () => {
    // Assume user data is stored in localStorage under the key 'userData'
    const userData = JSON.parse(localStorage.getItem('userData'));

    const userNameElement = document.getElementById('profileUserName');
    const userEmailElement = document.getElementById('profileUserEmail');
    const studentIdElement = document.getElementById('studentId');
    const userSchoolElement = document.getElementById('profileUserSchool');
    const userDepartmentElement = document.getElementById('profileUserDepartment');

    if (userData) {
        // Display user information
        if (userNameElement) userNameElement.textContent = userData.fullName || 'N/A';
        if (userEmailElement) userEmailElement.textContent = userData.universityEmail || 'N/A';
        if (studentIdElement) studentIdElement.textContent = userData.studentId || 'N/A';
        if (userSchoolElement) userSchoolElement.textContent = userData.projectSchool || 'N/A';
        if (userDepartmentElement) userDepartmentElement.textContent = userData.projectDepartment || 'N/A';

        // Logic to fetch and display submitted and liked projects would go here
        // This is a placeholder for now.
        console.log('User data loaded:', userData);
    } else {
        // Display default or placeholder information if no user data is found
        if (userNameElement) userNameElement.textContent = 'Guest User';
        if (userEmailElement) userEmailElement.textContent = 'N/A';
        if (studentIdElement) studentIdElement.textContent = 'N/A';
        if (userSchoolElement) userSchoolElement.textContent = 'N/A';
        if (userDepartmentElement) userDepartmentElement.textContent = 'N/A';

        console.log('No user data found in localStorage.');
    }

    // Add event listener for the edit profile button (placeholder)
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            alert('Edit profile functionality not yet implemented.');
        });
    }

    // Placeholder logic for tabs (if needed, Bootstrap handles most of this)
}); 