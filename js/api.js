import { AppState } from './state.js';
import { showNotification } from './utils.js';

// API base for backend services (allows override via window.API_BASE)
export const API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : 'http://localhost:5000';

export async function generateDietPlanForPatient(patientId) {
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
export async function predictDosha(answersPayload) {
    try {
        const response = await fetch(`${API_BASE}/api/predict-dosha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answersPayload)
        });
        const data = await response.json();
        if (!response.ok || data.error) {
            throw new Error(data.error || 'Failed to predict Dosha');
        }
        return data.predicted_dosha;
    } catch (err) {
        console.error('Dosha prediction error:', err);
        throw err;
    }
}
