import { AppState } from './state.js';
import { showNotification, showLoading, hideLoading, clearAllErrors, showError, validateEmail, validatePhone, generatePatientId } from './utils.js';
import { generateDietPlanForPatient } from './api.js';

export function viewPatientDetails(patientId) {
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

export function closePatientDetailsModal() {
    const modal = document.getElementById('patient-details-modal');
    if (modal) modal.remove();
}

export function showDietPlanModal(patientId) {
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

export function closeDietPlanModal() {
    const modal = document.getElementById('diet-plan-modal');
    if (modal) modal.remove();
}

export function downloadDietPlanPdf(patientId) {
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

export function loadPatients() {
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

export function createPatientElement(patient) {
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

export function showAddPatientModal() {
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

export function closeAddPatientModal() {
    const modal = document.getElementById('add-patient-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function handleAddPatient(event) {
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

export function validatePatientData(data) {
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

export function editPatient(patientId) {
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

export function handleEditPatient(event, patientId) {
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

export function deletePatient(patientId) {
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

export function searchPatients(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPatients = AppState.patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.contact.toLowerCase().includes(searchTerm) ||
        patient.patientId.toLowerCase().includes(searchTerm)
    );
    displayFilteredPatients(filteredPatients);
}

export function filterByDosha(event) {
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

export function displayFilteredPatients(patients) {
    const patientsList = document.getElementById('patients-list');
    if (!patientsList) return;

    patientsList.innerHTML = '';
    patients.forEach(patient => {
        const patientElement = createPatientElement(patient);
        patientsList.appendChild(patientElement);
    });
}

