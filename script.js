const startButton = document.getElementById("startButton");
const startScreen = document.querySelector(".start-screen");
const quizScreen = document.querySelector(".quiz-screen");
const resultScreen = document.querySelector(".result-screen");
const houseResult = document.getElementById("houseResult");
const houseIcon = document.getElementById("houseIcon");

const questions = [
  {
    question: "Saat menghadapi masalah kamu akan...",
    options: [
      { text: "Menghadapi langsung", house: "Gryffindor" },
      { text: "Meminta bantuan orang lain", house: "Hufflepuff" },
      { text: "Menganalisis terlebih dahulu", house: "Ravenclaw" },
      { text: "Mencari cara paling menguntungkan", house: "Slytherin" }
    ]
  },
  {
    question: "Apa sifatmu yang paling dominan?",
    options: [
      { text: "Berani", house: "Gryffindor" },
      { text: "Setia", house: "Hufflepuff" },
      { text: "Cerdas", house: "Ravenclaw" },
      { text: "Ambisious", house: "Slytherin" }
    ]
  },
  {
    question: "Kamu ingin dikenang sebagai...",
    options: [
      { text: "Pahlawan", house: "Gryffindor" },
      { text: "Teman Setia", house: "Hufflepuff" },
      { text: "Orang Pintar", house: "Ravenclaw" },
      { text: "Penguasa", house: "Slytherin" }
    ]
  }
];

const colors = {
  "Gryffindor": "#740001",
  "Hufflepuff": "#FFD800",
  "Ravenclaw": "#0E1A40",
  "Slytherin": "#1A472A"
};

const icons = {
  "Gryffindor": "https://i.ibb.co/z5VDfK6/gryffindor.png",
  "Hufflepuff": "https://i.ibb.co/7rQQ6cK/hufflepuff.png",
  "Ravenclaw": "https://i.ibb.co/MKQ1sBc/ravenclaw.png",
  "Slytherin": "https://i.ibb.co/JTg55gN/slytherin.png"
};

let scores = { Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 };
let currentQuestion = 0;

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  showQuestion();
});

function showQuestion() {
  const q = questions[currentQuestion];
  // Gunakan backticks (`) untuk membungkus HTML string ini
  quizScreen.innerHTML = `<h2>${q.question}</h2>` +
    q.options.map(opt => `<button onclick="selectOption('${opt.house}')">${opt.text}</button>`).join('');
}

// Tambahkan window. agar fungsi terbaca oleh tombol yang dibuat dinamis
window.selectOption = function(house) {
  scores[house]++;
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  quizScreen.style.display = "none";
  resultScreen.style.display = "block";
  const sortedHouse = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
  
  // Gunakan backticks (`) agar variabel terdeteksi
  houseResult.textContent = `You belong to ${sortedHouse}!`;
  houseResult.style.color = colors[sortedHouse];
  houseIcon.src = icons[sortedHouse];
  houseIcon.alt = sortedHouse;
}
