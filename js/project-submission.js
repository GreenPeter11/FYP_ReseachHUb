document.addEventListener('DOMContentLoaded', function() {
    const projectSubmissionForm = document.getElementById('projectSubmissionForm');
    const projectFileInput = document.getElementById('projectFile');
    const additionalFilesInput = document.getElementById('additionalFiles');

    // File size validation (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

    // Handle project file selection
    projectFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                showNotification('File size exceeds 10MB limit', 'danger');
                e.target.value = ''; // Clear the file input
            } else if (file.type !== 'application/pdf') {
                showNotification('Please upload a PDF file', 'danger');
                e.target.value = ''; // Clear the file input
            }
        }
    });

    // Handle additional files selection
    additionalFilesInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        
        if (invalidFiles.length > 0) {
            showNotification(`${invalidFiles.length} file(s) exceed the 10MB limit`, 'danger');
            e.target.value = ''; // Clear the file input
        }
    });

    // Handle form submission
    projectSubmissionForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate form
        if (!validateProjectForm()) {
            return;
        }

        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('title', document.getElementById('projectTitle').value);
            formData.append('abstract', document.getElementById('projectAbstract').value);
            formData.append('keywords', document.getElementById('projectKeywords').value);
            formData.append('department', document.getElementById('projectDepartment').value);
            formData.append('type', document.getElementById('projectType').value);
            formData.append('visibility', document.querySelector('input[name="visibility"]:checked').value);
            
            // Append project file
            const projectFile = projectFileInput.files[0];
            if (projectFile) {
                formData.append('projectFile', projectFile);
            }

            // Append additional files
            const additionalFiles = additionalFilesInput.files;
            for (let i = 0; i < additionalFiles.length; i++) {
                formData.append('additionalFiles', additionalFiles[i]);
            }

            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful submission
            await simulateSubmission(formData);

            // Show success message
            showNotification('Project submitted successfully!', 'success');
            
            // Reset form
            projectSubmissionForm.reset();
            
            // Redirect to projects page after 2 seconds
            setTimeout(() => {
                window.location.href = 'projects.html';
            }, 2000);

        } catch (error) {
            showNotification('Error submitting project. Please try again.', 'danger');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    // Form validation function
    function validateProjectForm() {
        const title = document.getElementById('projectTitle').value.trim();
        const abstract = document.getElementById('projectAbstract').value.trim();
        const keywords = document.getElementById('projectKeywords').value.trim();
        const department = document.getElementById('projectDepartment').value;
        const type = document.getElementById('projectType').value;
        const projectFile = projectFileInput.files[0];
        const termsChecked = document.getElementById('termsCheck').checked;

        // Validate title
        if (title.length < 5) {
            showNotification('Title must be at least 5 characters long', 'danger');
            return false;
        }

        // Validate abstract
        if (abstract.length < 50) {
            showNotification('Abstract must be at least 50 characters long', 'danger');
            return false;
        }

        // Validate keywords
        if (keywords.split(',').length < 3) {
            showNotification('Please provide at least 3 keywords', 'danger');
            return false;
        }

        // Validate department and type
        if (!department || !type) {
            showNotification('Please select both department and project type', 'danger');
            return false;
        }

        // Validate project file
        if (!projectFile) {
            showNotification('Please upload your project report', 'danger');
            return false;
        }

        // Validate terms
        if (!termsChecked) {
            showNotification('Please agree to the terms and conditions', 'danger');
            return false;
        }

        return true;
    }

    // Simulate form submission (replace with actual API call)
    function simulateSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            }, 2000);
        });
    }

    // Keywords input enhancement
    const keywordsInput = document.getElementById('projectKeywords');
    keywordsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentValue = this.value.trim();
            if (currentValue && !currentValue.endsWith(',')) {
                this.value = currentValue + ', ';
            }
        }
    });

    // Auto-save form data
    let autoSaveTimeout;
    const formInputs = projectSubmissionForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                const formData = new FormData(projectSubmissionForm);
                const formDataObj = Object.fromEntries(formData);
                localStorage.setItem('projectDraft', JSON.stringify(formDataObj));
                showNotification('Draft saved', 'info');
            }, 1000);
        });
    });

    // Load saved draft
    const savedDraft = localStorage.getItem('projectDraft');
    if (savedDraft) {
        const formData = JSON.parse(savedDraft);
        Object.keys(formData).forEach(key => {
            const input = projectSubmissionForm.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = formData[key];
            }
        });
    }
}); 