import { AppState } from './state.js';
import { showNotification, showError, clearAllErrors, validateEmail, showLoading, hideLoading } from './utils.js';
import { updateNavigationVisibility, updateNavigation, navigateToPage } from './navigation.js';

export function handleLogin(event) {
    event.preventDefault();
    clearAllErrors();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput || !passwordInput) {
        console.error('Login form elements not found');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    // Email validation
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!isValid) return;

    showLoading();

    // Simulate API call
    setTimeout(() => {
        hideLoading();

        // Demo credentials check
        if (email === 'demo@ayurvalife.com' && password === 'demo123') {
            AppState.isLoggedIn = true;
            AppState.currentUser = {
                email: email,
                name: 'Dr. Demo User'
            };

            showNotification('Login successful! Welcome to AyurvaLife.');
            navigateToPage('patients');
        } else {
            showError('password', 'Invalid email or password');
        }
    }, 1500);
}

export function logout() {
    AppState.isLoggedIn = false;
    AppState.currentUser = null;
    updateNavigationVisibility();

    // Hide all pages first
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show login page directly
    const loginPage = document.getElementById('login-page');
    if (loginPage) {
        loginPage.classList.add('active');
        AppState.currentPage = 'login';
        updateNavigation();
    }

    showNotification('Logged out successfully');
}

export function showForgotPassword() {
    showNotification('Password reset functionality would be implemented in production', 'info');
}

export function showRegister() {
    showNotification('Registration functionality would be implemented in production', 'info');
}

