document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const askQuestionForm = document.getElementById('askQuestionForm');
    const questionsList = document.querySelector('.questions-list');
    const filterTags = document.querySelectorAll('.filter-tags .btn');
    const questionDetailsModal = new bootstrap.Modal(document.getElementById('questionDetailsModal'));
    const askQuestionModal = new bootstrap.Modal(document.getElementById('askQuestionModal'));

    // Sample questions data (replace with API call)
    const questions = [
        {
            id: 1,
            title: 'How to implement machine learning in image recognition?',
            body: 'I\'m working on a final year project about image recognition using machine learning. Can anyone suggest the best approach to implement this? I\'m particularly interested in using Python and TensorFlow.',
            tags: ['machine-learning', 'computer-vision', 'python'],
            author: 'John Doe',
            authorImage: 'https://via.placeholder.com/32',
            date: '2 days ago',
            views: 245,
            answers: 8,
            upvotes: 15,
            department: 'Computer Science',
            answers: [
                {
                    author: 'Jane Smith',
                    authorImage: 'https://via.placeholder.com/32',
                    body: 'For image recognition, I recommend starting with a pre-trained model like ResNet or VGG16. You can use transfer learning to fine-tune it for your specific use case...',
                    date: '1 day ago',
                    upvotes: 12,
                    isAccepted: true
                }
            ]
        },
        {
            id: 2,
            title: 'Best practices for sustainable energy projects?',
            body: 'Looking for advice on implementing sustainable energy solutions in urban areas. What are the best practices to consider? I\'m focusing on solar and wind energy integration.',
            tags: ['sustainability', 'energy', 'urban-planning'],
            author: 'Alice Johnson',
            authorImage: 'https://via.placeholder.com/32',
            date: '1 day ago',
            views: 180,
            answers: 5,
            upvotes: 8,
            department: 'Engineering',
            answers: [
                {
                    author: 'Robert Brown',
                    authorImage: 'https://via.placeholder.com/32',
                    body: 'When implementing sustainable energy solutions, consider the following key factors: 1) Local climate and weather patterns, 2) Building orientation and shading, 3) Energy storage solutions...',
                    date: '12 hours ago',
                    upvotes: 6,
                    isAccepted: false
                }
            ]
        }
    ];

    // Initialize the Q&A page
    function initializeQA() {
        renderQuestions(questions);
        setupEventListeners();
    }

    // Render questions in the list
    function renderQuestions(questionsToRender) {
        questionsList.innerHTML = '';
        
        questionsToRender.forEach(question => {
            const questionCard = createQuestionCard(question);
            questionsList.appendChild(questionCard);
        });
    }

    // Create a question card element
    function createQuestionCard(question) {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title">
                            <a href="#" class="text-decoration-none view-question" data-question-id="${question.id}">
                                ${question.title}
                            </a>
                        </h5>
                        <p class="card-text text-muted">
                            ${question.body.substring(0, 150)}${question.body.length > 150 ? '...' : ''}
                        </p>
                        <div class="d-flex gap-2 mb-2">
                            ${question.tags.map(tag => 
                                `<span class="badge bg-primary">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="mb-2">
                            <i class="fas fa-eye"></i> ${question.views} views
                        </div>
                        <div>
                            <i class="fas fa-comments"></i> ${question.answers.length} answers
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="d-flex align-items-center">
                        <img src="${question.authorImage}" class="rounded-circle me-2" alt="${question.author}">
                        <div>
                            <small class="d-block">${question.author}</small>
                            <small class="text-muted">Asked ${question.date}</small>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary upvote-question" data-question-id="${question.id}">
                            <i class="fas fa-thumbs-up"></i> ${question.upvotes}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search input
        searchInput.addEventListener('input', debounce(handleSearch, 300));

        // Filter tags
        filterTags.forEach(tag => {
            tag.addEventListener('click', handleFilterTag);
        });

        // Ask question form
        askQuestionForm.addEventListener('submit', handleAskQuestion);

        // Question card buttons
        document.querySelectorAll('.view-question').forEach(button => {
            button.addEventListener('click', handleViewQuestion);
        });

        document.querySelectorAll('.upvote-question').forEach(button => {
            button.addEventListener('click', handleUpvote);
        });
    }

    // Handle search
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredQuestions = questions.filter(question => 
            question.title.toLowerCase().includes(searchTerm) ||
            question.body.toLowerCase().includes(searchTerm) ||
            question.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        renderQuestions(filteredQuestions);
        setupEventListeners();
    }

    // Handle filter tag click
    function handleFilterTag(e) {
        const selectedTag = e.target.textContent;
        
        // Update active state
        filterTags.forEach(tag => {
            tag.classList.remove('active');
        });
        e.target.classList.add('active');

        // Filter questions
        const filteredQuestions = selectedTag === 'All' 
            ? questions 
            : questions.filter(question => 
                question.department === selectedTag ||
                question.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
            );
        
        renderQuestions(filteredQuestions);
        setupEventListeners();
    }

    // Handle ask question
    function handleAskQuestion(e) {
        e.preventDefault();
        
        const title = document.getElementById('questionTitle').value;
        const body = document.getElementById('questionBody').value;
        const tags = document.getElementById('questionTags').value.split(',').map(tag => tag.trim());
        const relatedProject = document.getElementById('relatedProject').value;

        // Here you would typically make an API call to submit the question
        console.log('New question:', { title, body, tags, relatedProject });
        
        // Show success message
        showNotification('Question posted successfully!', 'success');
        
        // Close modal and reset form
        askQuestionModal.hide();
        askQuestionForm.reset();
    }

    // Handle view question
    function handleViewQuestion(e) {
        e.preventDefault();
        const questionLink = e.target.closest('.view-question');
        if (!questionLink) {
            console.log('Clicked element is not a question link.');
            return;
        }

        const questionId = questionLink.dataset.questionId;
        console.log('Question link clicked, ID:', questionId);

        const question = questions.find(q => q.id === parseInt(questionId));
        
        if (question) {
            console.log('Question found:', question.title);
            const modalBody = document.querySelector('#questionDetailsModal .modal-body');
            if (!modalBody) {
                 console.error('Modal body not found!');
                 return;
            }

            // Placeholder: Check if user is logged in to show answer/comment forms
            const isLoggedIn = true; // Simulate logged-in status for now

            // Implement unique view counting using localStorage
            const viewedQuestions = JSON.parse(localStorage.getItem('viewedQuestions') || '[]');
             console.log('Viewed questions from localStorage:', viewedQuestions);

            if (!viewedQuestions.includes(questionId)) {
                // First time viewing - increment count
                 console.log('First time viewing this question. Incrementing view count.');
                question.views++;
                viewedQuestions.push(questionId);
                localStorage.setItem('viewedQuestions', JSON.stringify(viewedQuestions));
                 console.log('New view count (in memory):', question.views);
                 console.log('Updated viewedQuestions in localStorage:', localStorage.getItem('viewedQuestions'));
                
                // Update view count in the question card on the main page
                const questionCard = document.querySelector(`.card .view-question[data-question-id="${questionId}"]`)?.closest('.card');
                 console.log('Question card element found:', !!questionCard);

                if (questionCard) {
                    const viewCountElement = questionCard.querySelector('.fa-eye').nextSibling; // Get the text node next to the eye icon
                     console.log('View count element found in card:', !!viewCountElement);
                     console.log('View count element node type:', viewCountElement?.nodeType);

                    if (viewCountElement && viewCountElement.nodeType === Node.TEXT_NODE) {
                         // Update the text content, keeping potential leading space
                        viewCountElement.textContent = ` ${question.views} views`;
                         console.log('View count on card updated to:', viewCountElement.textContent);
                    }
                }
                 showNotification('Question view counted!', 'success');
            } else {
                 console.log('Question already viewed by user:', questionId);
                 showNotification('You have already viewed this question.', 'info');
            }

            // Fetch answers for this question from localStorage (or API later)
            const allAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
            const questionAnswers = allAnswers.filter(answer => answer.questionId === question.id);

            modalBody.innerHTML = `
                <div class="question-details">
                    <h4>${question.title}</h4>
                    <div class="d-flex gap-2 mb-3">
                        ${question.tags.map(tag => 
                            `<span class="badge bg-primary">${tag}</span>`
                        ).join('')}
                    </div>
                    <div class="question-body mb-4">
                        <p>${question.body}</p>
                    </div>

                    <!-- Answers Section -->
                    <div class="answers-section">
                        <h5>Answers (${questionAnswers.length})</h5>
                        ${questionAnswers.length > 0 ? questionAnswers.map(answer => `
                            <div class="card mb-3 ${answer.isAccepted ? 'border-success' : ''}">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex align-items-center">
                                            <img src="${answer.authorImage}" class="rounded-circle me-2" alt="${answer.author}">
                                            <div>
                                                <small class="d-block">${answer.author}</small>
                                                <small class="text-muted">Answered ${answer.date}</small>
                                            </div>
                                        </div>
                                        ${answer.isAccepted ? 
                                            '<span class="badge bg-success">Accepted</span>' : 
                                            (isLoggedIn ? '<button class="btn btn-sm btn-outline-success">Accept</button>' : '')
                                        }
                                    </div>
                                    <p class="mt-3">${answer.body}</p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-outline-primary answer-upvote-button" data-answer-id="${answer.id}">
                                            <i class="fas fa-thumbs-up"></i> ${answer.upvotes || 0}
                                        </button>
                                        <!-- Reply button on answers could be added here -->
                                    </div>
                                </div>
                            </div>
                        `).join('') : '<p class="text-muted">No answers yet. Be the first to answer!</p>'}
                    </div>

                    <!-- Answer Form -->
                    ${isLoggedIn ? `
                        <div class="answer-form mt-4">
                            <h5>Your Answer</h5>
                            <form class="add-answer-form" data-question-id="${question.id}">
                                <div class="mb-3">
                                    <textarea class="form-control" rows="4" required
                                        placeholder="Write your answer here..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Post Answer</button>
                            </form>
                        </div>
                    ` : '<p class="text-muted mt-4">Login to post an answer or comment.</p>'}

                </div>
            `;
            
            questionDetailsModal.show();

            // Add event listeners for the answer form AFTER rendering
            if (isLoggedIn) {
                 modalBody.querySelector('.add-answer-form')?.addEventListener('submit', handlePostAnswer);
            }

             // Add event listeners for answer upvote buttons AFTER rendering modal content
             modalBody.querySelectorAll('.answer-upvote-button').forEach(button => {
                 button.addEventListener('click', handleAnswerUpvote);
             });

        } else {
             console.error('Question not found with ID:', questionId);
        }
    }

    // Handle posting a new answer
    function handlePostAnswer(e) {
        e.preventDefault();
        const form = e.target;
        const questionId = parseInt(form.dataset.questionId);
        const answerTextarea = form.querySelector('textarea');
        const answerBody = answerTextarea.value.trim();

        if (answerBody === '') {
            showNotification('Answer cannot be empty.', 'warning');
            return;
        }

        // Placeholder: Get actual logged-in user info
        const currentUser = { author: 'Current User', authorImage: 'https://via.placeholder.com/32' }; // Simulate user

        // Create new answer object
        const newAnswer = {
            id: Date.now(), // Simple unique ID
            questionId: questionId,
            author: currentUser.author,
            authorImage: currentUser.authorImage,
            body: answerBody,
            date: 'just now', // Or format current date/time
            upvotes: 0,
            isAccepted: false
        };

        // Save answer to localStorage
        const allAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
        allAnswers.push(newAnswer);
        localStorage.setItem('answers', JSON.stringify(allAnswers));
        console.log('Posted new answer:', newAnswer);

        // Increment answer count for the question in the main data array
        const question = questions.find(q => q.id === questionId);
        if (question) {
            // Add the new answer to the question's answers array in the main data
            if (!question.answers) {
                question.answers = [];
            }
            // Note: We are pushing to the in-memory 'questions' array's answer list
            // This is temporary as the actual answers are in localStorage, but helps update the count
             // A more robust solution would sync localStorage answers back to the main questions array on load
             // For now, we'll just increment the count property directly for display on the card
            question.answers.length++; // Increment the count property directly
            console.log('Question answer count incremented in memory:', question.answers.length);

            // Update the answer count in the question card on the main page
            const questionCard = document.querySelector(`.card .view-question[data-question-id="${questionId}"]`)?.closest('.card');
            if (questionCard) {
                const answerCountElement = questionCard.querySelector('.fa-comments').nextSibling; // Get the text node next to the comments icon
                 if (answerCountElement && answerCountElement.nodeType === Node.TEXT_NODE) {
                     // Update the text content, keeping potential leading space
                    answerCountElement.textContent = ` ${question.answers.length} answers`;
                     console.log('Question card answer count updated:', answerCountElement.textContent);
                 }
            }
        }

        showNotification('Answer posted successfully!', 'success');
        
        // Clear the form
        answerTextarea.value = '';

        // Re-render the modal to show the new answer
        if(question) {
            // Re-fetching the question data from localStorage to show the new answer in the modal
            handleViewQuestion({ target: document.querySelector(`.view-question[data-question-id="${questionId}"]`) });
        }
    }

    // Handle upvoting an answer (new function)
    function handleAnswerUpvote(e) {
         const button = e.target.closest('.answer-upvote-button');
         if (!button) return;

         const answerId = parseInt(button.dataset.answerId);

         // Placeholder: Implement unique upvoting per user per answer using localStorage
         const upvotedAnswers = JSON.parse(localStorage.getItem('upvotedAnswers') || '[]');
         if (upvotedAnswers.includes(answerId)) {
             showNotification('You have already upvoted this answer.', 'info');
             return;
         }

         // Increment upvote count for the answer in localStorage (and the main data if synced)
         const allAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
         const answerToUpdate = allAnswers.find(answer => answer.id === answerId);

         if (answerToUpdate) {
             answerToUpdate.upvotes = (answerToUpdate.upvotes || 0) + 1; // Ensure upvotes is a number
             localStorage.setItem('answers', JSON.stringify(allAnswers));

             // Add answer ID to upvoted answers in localStorage
             upvotedAnswers.push(answerId);
             localStorage.setItem('upvotedAnswers', JSON.stringify(upvotedAnswers));

             // Update the button text in the modal
             const upvoteCountSpan = button.querySelector('i').nextSibling; // Get the text node next to the icon
             if (upvoteCountSpan && upvoteCountSpan.nodeType === Node.TEXT_NODE) {
                 upvoteCountSpan.textContent = ` ${answerToUpdate.upvotes}`;
             } else { // Fallback
                 button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${answerToUpdate.upvotes}`;
             }
             showNotification('Answer upvoted!', 'success');
         } else {
             console.error('Answer not found for upvoting with ID:', answerId);
         }
    }

    // Handle upvote
    function handleUpvote(e) {
        const button = e.target.closest('.upvote-question');
        if (!button) return; // Ensure a button was clicked

        const questionId = button.dataset.questionId;
        const question = questions.find(q => q.id === parseInt(questionId));
        
        if (question) {
            // Increment upvote count
            question.upvotes++;
            
            // Update the button text
            const upvoteCountSpan = button.querySelector('i').nextSibling; // Get the text node next to the icon
             if (upvoteCountSpan && upvoteCountSpan.nodeType === Node.TEXT_NODE) {
                 upvoteCountSpan.textContent = ` ${question.upvotes}`;
             } else { // Fallback if text node structure is different
                 button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${question.upvotes}`;
             }
             showNotification('Question upvoted!', 'success');
        } else {
             console.error('Question not found for upvoting with ID:', questionId);
        }
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
    initializeQA();
}); 