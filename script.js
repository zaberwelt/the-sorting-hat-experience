const questions = [
    { q: "Malam hari di Hogwarts, kau melihat temanmu dalam bahaya. Apa yang kau lakukan?", a: [{t:"Menerjang langsung untuk menolong", h:"G"}, {t:"Mencari guru atau bantuan", h:"H"}, {t:"Menyusun strategi penyelamatan", h:"R"}, {t:"Memastikan diriku aman dulu", h:"S"}] },
    { q: "Kualitas apa yang paling kau hargai?", a: [{t:"Keberanian & Tekad", h:"G"}, {t:"Kesetiaan & Kerja Keras", h:"H"}, {t:"Kecerdasan & Kebijaksanaan", h:"R"}, {t:"Ambisi & Kecerdikan", h:"S"}] },
    { q: "Pilih hewan peliharaan ajaibmu:", a: [{t:"Burung Hantu (Bijak)", h:"R"}, {t:"Kucing (Lincah)", h:"G"}, {t:"Tikus (Cerdik)", h:"S"}, {t:"Kodok (Setia)", h:"H"}] },
    { q: "Apa yang paling ingin kau pelajari?", a: [{t:"Mantra Pertahanan Diri", h:"G"}, {t:"Ilmu Ramuan Rahasia", h:"S"}, {t:"Sejarah Sihir Kuno", h:"R"}, {t:"Pemeliharaan Satwa Gaib", h:"H"}] },
    { q: "Cermin Tarsah memperlihatkan keinginan terdalammu. Apa itu?", a: [{t:"Menjadi pahlawan hebat", h:"G"}, {t:"Dikelilingi sahabat setia", h:"H"}, {t:"Mengetahui segala rahasia dunia", h:"R"}, {t:"Memegang kekuasaan besar", h:"S"}] }
];

const houses = {
    G: { name: "Gryffindor", color: "#ae0001", img: "https://www.pngall.com/wp-content/uploads/11/Gryffindor-Logo-PNG-Image.png", desc: "Tempat bagi mereka yang berani, ksatria, dan memiliki tekad membara. Gryffindor menyambut jiwa pemberanimu!", attrs: [{n:"Berani", i:"shield"}, {n:"Ksatria", i:"swords"}, {n:"Tekad", i:"flame"}] },
    S: { name: "Slytherin", color: "#2a623d", img: "https://www.pngall.com/wp-content/uploads/11/Slytherin-Logo-PNG-Image.png", desc: "Rumah bagi para pemimpin besar yang ambisius, cerdik, dan selalu memiliki cara untuk mencapai puncak.", attrs: [{n:"Ambisi", i:"crown"}, {n:"Cerdik", i:"zap"}, {n:"Bangga", i:"gem"}] },
    R: { name: "Ravenclaw", color: "#222f5b", img: "https://www.pngall.com/wp-content/uploads/11/Ravenclaw-Logo-PNG-Image.png", desc: "Pikiran yang tajam dan kreativitas tak terbatas. Di Ravenclaw, pengetahuan adalah kekuatan terbesarmu.", attrs: [{n:"Bijak", i:"book-open"}, {n:"Cerdas", i:"brain"}, {n:"Kreatif", i:"palette"}] },
    H: { name: "Hufflepuff", color: "#ecb939", img: "https://www.pngall.com/wp-content/uploads/11/Hufflepuff-Logo-PNG-Image.png", desc: "Kesetiaan, kejujuran, dan kerja keras adalah fondasimu. Hufflepuff adalah keluarga yang akan selalu ada untukmu.", attrs: [{n:"Setia", i:"heart"}, {n:"Sabar", i:"hourglass"}, {n:"Jujur", i:"check-circle"}] }
};

let current = 0;
let scores = { G:0, S:0, R:0, H:0 };

function startQuiz() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    showQ();
}

function showQ() {
    const q = questions[current];
    document.getElementById('question-text').innerText = q.q;
    const opt = document.getElementById('options-container');
    opt.innerHTML = '';
    q.a.forEach(a => {
        const b = document.createElement('button');
        b.className = 'btn-option';
        b.innerText = a.t;
        b.onclick = () => { scores[a.h]++; current++; if(current < 5) showQ(); else showResult(); };
        opt.appendChild(b);
    });
}

function showResult() {
    document.getElementById('quiz-screen').classList.add('hidden');
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const h = houses[winner];

    const nameTag = document.getElementById('house-name');
    nameTag.innerText = h.name.toUpperCase();
    nameTag.style.color = h.color;
    nameTag.style.textShadow = `0 0 30px ${h.color}`;

    document.getElementById('house-img').src = h.img;
    document.getElementById('house-desc').innerText = h.desc;

    const list = document.getElementById('attr-list');
    list.innerHTML = '';
    h.attrs.forEach(at => {
        list.innerHTML += `<div class="attr-pill"><i data-lucide="${at.i}"></i><span>${at.n}</span></div>`;
    });

    lucide.createIcons();
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('fade-in');
}

// Bintang Parallaks
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    stars = [];
    for(let i=0; i<200; i++) {
        stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*1.5, d: Math.random()*0.4+0.1, a: Math.random() });
    }
}
function drawStars() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI*2); ctx.fill();
        s.y += s.speed || s.d; if(s.y > canvas.height) s.y = 0;
    });
    requestAnimationFrame(drawStars);
}
window.addEventListener('resize', initStars);
initStars(); drawStars();
