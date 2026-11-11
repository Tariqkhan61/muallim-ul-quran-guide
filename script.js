// ===== Quiz Logic =====

let currentScore = 0;
let answeredCount = 0;
const totalQuestions = quizQuestions.length;

// Elements
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const scoreText = document.getElementById('score-text');
const restartBtn = document.getElementById('restart-btn');

// Quiz render karna
function renderQuiz() {
  quizContainer.innerHTML = '';
  currentScore = 0;
  answeredCount = 0;
  resultContainer.classList.add('hidden');

  quizQuestions.forEach((q, qIndex) => {
    const block = document.createElement('div');
    block.className = 'question-block';

    // Sawal
    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    questionText.textContent = `${qIndex + 1}. ${q.question}`;
    block.appendChild(questionText);

    // Options
    q.options.forEach((option, oIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = option;
      btn.dataset.qIndex = qIndex;
      btn.dataset.oIndex = oIndex;
      btn.addEventListener('click', () => handleAnswer(btn, qIndex, oIndex));
      block.appendChild(btn);
    });

    quizContainer.appendChild(block);
  });
}

// Jawab check karna
function handleAnswer(btn, qIndex, oIndex) {
  const block = btn.closest('.question-block');

  // Agar pehle se jawab diya gaya hai toh kuch na karein
  if (block.dataset.answered === 'true') return;
  block.dataset.answered = 'true';

  const correctIndex = quizQuestions[qIndex].answer;
  const allOptions = block.querySelectorAll('.option');

  // Sahi jawab highlight karein
  allOptions[correctIndex].classList.add('correct');

  if (oIndex === correctIndex) {
    currentScore++;
  } else {
    btn.classList.add('wrong');
  }

  answeredCount++;

  // Jab saare sawal ho jayein toh result dikhayein
  if (answeredCount === totalQuestions) {
    showResult();
  }
}

// Result dikhana
function showResult() {
  resultContainer.classList.remove('hidden');
  const percentage = Math.round((currentScore / totalQuestions) * 100);

  let message = '';
  if (percentage >= 80) message = 'MashaAllah! Zabardast!';
  else if (percentage >= 50) message = 'Acha kiya! Thori aur mehnat karein.';
  else message = 'Koi baat nahi, dobara koshish karein.';

  scoreText.textContent = `${message} Aapka score: ${currentScore} / ${totalQuestions} (${percentage}%)`;
}

// Restart button
restartBtn.addEventListener('click', renderQuiz);

// Shuru karein
renderQuiz();
// ===== Progress Tracker (Best Score Save Karna) =====

// 1. Jab page load ho, toh purana best score dikhayein
document.addEventListener("DOMContentLoaded", () => {
  const bestScoreDisplay = document.getElementById('best-score-display');
  if (bestScoreDisplay) {
    const savedScore = localStorage.getItem('muallim_quiz_best_score');
    if (savedScore !== null) {
      bestScoreDisplay.innerHTML = `🏆 Aapka pichla best score: <strong>${savedScore} / ${totalQuestions}</strong>`;
    } else {
      bestScoreDisplay.innerHTML = `✨ Yeh aapki pehli koshish hai. Best of Luck!`;
    }
  }
});

// 2. Quiz khatam hone par naya score save karein
// (Humne showResult function ko update karna hai)
const originalShowResult = showResult; // Purana function save kiya
showResult = function() {
  originalShowResult(); // Purana function chalaya (jo result screen dikhata hai)
  
  // Ab naya score save karein
  const savedScore = localStorage.getItem('muallim_quiz_best_score');
  const currentScoreNum = currentScore;
  
  if (savedScore === null || currentScoreNum > parseInt(savedScore)) {
    localStorage.setItem('muallim_quiz_best_score', currentScoreNum);
    // Agar naya record bana hai toh message update karein
    if(document.getElementById('best-score-display')) {
      document.getElementById('best-score-display').innerHTML = `🎉 Mubarak ho! Yeh aapka naya Best Score hai: <strong>${currentScoreNum} / ${totalQuestions}</strong>`;
    }
  }
};