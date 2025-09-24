// Global application state 
const AppState = {
    currentPage: 'home',
    isLoggedIn: false,
    currentUser: null,
    nextPatientId: 3, // Auto-incrementing patient ID starting from 3
    patients: [
        {
            id: 1,
            patientId: 'AYU001',
            name: "Rajesh Kumar",
            age: 45,
            gender: "Male",
            height: 175,
            weight: 80,
            dosha: "Pitta",
            doshaScores: { vata: 2, pitta: 7, kapha: 1 },
            contact: "rajesh@email.com",
            phone: "+91 9876543210",
            medicalHistory: "Hypertension, Diabetes Type 2",
            dietaryHabits: "Vegetarian",
            currentMedications: "Metformin, Lisinopril",
            allergies: "None known",
            mealFrequency: "3",
            waterIntake: 2.5,
            bowelMovements: "1"
        },
        {
            id: 2,
            patientId: 'AYU002',
            name: "Priya Sharma",
            age: 32,
            gender: "Female",
            height: 160,
            weight: 55,
            dosha: "Vata",
            doshaScores: { vata: 8, pitta: 1, kapha: 1 },
            contact: "priya@email.com",
            phone: "+91 9876543211",
            medicalHistory: "Anxiety, IBS",
            dietaryHabits: "Lacto-vegetarian",
            currentMedications: "None",
            allergies: "Dairy sensitivity",
            mealFrequency: "4",
            waterIntake: 2.0,
            bowelMovements: "2"
        }
    ],
    doshaQuiz: {
        currentQuestion: 0,
        answers: [],
        questions: [
            {
                question: "What is your natural body build?",
                options: [
                    { text: "Thin, lean frame", dosha: "vata", score: 3 },
                    { text: "Medium, muscular build", dosha: "pitta", score: 3 },
                    { text: "Heavy, solid frame", dosha: "kapha", score: 3 }
                ]
            },
            {
                question: "How is your skin typically?",
                options: [
                    { text: "Dry, rough, thin", dosha: "vata", score: 3 },
                    { text: "Soft, warm, prone to redness", dosha: "pitta", score: 3 },
                    { text: "Thick, moist, smooth", dosha: "kapha", score: 3 }
                ]
            },
            {
                question: "What describes your energy levels?",
                options: [
                    { text: "Variable, comes in bursts", dosha: "vata", score: 2 },
                    { text: "Moderate, steady throughout day", dosha: "pitta", score: 2 },
                    { text: "Low but sustainable", dosha: "kapha", score: 2 }
                ]
            },
            {
                question: "How do you handle stress?",
                options: [
                    { text: "Become anxious and worried", dosha: "vata", score: 3 },
                    { text: "Become irritable and angry", dosha: "pitta", score: 3 },
                    { text: "Become withdrawn and sluggish", dosha: "kapha", score: 3 }
                ]
            },
            {
                question: "What is your preferred climate?",
                options: [
                    { text: "Warm and humid", dosha: "vata", score: 2 },
                    { text: "Cool and dry", dosha: "pitta", score: 2 },
                    { text: "Warm and dry", dosha: "kapha", score: 2 }
                ]
            },
            {
                question: "How is your appetite?",
                options: [
                    { text: "Variable, sometimes forget to eat", dosha: "vata", score: 3 },
                    { text: "Strong, get angry when hungry", dosha: "pitta", score: 3 },
                    { text: "Low, can skip meals easily", dosha: "kapha", score: 3 }
                ]
            },
            {
                question: "What describes your sleep pattern?",
                options: [
                    { text: "Light sleeper, often restless", dosha: "vata", score: 2 },
                    { text: "Sound sleep, moderate duration", dosha: "pitta", score: 2 },
                    { text: "Heavy sleeper, need lots of sleep", dosha: "kapha", score: 2 }
                ]
            },
            {
                question: "How do you learn new things?",
                options: [
                    { text: "Quickly but forget easily", dosha: "vata", score: 2 },
                    { text: "At moderate pace with good retention", dosha: "pitta", score: 2 },
                    { text: "Slowly but remember for long time", dosha: "kapha", score: 2 }
                ]
            },
            {
                question: "What is your hair like?",
                options: [
                    { text: "Dry, brittle, thin", dosha: "vata", score: 2 },
                    { text: "Fine, soft, early graying/balding", dosha: "pitta", score: 2 },
                    { text: "Thick, lustrous, strong", dosha: "kapha", score: 2 }
                ]
            },
            {
                question: "How do you make decisions?",
                options: [
                    { text: "Quickly but change mind often", dosha: "vata", score: 3 },
                    { text: "Decisively after analysis", dosha: "pitta", score: 3 },
                    { text: "Slowly and deliberately", dosha: "kapha", score: 3 }
                ]
            }
        ]
    }
};

// API base for backend services (allows override via window.API_BASE)
const API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : 'http://localhost:5000';

// Utility Functions
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

// Detailed patient view modal
function viewPatientDetails(patientId) {
    const patient = AppState.patients.find(p => p.id === patientId);
    if (!patient) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'patient-details-modal';

    const dietaryPreferences = patient.dietaryHabits || 'Not specified';
    const mealFrequency = patient.mealFrequency || 'Not specified';
    const waterIntake = (patient.waterIntake != null) ? `${patient.waterIntake} L` : 'Not specified';

    modal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3>Patient Details - ${patient.name}</h3>
                <button class="close-modal" onclick="closePatientDetailsModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="patient-details-grid">
                    <div class="detail-section">
                        <h4>Personal Information</h4>
                        <p><strong>ID:</strong> ${patient.patientId}</p>
                        <p><strong>Age:</strong> ${patient.age}</p>
                        <p><strong>Gender:</strong> ${patient.gender}</p>
                        <p><strong>Primary Dosha:</strong> ${patient.dosha}</p>
                        <p><strong>Height:</strong> ${patient.height} cm</p>
                        <p><strong>Weight:</strong> ${patient.weight} kg</p>
                    </div>

                    <div class="detail-section">
                        <h4>Contact Information</h4>
                        <p><strong>Email:</strong> ${patient.contact}</p>
                        <p><strong>Phone:</strong> ${patient.phone || 'Not provided'}</p>
                    </div>

                    <div class="detail-section">
                        <h4>Dietary Information</h4>
                        <p><strong>Habits:</strong> ${dietaryPreferences}</p>
                        <p><strong>Meal Frequency:</strong> ${mealFrequency}</p>
                        <p><strong>Water Intake:</strong> ${waterIntake}</p>
                    </div>

                    <div class="detail-section">
                        <h4>Health Parameters</h4>
                        <p><strong>Bowel Movements/day:</strong> ${patient.bowelMovements || 'Not specified'}</p>
                        <p><strong>Allergies:</strong> ${patient.allergies || 'None'}</p>
                    </div>

                    <div class="detail-section">
                        <h4>Medical History</h4>
                        <p><strong>History:</strong> ${patient.medicalHistory || 'None reported'}</p>
                        <p><strong>Current Medications:</strong> ${patient.currentMedications || 'None'}</p>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn--secondary" onclick="closePatientDetailsModal()">Close</button>
                <button class="btn btn--primary" onclick="editPatient(${patient.id}); closePatientDetailsModal();">Edit Patient</button>
                <button class="btn btn--primary" onclick="generateDietPlanForPatient(${patient.id})">Generate Diet Plan</button>
                ${patient.diet_plan ? `<button class="btn" onclick="showDietPlanModal(${patient.id})">View Diet Plan</button>` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closePatientDetailsModal() {
    const modal = document.getElementById('patient-details-modal');
    if (modal) modal.remove();
}

// Diet plan generation via backend API
async function generateDietPlanForPatient(patientId) {
    const patient = AppState.patients.find(p => p.id === patientId);
    if (!patient) {
        showNotification('Patient not found', 'error');
        return;
    }

    showNotification('Generating diet plan...', 'info');
    try {
        const response = await fetch(`${API_BASE}/api/diet-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patient)
        });
        const data = await response.json();
        if (!response.ok || data.error) {
            throw new Error(data.error || 'Failed to generate diet plan');
        }
        patient.diet_plan = data;
        showNotification('Diet plan generated successfully.');
    } catch (err) {
        console.error('Diet plan fetch error:', err);
        showNotification(`Error: ${err.message}`, 'error');
    }
}

function showDietPlanModal(patientId) {
    const patient = AppState.patients.find(p => p.id === patientId);
    if (!patient || !patient.diet_plan) {
        showNotification('No diet plan available. Please generate one first.', 'info');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'diet-plan-modal';

    const plan = patient.diet_plan || {};

    const normalizeItems = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(/\n|,\s*/).filter(Boolean);
        return [];
    };

    const breakfast = normalizeItems(plan.breakfast);
    const lunch = normalizeItems(plan.lunch);
    const dinner = normalizeItems(plan.dinner);
    const snack = normalizeItems(plan.snack);
    const guidelines = typeof plan.general_guidelines === 'string' ? plan.general_guidelines : '';

    const mealRow = (label, items) => `
        <tr>
            <td class="meal-label">${label}</td>
            <td>
                ${items.length ? `<ul class="meal-items">${items.map(i => `<li>${i}</li>`).join('')}</ul>` : '<span class="muted">—</span>'}
            </td>
        </tr>
    `;

    modal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3>Diet Plan</h3>
                <button class="close-modal" onclick="closeDietPlanModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="diet-plan-header">
                    <div class="diet-header-title">
                        <h4>${patient.name}</h4>
                        <span class="diet-subtitle">ID: ${patient.patientId}</span>
                    </div>
                    <div class="diet-plan-meta">
                        <div><strong>Age:</strong> ${patient.age}</div>
                        <div><strong>Gender:</strong> ${patient.gender}</div>
                        <div><strong>Height:</strong> ${patient.height} cm</div>
                        <div><strong>Weight:</strong> ${patient.weight} kg</div>
                        <div><strong>Dosha:</strong> ${patient.dosha}</div>
                    </div>
                </div>

                <table class="diet-table">
                    <thead>
                        <tr>
                            <th>Meal</th>
                            <th>Recommended Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${mealRow('Breakfast', breakfast)}
                        ${mealRow('Lunch', lunch)}
                        ${mealRow('Dinner', dinner)}
                        ${mealRow('Snack', snack)}
                    </tbody>
                </table>

                ${guidelines ? `
                <div class="diet-guidelines">
                    <h4>General Guidelines</h4>
                    <p>${guidelines}</p>
                </div>` : ''}
            </div>
            <div class="modal-actions">
                <button class="btn btn--secondary" onclick="closeDietPlanModal()">Close</button>
                <button class="btn btn--primary" onclick="downloadDietPlanPdf(${patient.id})">Download PDF</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeDietPlanModal() {
    const modal = document.getElementById('diet-plan-modal');
    if (modal) modal.remove();
}

function downloadDietPlanPdf(patientId) {
    const patient = AppState.patients.find(p => p.id === patientId);
    if (!patient || !patient.diet_plan) {
        showNotification('No diet plan available to download.', 'info');
        return;
    }

    const plan = patient.diet_plan;
    const normalizeItems = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(/\n|,\s*/).filter(Boolean);
        return [];
    };

    const breakfast = normalizeItems(plan.breakfast);
    const lunch = normalizeItems(plan.lunch);
    const dinner = normalizeItems(plan.dinner);
    const snack = normalizeItems(plan.snack);
    const guidelines = typeof plan.general_guidelines === 'string' ? plan.general_guidelines : '';

    const mealRow = (label, items) => `
        <tr>
            <td class="meal-label">${label}</td>
            <td>
                ${items.length ? `<ul class="meal-items">${items.map(i => `<li>${i}</li>`).join('')}</ul>` : '<span class="muted">—</span>'}
            </td>
        </tr>
    `;

    const printWin = window.open('', '_blank');
    if (!printWin) {
        showNotification('Popup blocked. Please allow popups to download.', 'error');
        return;
    }

    const styles = `
        <style>
            body { font-family: Arial, sans-serif; color: #1f2121; padding: 24px; }
            h2, h3, h4 { margin: 0 0 8px 0; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
            .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, auto)); gap: 6px 16px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            .table th, .table td { padding: 10px; text-align: left; vertical-align: top; }
            .table thead th { background: #f0f0f0; }
            .table tbody tr + tr td { border-top: 1px solid #e6e6e6; }
            .meal-label { width: 120px; font-weight: 600; }
            .meal-items { margin: 0; padding-left: 18px; }
            .muted { color: #626c71; }
            .guidelines { margin-top: 12px; }
            @media print { @page { margin: 16mm; } }
        </style>
    `;

    const html = `
        <html>
            <head>
                <meta charset="utf-8">
                <title>Diet Plan - ${patient.name}</title>
                ${styles}
            </head>
            <body>
                <div class="header">
                    <div>
                        <h2>Diet Plan</h2>
                        <h4>${patient.name}</h4>
                        <div class="muted">ID: ${patient.patientId}</div>
                    </div>
                    <div class="meta">
                        <div><strong>Age:</strong> ${patient.age}</div>
                        <div><strong>Gender:</strong> ${patient.gender}</div>
                        <div><strong>Height:</strong> ${patient.height} cm</div>
                        <div><strong>Weight:</strong> ${patient.weight} kg</div>
                        <div><strong>Dosha:</strong> ${patient.dosha}</div>
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr><th>Meal</th><th>Recommended Items</th></tr>
                    </thead>
                    <tbody>
                        ${mealRow('Breakfast', breakfast)}
                        ${mealRow('Lunch', lunch)}
                        ${mealRow('Dinner', dinner)}
                        ${mealRow('Snack', snack)}
                    </tbody>
                </table>

                ${guidelines ? `<div class="guidelines"><h4>General Guidelines</h4><p>${guidelines}</p></div>` : ''}
            </body>
        </html>
    `;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    // Wait a tick to ensure rendering, then print
    setTimeout(() => {
        printWin.print();
        printWin.close();
    }, 300);
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.notification-message');
    if (messageElement) {
        messageElement.textContent = message;
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;
        notification.classList.remove('hidden');

        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification();
        }, 5000);
    }
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.add('hidden');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
    });
}

function generatePatientId() {
    const paddedId = String(AppState.nextPatientId).padStart(3, '0');
    return `AYU${paddedId}`;
}

function updateNavigationVisibility() {
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

// Update navigation labels/visibility for logged in/out users
function updateNavigationForLoggedInUser() {
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

// Navigation Functions
function navigateToPage(pageId) {
    console.log('Navigating to page:', pageId);

    // Handle login link click when already logged in - don't log out
    if (pageId === 'login' && AppState.isLoggedIn) {
        // If already logged in and clicking login, go to patients page instead
        pageId = 'patients';
        if (AppState.currentUser && AppState.currentUser.name) {
            showNotification(`Welcome back, ${AppState.currentUser.name}!`);
        }
    }

    // Hide all pages first
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        AppState.currentPage = pageId;

        // Update navigation
        updateNavigation();
        updateNavigationForLoggedInUser();

        // Handle page-specific logic
        if (pageId === 'patients' && !AppState.isLoggedIn) {
            navigateToPage('login');
            showNotification('Please login to access patient management', 'error');
            return;
        }

        if (pageId === 'patients' && AppState.isLoggedIn) {
            loadPatients();
        }

        // Scroll to top
        window.scrollTo(0, 0);
        console.log('Successfully navigated to:', pageId);
    } else {
        console.error('Page not found:', pageId + '-page');
    }
}

function updateNavigation() {
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

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('nav-hamburger');
    if (navMenu) navMenu.classList.toggle('active');
    if (hamburger) hamburger.classList.toggle('active');
}

// Login Functions
function handleLogin(event) {
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

function logout() {
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

function showForgotPassword() {
    showNotification('Password reset functionality would be implemented in production', 'info');
}

function showRegister() {
    showNotification('Registration functionality would be implemented in production', 'info');
}

// Patient Management Functions
function loadPatients() {
    const patientsList = document.getElementById('patients-list');
    const totalPatientsElement = document.getElementById('total-patients');

    if (!patientsList || !totalPatientsElement) return;

    totalPatientsElement.textContent = AppState.patients.length;
    patientsList.innerHTML = '';

    AppState.patients.forEach(patient => {
        const patientElement = createPatientElement(patient);
        patientsList.appendChild(patientElement);
    });
}

function createPatientElement(patient) {
    const patientDiv = document.createElement('div');
    patientDiv.className = 'patient-item';

    // Calculate BMI
    const bmi = (patient.weight / ((patient.height / 100) ** 2)).toFixed(1);

    // Display dosha scores if available
    let doshaDisplay = patient.dosha;
    if (patient.doshaScores) {
        const scores = patient.doshaScores;
        const sortedDoshas = Object.entries(scores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2); // Show top 2 doshas

        if (sortedDoshas.length > 1 && sortedDoshas[1][1] > 0) {
            doshaDisplay = `${sortedDoshas[0][0].charAt(0).toUpperCase() + sortedDoshas[0][0].slice(1)} (${sortedDoshas[0][1]})`;
        }
    }

    patientDiv.innerHTML = `
        <div class="patient-info">
            <h4>${patient.name}</h4>
            <div class="patient-meta">
                <span><strong>ID:</strong> ${patient.patientId}</span>
                <span><strong>Age:</strong> ${patient.age} years</span>
                <span><strong>Gender:</strong> ${patient.gender}</span>
                <span><strong>BMI:</strong> ${bmi}</span>
                <span class="dosha-badge ${patient.dosha.toLowerCase()}">${doshaDisplay}</span>
                <span><strong>Contact:</strong> ${patient.contact}</span>
            </div>
        </div>
        <div class="patient-actions">
            <button class="btn-icon btn-edit" onclick="editPatient(${patient.id})" title="Edit Patient">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deletePatient(${patient.id})" title="Delete Patient">
                <i class="fas fa-trash"></i>
            </button>
            <button class="btn-icon btn-view" onclick="viewPatientDetails(${patient.id})" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;

    return patientDiv;
}

function showAddPatientModal() {
    const modal = document.getElementById('add-patient-modal');
    const form = document.getElementById('add-patient-form');

    if (modal && form) {
        modal.classList.remove('hidden');
        form.reset();
        clearAllErrors();

        // Generate and display new patient ID
        const patientIdField = document.getElementById('patient-id');
        if (patientIdField) {
            patientIdField.value = generatePatientId();
        }

        // Reset form handler and modal title
        form.onsubmit = handleAddPatient;
        const modalTitle = document.querySelector('#add-patient-modal .modal-header h3');
        if (modalTitle) modalTitle.textContent = 'Add New Patient';
    }
}

function closeAddPatientModal() {
    const modal = document.getElementById('add-patient-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function handleAddPatient(event) {
    event.preventDefault();
    clearAllErrors();

    const formData = new FormData(event.target);
    const patientData = Object.fromEntries(formData.entries());

    let isValid = validatePatientData(patientData);
    if (!isValid) return;

    showLoading();

    setTimeout(() => {
        hideLoading();

        // Create new patient with auto-generated ID
        const newPatient = {
            id: AppState.nextPatientId,
            patientId: generatePatientId(),
            ...patientData,
            // Convert numeric fields
            age: parseInt(patientData.age),
            height: parseFloat(patientData.height),
            weight: parseFloat(patientData.weight),
            waterIntake: parseFloat(patientData.waterIntake)
        };

        AppState.patients.push(newPatient);
        AppState.nextPatientId++;

        loadPatients();
        closeAddPatientModal();
        showNotification('Patient added successfully!');
    }, 1000);
}

function validatePatientData(data) {
    let isValid = true;

    // Name validation
    if (!data.name || data.name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }

    // Age validation
    if (!data.age || data.age < 1 || data.age > 120) {
        showError('age', 'Age must be between 1 and 120');
        isValid = false;
    }

    // Gender validation
    if (!data.gender) {
        showError('gender', 'Gender is required');
        isValid = false;
    }

    // Height validation
    if (!data.height || data.height < 30 || data.height > 300) {
        showError('height', 'Height must be between 30 and 300 cm');
        isValid = false;
    }

    // Weight validation
    if (!data.weight || data.weight < 1 || data.weight > 500) {
        showError('weight', 'Weight must be between 1 and 500 kg');
        isValid = false;
    }

    // Email validation
    if (!data.contact) {
        showError('contact', 'Email is required');
        isValid = false;
    } else if (!validateEmail(data.contact)) {
        showError('contact', 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation
    if (!data.phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(data.phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    // Dietary habits validation
    if (!data.dietaryHabits) {
        showError('dietary-habits', 'Dietary habits are required');
        isValid = false;
    }

    // Meal frequency validation
    if (!data.mealFrequency) {
        showError('meal-frequency', 'Meal frequency is required');
        isValid = false;
    }

    // Water intake validation
    if (!data.waterIntake || data.waterIntake < 0.5 || data.waterIntake > 10) {
        showError('water-intake', 'Water intake must be between 0.5 and 10 liters');
        isValid = false;
    }

    // Bowel movements validation
    if (!data.bowelMovements) {
        showError('bowel-movements', 'Bowel movement frequency is required');
        isValid = false;
    }

    // Dosha validation
    if (!data.dosha) {
        showError('dosha', 'Dosha selection is required');
        isValid = false;
    }

    return isValid;
}

function editPatient(patientId) {
    console.log('Editing patient with ID:', patientId);
    const patient = AppState.patients.find(p => p.id === patientId);
    if (!patient) {
        console.error('Patient not found with ID:', patientId);
        return;
    }

    console.log('Found patient:', patient);

    // Show the modal first
    const modal = document.getElementById('add-patient-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }

    // Clear any previous errors
    clearAllErrors();

    // Populate form with patient data - using proper field IDs
    const fieldMappings = [
        { fieldId: 'patient-name', value: patient.name },
        { fieldId: 'patient-id', value: patient.patientId },
        { fieldId: 'patient-age', value: patient.age },
        { fieldId: 'patient-gender', value: patient.gender },
        { fieldId: 'patient-height', value: patient.height },
        { fieldId: 'patient-weight', value: patient.weight },
        { fieldId: 'patient-email', value: patient.contact },
        { fieldId: 'patient-phone', value: patient.phone },
        { fieldId: 'patient-dietary-habits', value: patient.dietaryHabits || '' },
        { fieldId: 'patient-meal-frequency', value: patient.mealFrequency || '' },
        { fieldId: 'patient-water-intake', value: patient.waterIntake || '' },
        { fieldId: 'patient-bowel-movements', value: patient.bowelMovements || '' },
        { fieldId: 'patient-allergies', value: patient.allergies || '' },
        { fieldId: 'patient-medical-history', value: patient.medicalHistory || '' },
        { fieldId: 'patient-medications', value: patient.currentMedications || '' },
        { fieldId: 'patient-dosha', value: patient.dosha || '' }
    ];

    fieldMappings.forEach(field => {
        const element = document.getElementById(field.fieldId);
        if (element) {
            element.value = field.value;
            console.log(`Set ${field.fieldId} to:`, field.value);
        } else {
            console.warn(`Element not found for field:`, field.fieldId);
        }
    });

    // Change form handler for editing
    const form = document.getElementById('add-patient-form');
    if (form) {
        form.onsubmit = (event) => handleEditPatient(event, patientId);
        console.log('Set form handler for editing patient ID:', patientId);
    }

    // Change modal title
    const modalTitle = document.querySelector('#add-patient-modal .modal-header h3');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Patient';
    }
}

function handleEditPatient(event, patientId) {
    event.preventDefault();
    clearAllErrors();

    const formData = new FormData(event.target);
    const patientData = Object.fromEntries(formData.entries());

    let isValid = validatePatientData(patientData);
    if (!isValid) return;

    showLoading();

    setTimeout(() => {
        hideLoading();

        const patientIndex = AppState.patients.findIndex(p => p.id === patientId);
        if (patientIndex !== -1) {
            // Keep the original patient ID and internal ID when editing
            const originalPatient = AppState.patients[patientIndex];
            AppState.patients[patientIndex] = {
                id: patientId, // Keep original internal ID
                patientId: originalPatient.patientId, // Keep original patient ID (AYU###)
                ...patientData,
                // Convert numeric fields
                age: parseInt(patientData.age),
                height: parseFloat(patientData.height),
                weight: parseFloat(patientData.weight),
                waterIntake: parseFloat(patientData.waterIntake)
            };

            loadPatients();
            closeAddPatientModal();
            showNotification('Patient updated successfully!');
        }
    }, 1000);
}

function deletePatient(patientId) {
    const patient = AppState.patients.find(p => p.id === patientId);
    if (patient && confirm(`Are you sure you want to delete ${patient.name}?`)) {
        showLoading();

        setTimeout(() => {
            hideLoading();
            AppState.patients = AppState.patients.filter(p => p.id !== patientId);
            loadPatients();
            showNotification('Patient deleted successfully!');
        }, 500);
    }
}

function searchPatients(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPatients = AppState.patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.contact.toLowerCase().includes(searchTerm) ||
        patient.patientId.toLowerCase().includes(searchTerm)
    );
    displayFilteredPatients(filteredPatients);
}

function filterByDosha(event) {
    const selectedDosha = event.target.value;
    let filteredPatients;

    if (!selectedDosha) {
        filteredPatients = AppState.patients;
    } else {
        filteredPatients = AppState.patients.filter(patient => 
            patient.dosha === selectedDosha
        );
    }

    displayFilteredPatients(filteredPatients);
}

function displayFilteredPatients(patients) {
    const patientsList = document.getElementById('patients-list');
    if (!patientsList) return;

    patientsList.innerHTML = '';
    patients.forEach(patient => {
        const patientElement = createPatientElement(patient);
        patientsList.appendChild(patientElement);
    });
}

// Dosha Quiz Functions - Enhanced with Scoring System
function startDoshaQuiz() {
    console.log('Starting dosha quiz');
    AppState.doshaQuiz.currentQuestion = 0;
    AppState.doshaQuiz.answers = [];

    const modal = document.getElementById('dosha-quiz-modal');
    if (modal) {
        modal.classList.remove('hidden');

        // Reset quiz state
        const quizContent = document.getElementById('quiz-content');
        const quizResult = document.getElementById('quiz-result');

        if (quizContent) quizContent.classList.remove('hidden');
        if (quizResult) quizResult.classList.add('hidden');

        displayQuizQuestion();
    } else {
        console.error('Dosha quiz modal not found');
    }
}

function closeDoshaQuiz() {
    const modal = document.getElementById('dosha-quiz-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function displayQuizQuestion() {
    const quiz = AppState.doshaQuiz;
    const question = quiz.questions[quiz.currentQuestion];

    const questionText = document.getElementById('question-text');
    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('quiz-progress');

    if (questionText) questionText.textContent = question.question;
    if (questionCounter) questionCounter.textContent = `${quiz.currentQuestion + 1} of ${quiz.questions.length}`;

    // Update progress bar
    const progress = ((quiz.currentQuestion + 1) / quiz.questions.length) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Display options
    const optionsContainer = document.getElementById('quiz-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option.text;
            optionDiv.onclick = () => selectQuizOption(index);
            optionsContainer.appendChild(optionDiv);
        });
    }
}

function selectQuizOption(optionIndex) {
    const quiz = AppState.doshaQuiz;
    const question = quiz.questions[quiz.currentQuestion];
    const selectedOption = question.options[optionIndex];

    // Store answer with scoring
    quiz.answers.push({
        dosha: selectedOption.dosha,
        score: selectedOption.score
    });

    // Visual feedback
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => option.classList.remove('selected'));
    if (options[optionIndex]) {
        options[optionIndex].classList.add('selected');
    }

    // Move to next question after delay
    setTimeout(() => {
        quiz.currentQuestion++;
        if (quiz.currentQuestion < quiz.questions.length) {
            displayQuizQuestion();
        } else {
            showQuizResult();
        }
    }, 500);
}

function showQuizResult() {
    // Calculate dosha scores with the new scoring system
    const doshaScores = { vata: 0, pitta: 0, kapha: 0 };

    AppState.doshaQuiz.answers.forEach(answer => {
        doshaScores[answer.dosha] += answer.score;
    });

    // Sort doshas by score
    const sortedDoshas = Object.entries(doshaScores)
        .sort(([,a], [,b]) => b - a);

    const primaryDosha = sortedDoshas[0][0];
    const primaryScore = sortedDoshas[0][1];
    const secondaryDosha = sortedDoshas[1][0];
    const secondaryScore = sortedDoshas[1][1];

    // Hide quiz content, show result
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');

    if (quizContent) quizContent.classList.add('hidden');
    if (quizResult) quizResult.classList.remove('hidden');

    // Display detailed results
    const resultDiv = document.getElementById('dosha-result');
    const descriptionDiv = document.getElementById('dosha-description');

    const doshaInfo = {
        vata: {
            name: 'Vata',
            color: '#8e44ad',
            description: 'You have a Vata constitution! Vata types are creative, energetic, and quick-thinking. Focus on warm, moist foods and maintain regular routines.'
        },
        pitta: {
            name: 'Pitta',
            color: '#e67e22',
            description: 'You have a Pitta constitution! Pitta types are focused, competitive, and goal-oriented. Favor cool, refreshing foods and avoid excessive heat.'
        },
        kapha: {
            name: 'Kapha',
            color: '#27ae60',
            description: 'You have a Kapha constitution! Kapha types are calm, patient, and loyal. Choose light, warm foods and stay active to maintain balance.'
        }
    };

    let resultHTML = '';

    // Determine constitution type
    if (primaryScore >= secondaryScore * 1.5) {
        // Single dosha dominance
        const info = doshaInfo[primaryDosha];
        resultHTML = `
            <div class="dosha-scores">
                <h4>Your Primary Constitution: ${info.name}</h4>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span class="dosha-name">${doshaInfo.vata.name}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${(doshaScores.vata / Math.max(...Object.values(doshaScores))) * 100}%; background: ${doshaInfo.vata.color}"></div>
                        </div>
                        <span class="score-value">${doshaScores.vata}</span>
                    </div>
                    <div class="score-item">
                        <span class="dosha-name">${doshaInfo.pitta.name}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${(doshaScores.pitta / Math.max(...Object.values(doshaScores))) * 100}%; background: ${doshaInfo.pitta.color}"></div>
                        </div>
                        <span class="score-value">${doshaScores.pitta}</span>
                    </div>
                    <div class="score-item">
                        <span class="dosha-name">${doshaInfo.kapha.name}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${(doshaScores.kapha / Math.max(...Object.values(doshaScores))) * 100}%; background: ${doshaInfo.kapha.color}"></div>
                        </div>
                        <span class="score-value">${doshaScores.kapha}</span>
                    </div>
                </div>
            </div>
        `;

        if (descriptionDiv) {
            descriptionDiv.textContent = info.description;
        }
    } else {
        // Dual dosha constitution
        const primaryInfo = doshaInfo[primaryDosha];
        const secondaryInfo = doshaInfo[secondaryDosha];

        resultHTML = `
            <div class="dosha-scores">
                <h4>Your Constitution: ${primaryInfo.name}-${secondaryInfo.name}</h4>
                <p>You have a dual constitution with ${primaryInfo.name} dominance.</p>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span class="dosha-name">${doshaInfo.vata.name}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${(doshaScores.vata / Math.max(...Object.values(doshaScores))) * 100}%; background: ${doshaInfo.vata.color}"></div>
                        </div>
                        <span class="score-value">${doshaScores.vata}</span>
                    </div>
                    <div class="score-item">
                        <span class="dosha-name">${doshaInfo.pitta.name}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${(doshaScores.pitta / Math.max(...Object.values(doshaScores))) * 100}%; background: ${doshaInfo.pitta.color}"></div>
                        </div>
                        <span class="score-value">${doshaScores.pitta}</span>
                    </div>
                    <div class="score-item">
                        <span class="dosha-name">${doshaInfo.kapha.name}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${(doshaScores.kapha / Math.max(...Object.values(doshaScores))) * 100}%; background: ${doshaInfo.kapha.color}"></div>
                        </div>
                        <span class="score-value">${doshaScores.kapha}</span>
                    </div>
                </div>
            </div>
        `;

        if (descriptionDiv) {
            descriptionDiv.textContent = `You have a ${primaryInfo.name}-${secondaryInfo.name} constitution. This means you exhibit characteristics of both doshas, with ${primaryInfo.name} being more dominant. Balance both energies through appropriate diet and lifestyle choices.`;
        }
    }

    if (resultDiv) {
        resultDiv.innerHTML = resultHTML;
    }
}

function restartQuiz() {
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');

    if (quizContent) quizContent.classList.remove('hidden');
    if (quizResult) quizResult.classList.add('hidden');

    startDoshaQuiz();
}

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

            // Initialize food analysis when navigating to that page
            if (pageId === 'food-analysis') {
                setTimeout(initializeFoodAnalysis, 100);
            }

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

    // Add patient form submit is assigned dynamically in showAddPatientModal/editPatient via form.onsubmit
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
        if (hash === 'food-analysis') {
            setTimeout(initializeFoodAnalysis, 100);
        }
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

// Food Analysis Functions
let selectedImageFile = null;
let currentImageData = null;

function initializeFoodAnalysis() {
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const analyzeButton = document.getElementById('analyze-button');
    const clearButton = document.getElementById('clear-button');

    if (!uploadArea || !imageInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });

    // File input change
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });

    // Analyze button
    if (analyzeButton) {
        analyzeButton.addEventListener('click', analyzeFood);
    }

    // Clear button
    if (clearButton) {
        clearButton.addEventListener('click', clearImage);
    }
}

function handleImageFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }

    selectedImageFile = file;
    const reader = new FileReader();

    reader.onload = function(e) {
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = document.getElementById('upload-placeholder');
        const analyzeButton = document.getElementById('analyze-button');

        if (previewImage && uploadPlaceholder) {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            uploadPlaceholder.classList.add('hidden');
            
            // Store base64 data for analysis (remove data URL prefix)
            currentImageData = e.target.result.split(',')[1];
        }

        if (analyzeButton) {
            analyzeButton.disabled = false;
        }
    };

    reader.readAsDataURL(file);
}

function clearImage() {
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const imageInput = document.getElementById('image-input');
    const analyzeButton = document.getElementById('analyze-button');
    const resultsSection = document.getElementById('analysis-results');
    const placeholder = document.getElementById('analysis-placeholder');

    if (previewImage) {
        previewImage.src = '';
        previewImage.classList.add('hidden');
    }

    if (uploadPlaceholder) {
        uploadPlaceholder.classList.remove('hidden');
    }

    if (imageInput) {
        imageInput.value = '';
    }

    if (analyzeButton) {
        analyzeButton.disabled = true;
    }

    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }

    if (placeholder) {
        placeholder.classList.remove('hidden');
    }

    selectedImageFile = null;
    currentImageData = null;
}

async function analyzeFood() {
    if (!currentImageData) {
        showNotification('Please select an image first', 'error');
        return;
    }

    const loadingDiv = document.getElementById('analysis-loading');
    const resultsDiv = document.getElementById('analysis-results');
    const placeholderDiv = document.getElementById('analysis-placeholder');
    const analyzeButton = document.getElementById('analyze-button');

    // Show loading state
    if (loadingDiv) loadingDiv.classList.remove('hidden');
    if (resultsDiv) resultsDiv.classList.add('hidden');
    if (placeholderDiv) placeholderDiv.classList.add('hidden');
    if (analyzeButton) analyzeButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/api/analyze-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: currentImageData
            })
        });

        const data = await response.json();
        console.log('Received analysis data:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Analysis failed');
        }

        displayAnalysisResults(data);
        showNotification('Food analysis completed successfully!');
    } catch (error) {
        console.error('Analysis error:', error);
        showNotification(`Analysis failed: ${error.message}`, 'error');
        
        // Show placeholder again on error
        if (placeholderDiv) placeholderDiv.classList.remove('hidden');
    } finally {
        // Hide loading state
        if (loadingDiv) loadingDiv.classList.add('hidden');
        if (analyzeButton) analyzeButton.disabled = false;
    }
}

function displayAnalysisResults(data) {
    console.log('displayAnalysisResults called with:', data);
    const resultsDiv = document.getElementById('analysis-results');
    const placeholderDiv = document.getElementById('analysis-placeholder');

    if (!resultsDiv) return;

    if (placeholderDiv) placeholderDiv.classList.add('hidden');
    resultsDiv.classList.remove('hidden');

    // Handle error in analysis
    if (data.error) {
        let errorMessage = data.error;
        let helpText = '';
        
        if (data.error.includes('Google API key')) {
            helpText = `
                <div class="help-text">
                    <h5>Setup Instructions:</h5>
                    <ol>
                        <li>Get your Google API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
                        <li>Open the .env file in the AyurvaLife folder</li>
                        <li>Replace 'your_google_api_key_here' with your actual API key</li>
                        <li>Restart the backend server (python diet.py)</li>
                    </ol>
                </div>
            `;
        }
        
        resultsDiv.innerHTML = `
            <div class="analysis-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Analysis Error</h4>
                <p>${errorMessage}</p>
                ${helpText}
                ${data.debug ? `<details><summary>Debug Info</summary><pre>${data.debug}</pre></details>` : ''}
            </div>
        `;
        return;
    }

    // Check if we got debug response
    if (data.dish === 'Unknown' && data.debug_response) {
        resultsDiv.innerHTML = `
            <div class="analysis-error">
                <i class="fas fa-info-circle"></i>
                <h4>Analysis Issue</h4>
                <p>The AI had trouble analyzing this image. This might happen if:</p>
                <ul>
                    <li>The image is not clear enough</li>
                    <li>The food is not easily recognizable</li>
                    <li>The image contains non-food items</li>
                </ul>
                <p><strong>Tip:</strong> Try uploading a clearer image of a well-known dish.</p>
                <details>
                    <summary>Raw AI Response</summary>
                    <pre>${data.debug_response}</pre>
                </details>
            </div>
        `;
        return;
    }

    const dish = data.dish || 'Unknown Dish';
    const ingredients = data.ingredients || [];
    const ayurvedaAnalysis = data.ayurveda_analysis || {};
    const ingredientAnalysis = ayurvedaAnalysis.ingredient_analysis || [];
    const dishAnalysis = ayurvedaAnalysis.dish_analysis || {};

    console.log('Parsed data:', { dish, ingredients, ayurvedaAnalysis, ingredientAnalysis, dishAnalysis });

    let resultsHTML = `
        <div class="dish-info">
            <div class="dish-name">${dish}</div>
            <div class="ingredients-section">
                <h4>Main Ingredients:</h4>
                <div class="ingredients-list">
                    ${ingredients.map(ingredient => `
                        <span class="ingredient-tag">${ingredient}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Add dish-level analysis if available
    if (dishAnalysis && Object.keys(dishAnalysis).length > 0) {
        resultsHTML += `
            <div class="dish-analysis">
                <h3>Overall Dish Analysis</h3>
                
                ${dishAnalysis.dosha_score ? `
                    <div class="dosha-score-section">
                        <h4>Dosha Effects</h4>
                        <div class="dosha-scores">
                            <div class="dosha-score-item vata">
                                <span class="dosha-label">Vata</span>
                                <span class="score-value">${dishAnalysis.dosha_score.vata}</span>
                            </div>
                            <div class="dosha-score-item pitta">
                                <span class="dosha-label">Pitta</span>
                                <span class="score-value">${dishAnalysis.dosha_score.pitta}</span>
                            </div>
                            <div class="dosha-score-item kapha">
                                <span class="dosha-label">Kapha</span>
                                <span class="score-value">${dishAnalysis.dosha_score.kapha}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${dishAnalysis.ayurvedic_properties ? `
                    <div class="properties-section">
                        <h4>Ayurvedic Properties</h4>
                        <p class="properties-text">${dishAnalysis.ayurvedic_properties}</p>
                    </div>
                ` : ''}
                
                <div class="dish-attributes">
                    ${dishAnalysis.overall_rasa ? `
                        <div class="attribute-item">
                            <span class="attribute-label">Dominant Rasa:</span>
                            <span class="attribute-value">${dishAnalysis.overall_rasa}</span>
                        </div>
                    ` : ''}
                    
                    ${dishAnalysis.overall_virya ? `
                        <div class="attribute-item">
                            <span class="attribute-label">Overall Virya:</span>
                            <span class="attribute-value">${dishAnalysis.overall_virya}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${dishAnalysis.health_benefits ? `
                    <div class="benefits-section">
                        <h4>Health Benefits</h4>
                        <p class="benefits-text">${dishAnalysis.health_benefits}</p>
                    </div>
                ` : ''}
                
                ${dishAnalysis.suitability ? `
                    <div class="suitability-section">
                        <h4>Suitability & Recommendations</h4>
                        <p class="suitability-text">${dishAnalysis.suitability}</p>
                    </div>
                ` : ''}
                
                ${dishAnalysis.precautions ? `
                    <div class="precautions-section">
                        <h4>Precautions</h4>
                        <p class="precautions-text">${dishAnalysis.precautions}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    if (ingredientAnalysis.length > 0) {
        resultsHTML += `
            <div class="ingredient-analysis">
                <h3>Ayurvedic Analysis</h3>
                ${ingredientAnalysis.map(item => `
                    <div class="ingredient-item">
                        <div class="ingredient-header">${item.ingredient}</div>
                        
                        <div class="properties-grid">
                            <div class="property-group">
                                <div class="property-label">Rasa (Taste)</div>
                                <div class="property-value">${Array.isArray(item.rasa) ? item.rasa.join(', ') : (item.rasa || 'Not available')}</div>
                            </div>
                            
                            <div class="property-group">
                                <div class="property-label">Virya (Energy)</div>
                                <div class="property-value">${item.virya || 'Not available'}</div>
                            </div>
                            
                            <div class="property-group">
                                <div class="property-label">Vipaka (Post-digestive effect)</div>
                                <div class="property-value">${item.vipaka || 'Not available'}</div>
                            </div>
                        </div>
                        
                        <div class="dosha-effects">
                            <div class="dosha-effect vata">
                                <strong>Vata</strong><br>
                                ${item.dosha_effect?.vata || 'Not available'}
                            </div>
                            <div class="dosha-effect pitta">
                                <strong>Pitta</strong><br>
                                ${item.dosha_effect?.pitta || 'Not available'}
                            </div>
                            <div class="dosha-effect kapha">
                                <strong>Kapha</strong><br>
                                ${item.dosha_effect?.kapha || 'Not available'}
                            </div>
                        </div>
                        
                        ${item.recommendation ? `
                            <div class="recommendation">
                                <h5>Recommendation</h5>
                                <p>${item.recommendation}</p>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        resultsHTML += `
            <div class="no-analysis">
                <p>Detailed Ayurvedic analysis not available for this dish.</p>
                <p>The dish was identified as: <strong>${dish}</strong></p>
                ${ingredients.length > 0 ? `<p>Ingredients: ${ingredients.join(', ')}</p>` : ''}
            </div>
        `;
    }

    console.log('Setting innerHTML for resultsDiv');
    resultsDiv.innerHTML = resultsHTML;
    console.log('Successfully set results HTML');
}

// Update the DOMContentLoaded event listener to include food analysis initialization

// Add food analysis functions to global scope
window.initializeFoodAnalysis = initializeFoodAnalysis;
window.analyzeFood = analyzeFood;
window.clearImage = clearImage;