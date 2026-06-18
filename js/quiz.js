import { AppState } from './state.js';
import { predictDosha } from './api.js';

export function startDoshaQuiz() {
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

export function closeDoshaQuiz() {
    const modal = document.getElementById('dosha-quiz-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function displayQuizQuestion() {
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

export function selectQuizOption(optionIndex) {
    const quiz = AppState.doshaQuiz;
    const question = quiz.questions[quiz.currentQuestion];
    const selectedOption = question.options[optionIndex];

    // Store answer for the ML model
    quiz.answers.push({
        feature: question.feature,
        value: selectedOption.value
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

export async function showQuizResult() {
    // Show loading
    const resultDiv = document.getElementById('dosha-result');
    const descriptionDiv = document.getElementById('dosha-description');
    
    // Hide quiz content, show result
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');

    if (quizContent) quizContent.classList.add('hidden');
    if (quizResult) quizResult.classList.remove('hidden');

    if (resultDiv) {
        resultDiv.innerHTML = '<div style="text-align:center; padding: 20px;">Predicting Dosha with ML...</div>';
    }

    try {
        const payload = {};
        AppState.doshaQuiz.answers.forEach(ans => {
            payload[ans.feature] = ans.value;
        });

        const predictedDosha = await predictDosha(payload);

        const doshaInfo = {
            Pitta: {
                name: 'Pitta',
                color: '#e67e22',
                description: 'You have a Pitta constitution! Pitta types are focused, competitive, and goal-oriented. Favor cool, refreshing foods and avoid excessive heat.'
            },
            Kapha: {
                name: 'Kapha',
                color: '#27ae60',
                description: 'You have a Kapha constitution! Kapha types are calm, patient, and loyal. Choose light, warm foods and stay active to maintain balance.'
            },
            Vata: {
                name: 'Vata',
                color: '#8e44ad',
                description: 'You have a Vata constitution! Vata types are creative, energetic, and quick-thinking. Focus on warm, moist foods and maintain regular routines.'
            }
        };

        const info = doshaInfo[predictedDosha] || { name: predictedDosha, color: '#333', description: 'ML Predicted Dosha: ' + predictedDosha };

        const resultHTML = `
            <div class="dosha-scores">
                <h4>Your Predicted Constitution: ${info.name}</h4>
                <div class="score-breakdown" style="justify-content: center; align-items: center;">
                    <p style="text-align: center; color: ${info.color}; font-size: 2rem; font-weight: bold; margin: 20px 0;">
                        ${info.name}
                    </p>
                </div>
            </div>
        `;

        if (resultDiv) resultDiv.innerHTML = resultHTML;
        if (descriptionDiv) descriptionDiv.textContent = info.description;

    } catch (error) {
        if (resultDiv) resultDiv.innerHTML = `<p style="color: red; text-align: center;">Error predicting dosha: ${error.message}</p>`;
    }
}

export function restartQuiz() {
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');

    if (quizContent) quizContent.classList.remove('hidden');
    if (quizResult) quizResult.classList.add('hidden');

    startDoshaQuiz();
}

