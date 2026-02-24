const TOPICS = {
  "🌍 Geography": [
    { q: "What is the capital of Japan?", a: "Tokyo" },
    { q: "Which is the longest river in the world?", a: "The Nile River" },
    { q: "On which continent is the Sahara Desert?", a: "Africa" },
    { q: "What country has the most natural lakes?", a: "Canada" },
    { q: "Which ocean is the largest?", a: "The Pacific Ocean" },
    { q: "What is the capital of Australia?", a: "Canberra" },
    { q: "Which mountain is the tallest in the world?", a: "Mount Everest" },
    { q: "What is the smallest country in the world?", a: "Vatican City" },
    { q: "Which city is called the City of Light?", a: "Paris, France" },
    { q: "What is the capital of Brazil?", a: "Brasília" },
    { q: "Which desert is the coldest in the world?", a: "The Antarctic Desert" },
    { q: "What strait separates Europe from Africa?", a: "Strait of Gibraltar" },
    { q: "Which is the deepest lake in the world?", a: "Lake Baikal, Russia" },
    { q: "What is the largest country by land area?", a: "Russia" },
    { q: "Where is the Amazon Rainforest primarily located?", a: "Brazil" },
    { q: "What is the capital of Canada?", a: "Ottawa" },
    { q: "Which sea has the highest salt concentration?", a: "The Dead Sea" },
    { q: "What is the largest country in South America?", a: "Brazil" },
    { q: "Which country has the most active volcanoes?", a: "Indonesia" },
    { q: "What is the capital of South Africa?", a: "Pretoria (executive)" }
  ],
  "🔬 Science": [
    { q: "What is the chemical symbol for water?", a: "H₂O" },
    { q: "How many bones are in the adult human body?", a: "206 bones" },
    { q: "What planet is closest to the Sun?", a: "Mercury" },
    { q: "Approximately how fast does light travel?", a: "300,000 km/s" },
    { q: "What gas do plants absorb for photosynthesis?", a: "Carbon dioxide (CO₂)" },
    { q: "What is the powerhouse of the cell?", a: "Mitochondria" },
    { q: "What is the most abundant gas in Earth's atmosphere?", a: "Nitrogen (~78%)" },
    { q: "What keeps planets in orbit around the Sun?", a: "Gravity" },
    { q: "What is the atomic number of carbon?", a: "6" },
    { q: "What full name does DNA stand for?", a: "Deoxyribonucleic Acid" },
    { q: "What is water's boiling point at sea level?", a: "100°C / 212°F" },
    { q: "How many chromosomes do humans have?", a: "46 (23 pairs)" },
    { q: "What does Newton's first law state?", a: "An object at rest stays at rest unless a force acts on it" },
    { q: "What organ produces insulin?", a: "The pancreas" },
    { q: "What is the chemical formula for table salt?", a: "NaCl" },
    { q: "What is the half-life of Carbon-14?", a: "~5,730 years" },
    { q: "What is the unit of electrical resistance?", a: "Ohm (Ω)" },
    { q: "What element has the symbol 'Au'?", a: "Gold" },
    { q: "What phenomenon causes light to bend through a prism?", a: "Refraction" },
    { q: "What type of wave is light?", a: "Electromagnetic wave" }
  ],
  "📜 History": [
    { q: "In what year did World War II end?", a: "1945" },
    { q: "Who was the first US President?", a: "George Washington" },
    { q: "What year did the French Revolution begin?", a: "1789" },
    { q: "Which empire was ruled by Genghis Khan?", a: "The Mongol Empire" },
    { q: "In what year did humans first land on the Moon?", a: "1969" },
    { q: "What ancient wonder was in Alexandria, Egypt?", a: "The Lighthouse of Alexandria" },
    { q: "What ship sank in April 1912?", a: "RMS Titanic" },
    { q: "Which Egyptian queen allied with Julius Caesar?", a: "Cleopatra" },
    { q: "What year did the Berlin Wall fall?", a: "1989" },
    { q: "Who wrote the Declaration of Independence?", a: "Thomas Jefferson (primary author)" },
    { q: "Which was the first country to grant women the vote?", a: "New Zealand (1893)" },
    { q: "What was the first artificial satellite launched into space?", a: "Sputnik 1 (1957)" },
    { q: "What ancient city was buried by Mount Vesuvius?", a: "Pompeii" },
    { q: "What year did Christopher Columbus reach the Americas?", a: "1492" },
    { q: "Who was Napoleon Bonaparte?", a: "French emperor and military leader" },
    { q: "When did the Roman Empire fall in the West?", a: "476 AD" },
    { q: "What was the first programmable digital computer called?", a: "ENIAC (1945)" },
    { q: "Which war was fought between 1914 and 1918?", a: "World War I" },
    { q: "Who was the longest-reigning British monarch?", a: "Queen Elizabeth II (70 years)" },
    { q: "What country did the Industrial Revolution begin in?", a: "Great Britain" }
  ],
  "➗ Math": [
    { q: "What is π (pi) to 4 decimal places?", a: "3.1416" },
    { q: "What is 12 × 13?", a: "156" },
    { q: "What is the square root of 144?", a: "12" },
    { q: "What is a prime number?", a: "A number divisible only by 1 and itself" },
    { q: "What is 15% of 200?", a: "30" },
    { q: "What is the formula for the area of a circle?", a: "πr²" },
    { q: "What is 2 to the power of 10?", a: "1,024" },
    { q: "State the Pythagorean theorem.", a: "a² + b² = c² (for right triangles)" },
    { q: "What is the sum of angles in a triangle?", a: "180 degrees" },
    { q: "What is 5! (factorial of 5)?", a: "120" },
    { q: "What is the derivative of x²?", a: "2x" },
    { q: "What is 0.75 as a fraction?", a: "3/4" },
    { q: "How many degrees are in a full circle?", a: "360 degrees" },
    { q: "What is the perimeter formula for a rectangle?", a: "2(l + w)" },
    { q: "What is the sum of integers 1 through 100?", a: "5,050" },
    { q: "What is the cube root of 27?", a: "3" },
    { q: "What is a right angle in degrees?", a: "90 degrees" },
    { q: "What is the LCM of 4 and 6?", a: "12" },
    { q: "What is the Fibonacci sequence's 10th number?", a: "55" },
    { q: "Which number is neither positive nor negative?", a: "Zero (0)" }
  ],
  "🎨 Arts": [
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci" },
    { q: "Who wrote Romeo and Juliet?", a: "William Shakespeare" },
    { q: "What art movement is Salvador Dalí known for?", a: "Surrealism" },
    { q: "Who composed the Fifth Symphony?", a: "Ludwig van Beethoven" },
    { q: "Who sculpted the famous 'David'?", a: "Michelangelo" },
    { q: "What is a sonnet?", a: "A 14-line poem with a set rhyme scheme" },
    { q: "Who painted 'The Starry Night'?", a: "Vincent van Gogh" },
    { q: "Which art movement did Picasso co-found?", a: "Cubism" },
    { q: "What are the three primary colors?", a: "Red, blue, and yellow" },
    { q: "Who wrote 'Pride and Prejudice'?", a: "Jane Austen" },
    { q: "What is the art of paper folding called?", a: "Origami" },
    { q: "Which country is famous for Kabuki theater?", a: "Japan" },
    { q: "Who composed 'The Four Seasons'?", a: "Antonio Vivaldi" },
    { q: "What technique creates images from dots of color?", a: "Pointillism" },
    { q: "Who painted the Sistine Chapel ceiling?", a: "Michelangelo" },
    { q: "What literary device compares using 'like' or 'as'?", a: "A simile" },
    { q: "Which novel features Atticus Finch?", a: "To Kill a Mockingbird" },
    { q: "What is a musical work for solo and orchestra called?", a: "A concerto" },
    { q: "What is the world's largest art museum?", a: "The Louvre, Paris" },
    { q: "What is the term for the overall color scheme of a painting?", a: "Color palette" }
  ],
  "💻 Tech": [
    { q: "What does HTML stand for?", a: "HyperText Markup Language" },
    { q: "Who co-founded Apple Inc.?", a: "Steve Jobs, Steve Wozniak & Ronald Wayne" },
    { q: "What does CPU stand for?", a: "Central Processing Unit" },
    { q: "What language primarily styles web pages?", a: "CSS (Cascading Style Sheets)" },
    { q: "What does AI stand for?", a: "Artificial Intelligence" },
    { q: "What does URL stand for?", a: "Uniform Resource Locator" },
    { q: "What is the binary for decimal 10?", a: "1010" },
    { q: "What does RAM stand for?", a: "Random Access Memory" },
    { q: "What is an algorithm?", a: "A step-by-step procedure for solving a problem" },
    { q: "Who invented the World Wide Web?", a: "Tim Berners-Lee" },
    { q: "What does API stand for?", a: "Application Programming Interface" },
    { q: "What is open-source software?", a: "Software with freely available, modifiable source code" },
    { q: "What is machine learning?", a: "AI systems that improve through data, not explicit programming" },
    { q: "What does SSD stand for?", a: "Solid-State Drive" },
    { q: "What programming paradigm does Java use?", a: "Object-Oriented Programming (OOP)" },
    { q: "What is a blockchain?", a: "A distributed, immutable ledger of records" },
    { q: "What does HTTP stand for?", a: "HyperText Transfer Protocol" },
    { q: "What is 'the cloud' in computing?", a: "Internet-based storage and computing services" },
    { q: "What is a compiler?", a: "A program that translates source code into machine code" },
    { q: "What does SQL stand for?", a: "Structured Query Language" }
  ]
};

// State
let selectedTopic = null;
let selectedCount = 10;
let sessionCards = [];
let currentIndex = 0;
let correct = 0;
let wrong = 0;
let isFlipped = false;

// Init
function init() {
  renderTopics();

  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCount = parseInt(btn.dataset.count);
    });
  });

  document.getElementById('startBtn').addEventListener('click', startSession);
  document.getElementById('flashcardScene').addEventListener('click', flipCard);
  document.getElementById('btnCorrect').addEventListener('click', () => answer(true));
  document.getElementById('btnWrong').addEventListener('click', () => answer(false));
  document.getElementById('btnRetry').addEventListener('click', retrySession);
  document.getElementById('btnHome').addEventListener('click', goHome);
}

function renderTopics() {
  const grid = document.getElementById('topicGrid');
  Object.keys(TOPICS).forEach(key => {
    const [emoji, ...rest] = key.split(' ');
    const name = rest.join(' ');
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.innerHTML = `<span class="topic-emoji">${emoji}</span><span class="topic-name">${name}</span>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedTopic = key;
      document.getElementById('startBtn').disabled = false;
    });
    grid.appendChild(card);
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSession() {
  sessionCards = shuffle(TOPICS[selectedTopic]).slice(0, Math.min(selectedCount, TOPICS[selectedTopic].length));
  currentIndex = 0; correct = 0; wrong = 0;
  document.getElementById('cardTotal').textContent = sessionCards.length;
  showScreen('quizScreen');
  loadCard();
}

function loadCard() {
  isFlipped = false;
  const card = sessionCards[currentIndex];
  document.getElementById('cardQuestion').textContent = card.q;
  document.getElementById('cardAnswer').textContent = card.a;
  document.getElementById('cardNum').textContent = currentIndex + 1;
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('wrongCount').textContent = wrong;
  document.getElementById('flashcard').classList.remove('flipped');
  document.getElementById('actionRow').classList.remove('visible');
  document.getElementById('flipHint').style.display = '';
  document.getElementById('progressFill').style.width = (currentIndex / sessionCards.length * 100) + '%';
}

function flipCard() {
  if (isFlipped) return;
  isFlipped = true;
  document.getElementById('flashcard').classList.add('flipped');
  document.getElementById('flipHint').style.display = 'none';
  document.getElementById('actionRow').classList.add('visible');
}

function answer(isCorrect) {
  if (isCorrect) correct++; else wrong++;
  currentIndex++;
  if (currentIndex >= sessionCards.length) showResults();
  else loadCard();
}

function showResults() {
  showScreen('resultsScreen');
  const total = sessionCards.length;
  const pct = Math.round((correct / total) * 100);

  document.getElementById('resultNum').textContent = correct;
  document.getElementById('resultDenom').textContent = '/ ' + total;
  document.getElementById('breakCorrect').textContent = correct;
  document.getElementById('breakWrong').textContent = wrong;
  document.getElementById('breakPct').textContent = pct + '%';
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('resultsCircle').style.setProperty('--pct', pct + '%');

  const msgs = [
    [100, "Perfect Score! 🎉", "Flawless — you nailed every single card!"],
    [80,  "Excellent Work! 🌟", "You're mastering this topic fast!"],
    [60,  "Good Progress! 👍", "A bit more practice and you'll ace it."],
    [40,  "Keep Going! 💪", "Review the missed cards and give it another shot."],
    [0,   "Don't Give Up! 📚", "Revisiting is how real learning happens."]
  ];
  const [, title, msg] = msgs.find(([threshold]) => pct >= threshold);
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMsg').textContent = msg;
}

function retrySession() { startSession(); }

function goHome() {
  selectedTopic = null;
  document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('startBtn').disabled = true;
  showScreen('setupScreen');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.classList.add('active');
  void el.offsetWidth;
  el.style.animation = '';
}

init();