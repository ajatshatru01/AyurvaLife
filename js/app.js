import { AppState } from './state.js';
import { API_BASE, generateDietPlanForPatient } from './api.js';
import { showLoading, hideLoading, showNotification, hideNotification, validateEmail, validatePhone, showError, hideError, clearAllErrors, generatePatientId } from './utils.js';
import { updateNavigationVisibility, updateNavigationForLoggedInUser, navigateToPage, updateNavigation, toggleMobileMenu } from './navigation.js';
import { handleLogin, logout, showForgotPassword, showRegister } from './auth.js';
import { loadPatients, createPatientElement, showAddPatientModal, closeAddPatientModal, handleAddPatient, validatePatientData, editPatient, handleEditPatient, deletePatient, searchPatients, filterByDosha, displayFilteredPatients, viewPatientDetails, closePatientDetailsModal, showDietPlanModal, closeDietPlanModal, downloadDietPlanPdf } from './patients.js';
import { startDoshaQuiz, closeDoshaQuiz, displayQuizQuestion, selectQuizOption, showQuizResult, restartQuiz } from './quiz.js';

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');

    // Navigation event listeners
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageId = this.dataset.page;
            console.log('Navigation link clicked:', pageId);
            navigateToPage(pageId);

            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('nav-hamburger');
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('nav-hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Patient search and filter
    const patientSearch = document.getElementById('patient-search');
    if (patientSearch) {
        patientSearch.addEventListener('input', searchPatients);
    }

    const doshaFilter = document.getElementById('dosha-filter');
    if (doshaFilter) {
        doshaFilter.addEventListener('change', filterByDosha);
    }

    // Modal close on outside click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Form input error clearing
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const fieldName = this.name || this.id;
            if (fieldName) {
                hideError(fieldName);
            }
        });
    });

    // Initialize navigation
    updateNavigation();
    updateNavigationForLoggedInUser();

    // Show initial page based on hash
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash + '-page')) {
        navigateToPage(hash);
    } else {
        navigateToPage('home');
    }

    console.log('Application initialized successfully');
});

// Global functions for inline event handlers
window.navigateToPage = navigateToPage;
window.logout = logout;
window.showForgotPassword = showForgotPassword;
window.showRegister = showRegister;
window.showAddPatientModal = showAddPatientModal;
window.closeAddPatientModal = closeAddPatientModal;
window.editPatient = editPatient;
window.deletePatient = deletePatient;
window.viewPatientDetails = viewPatientDetails;
window.closePatientDetailsModal = closePatientDetailsModal;
window.startDoshaQuiz = startDoshaQuiz;
window.closeDoshaQuiz = closeDoshaQuiz;
window.restartQuiz = restartQuiz;
window.hideNotification = hideNotification;
window.generateDietPlanForPatient = generateDietPlanForPatient;
window.showDietPlanModal = showDietPlanModal;
window.closeDietPlanModal = closeDietPlanModal;
