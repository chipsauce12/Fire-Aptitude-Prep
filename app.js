const allQuizzes = {
    "mech": {
        title: "Mechanical Aptitude",
        desc: "Gears, levers, and physics principles.",
        questions: [
            { 
                q: "If a large gear with 40 teeth drives a small gear with 10 teeth, how many times does the small gear rotate for every 1 rotation of the large gear?", 
                a: ["2 times", "4 times", "10 times", "0.25 times"], 
                correct: 1,
                explanation: "The gear ratio is calculated as Output/Input. 40 teeth / 10 teeth = 4. The smaller gear must spin faster to keep up with the larger one."
            }
        ]
    },
    "situational": {
        title: "Situational Judgement",
        desc: "Ethics, teamwork, and decision making.",
        questions: [
            { 
                q: "You notice a senior firefighter ignoring a safety protocol during a non-emergency equipment check. What is the most professional first step?", 
                a: ["Report them to the Chief immediately", "Ignore it to avoid conflict", "Speak to them privately about the concern", "Tell other crew members about the mistake"], 
                correct: 2,
                explanation: "Fire service culture values 'internal resolution.' Speaking privately shows respect while maintaining safety standards before escalating."
            }
        ]
    },
    "reading": {
        title: "Reading Comprehension",
        desc: "Interpreting SOPs and fire reports.",
        questions: [
            { 
                q: "SOP 104 states: 'All personnel must inspect SCBA cylinders at the start of shift. If pressure is below 90%, it must be replaced.' A cylinder at 4000 PSI (Max 4500) is found. What should you do?", 
                a: ["Replace it", "Leave it as is", "Wait until next shift", "Report it as broken"], 
                correct: 1,
                explanation: "4000 is approximately 89% of 4500. Wait—math check: 90% of 4500 is 4050. Since 4000 is below 4050, it must be replaced according to the rule."
            }
        ]
    }
};

let currentQuizKey = "";
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 0;

function init() {
    const grid = document.getElementById('quiz-grid');
    grid.innerHTML = "";
    for (let key in allQuizzes) {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <h3>${allQuizzes[key].title}</h3>
            <p>${allQuizzes[key].desc}</p>
            <button class="nav-btn">Start Test</button>
        `;
        card.onclick = () => startQuiz(key);
        grid.appendChild(card);
    }
}

function startQuiz(key) {
    currentQuizKey = key;
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 600; // 10 minutes
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    document.getElementById('result-page').classList.add('hidden');
    startTimer();
    loadQuestion();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        document.getElementById('time-display').innerText = `${mins}:${secs < 10 ? '0'+secs : secs}`;
        if (timeLeft <= 0) endQuiz();
    }, 1000);
}

function loadQuestion() {
    const question = allQuizzes[currentQuizKey].questions[currentQuestionIndex];
    document.getElementById('quiz-title').innerText = allQuizzes[currentQuizKey].title;
    document.getElementById('question-text').innerText = question.q;
    document.getElementById('current-score').innerText = score;
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
    const correct = questionData.correct;
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (index === correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        allBtns[correct].classList.add('correct');
    }
    
    document.getElementById('explanation-text').innerText = questionData.explanation;
    document.getElementById('explanation-box').classList.remove('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
    document.getElementById('current-score').innerText = score;
}

document.getElementById('next-btn').onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < allQuizzes[currentQuizKey].questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
};

function endQuiz() {
    clearInterval(timer);
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
    document.getElementById('final-result-text').innerText = `Final Score: ${score} / ${allQuizzes[currentQuizKey].questions.length}`;
}

document.getElementById('retry-btn').onclick = () => startQuiz(currentQuizKey);

init();