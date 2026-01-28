// 1. DATA OBJECT (The Content)
const allQuizzes = {
    "mech": {
        title: "Mechanical Reasoning",
        desc: "Gears, pulleys, and fluid hydraulics.",
        questions: [
            { 
                q: "A 5-inch gear is connected by a belt to a 10-inch gear. If the 5-inch gear spins at 100 RPM, how fast is the 10-inch gear spinning?", 
                a: ["200 RPM", "100 RPM", "50 RPM", "25 RPM"], 
                correct: 2,
                explanation: "Belt-driven systems follow an inverse ratio. The larger gear has twice the circumference, so it must spin at half the speed of the smaller gear."
            }
        ]
    },
    "situational": {
        title: "Situational Judgement",
        desc: "Ethics and station life scenarios.",
        questions: [
            { 
                q: "You find a coworker is visibly intoxicated while arriving for a night shift. What is the most safety-conscious action?", 
                a: ["Tell them to go home quietly", "Cover their duties yourself", "Immediately notify the officer in charge", "Wait until the first call to see if they can perform"], 
                correct: 2,
                explanation: "In fire services, life safety is paramount. An impaired crew member is a danger to themselves, the team, and the public."
            }
        ]
    }
},
"mathematics":{
    title: "Mathematics and Algebra",
    desc: "Simple math and equations.",
    questions: [
        {
            q: "If you have 1/4 of 0.5, how much do you have?",
            a: ["0.25", "1", "0.5", "2"],
            correct: 0,
            explanation: "Multiplying by 0.5 is equivalent to dividing by 2. (1/4)/2"
        }
        ]
    }
};

// 2. GLOBAL STATE (The Memory)
let currentQuizKey = "";
let currentQuestionIndex = 0;
let score = 0;
let userMistakes = []; 

// 3. INITIALIZATION (The Dashboard Builder)
function init() {
    const grid = document.getElementById('quiz-grid');
    if (!grid) return;
    
    grid.innerHTML = "";
    for (let key in allQuizzes) {
        const quiz = allQuizzes[key];
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.desc}</p>
            <button class="option-btn" style="text-align:center; margin-top:15px; border-color:var(--action-blue); color:var(--action-blue)">Enter Module</button>
        `;
        card.onclick = () => startQuiz(key);
        grid.appendChild(card);
    }
}

// 4. NAVIGATION LOGIC
function showSection(sectionId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('hidden');
}

// 5. QUIZ CORE LOGIC
function startQuiz(key) {
    currentQuizKey = key;
    currentQuestionIndex = 0;
    score = 0;
    userMistakes = []; // Reset mistakes for new attempt
    showSection('quiz-page');
    loadQuestion();
}

function loadQuestion() {
    const question = allQuizzes[currentQuizKey].questions[currentQuestionIndex];
    document.getElementById('q-num').innerText = currentQuestionIndex + 1;
    document.getElementById('question-text').innerText = question.q;
    document.getElementById('explanation-box').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    
    const container = document.getElementById('options-container');
    container.innerHTML = "";
    
    question.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(i, btn);
        container.appendChild(btn);
    });
}

function handleAnswer(index, btn) {
    const questionData = allQuizzes[currentQuizKey].questions[currentQuestionIndex];
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (index === questionData.correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        allBtns[questionData.correct].classList.add('correct');
        
        // LOG MISTAKE FOR REVIEW
        userMistakes.push({
            questionObj: questionData,
            userChoice: questionData.a[index],
            correctChoice: questionData.a[questionData.correct]
        });
    }
    
    document.getElementById('explanation-text').innerText = questionData.explanation;
    document.getElementById('explanation-box').classList.remove('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
}

// 6. COMPLETION & REVIEW LOGIC
document.getElementById('next-btn').onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < allQuizzes[currentQuizKey].questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
};

function endQuiz() {
    showSection('result-page');
    document.getElementById('final-score-num').innerText = score;
    
    const reviewBtn = document.getElementById('show-review-btn');
    const mistakeContainer = document.getElementById('mistake-review-container');
    
    // Hide review by default
    mistakeContainer.classList.add('hidden');

    if (userMistakes.length > 0) {
        reviewBtn.classList.remove('hidden');
        renderMistakes();
    } else {
        reviewBtn.classList.add('hidden');
    }
}

function renderMistakes() {
    const list = document.getElementById('mistakes-list');
    list.innerHTML = "";
    
    userMistakes.forEach((m) => {
        const card = document.createElement('div');
        card.className = 'mistake-card';
        card.innerHTML = `
            <div class="mistake-card-header">${m.questionObj.q}</div>
            <div class="mistake-body">
                <div class="comparison-box your-choice">
                    <span class="comparison-label">Your Answer</span>
                    ${m.userChoice}
                </div>
                <div class="comparison-box correct-choice">
                    <span class="comparison-label">Correct Answer</span>
                    ${m.correctChoice}
                </div>
                <div class="review-explanation">
                    <strong>Logic:</strong> ${m.questionObj.explanation}
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

document.getElementById('show-review-btn').onclick = function() {
    document.getElementById('mistake-review-container').classList.remove('hidden');
    this.classList.add('hidden');
};

// Launch the app
init();
