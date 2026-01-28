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
                explanation: "In fire services, life safety is paramount. An impaired crew member is a danger to themselves, the team, and the public. Chain of command must be notified immediately."
            }
        ]
    }
};

let currentQuizKey = "";
let currentQuestionIndex = 0;
let score = 0;

function init() {
    const grid = document.getElementById('quiz-grid');
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

function showSection(sectionId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function startQuiz(key) {
    currentQuizKey = key;
    currentQuestionIndex = 0;
    score = 0;
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
    }
    
    document.getElementById('explanation-text').innerText = questionData.explanation;
    document.getElementById('explanation-box').classList.remove('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
}

document.getElementById('next-btn').onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < allQuizzes[currentQuizKey].questions.length) {
        loadQuestion();
    } else {
        showSection('result-page');
        document.getElementById('final-result-text').innerText = `Module Score: ${score} / ${allQuizzes[currentQuizKey].questions.length}`;
    }
};

init();
