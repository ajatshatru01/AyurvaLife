import { AppState } from './state.js';
import { showNotification } from './utils.js';
import { loadPatients } from './patients.js';

export function updateNavigationVisibility() {
    const loginNav = document.getElementById('login-nav-item');
    const patientsNav = document.getElementById('patients-nav-item');
    const logoutNav = document.getElementById('logout-nav-item');

    if (AppState.isLoggedIn) {
        if (loginNav) loginNav.classList.add('hidden');
        if (patientsNav) patientsNav.classList.remove('hidden');
        if (logoutNav) logoutNav.classList.remove('hidden');
    } else {
        if (loginNav) loginNav.classList.remove('hidden');
        if (patientsNav) patientsNav.classList.add('hidden');
        if (logoutNav) logoutNav.classList.add('hidden');
    }
}

export function updateNavigationForLoggedInUser() {
    const loginLink = document.querySelector('[data-page="login"]');
    const logoutNavItem = document.getElementById('logout-nav-item');

    if (loginLink) {
        if (AppState.isLoggedIn) {
            loginLink.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
            loginLink.title = 'Go to Patient Dashboard';
            if (logoutNavItem) logoutNavItem.style.display = 'block';
        } else {
            loginLink.innerHTML = 'Dietitian Login';
            loginLink.title = 'Login to your account';
            if (logoutNavItem) logoutNavItem.style.display = 'none';
        }
    }
}

export function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === AppState.currentPage) {
            link.classList.add('active');
        }
    });

    // Update navigation visibility based on login status
    updateNavigationVisibility();
}

export function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('nav-hamburger');
    if (navMenu) navMenu.classList.toggle('active');
    if (hamburger) hamburger.classList.toggle('active');
}

