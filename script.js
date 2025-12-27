// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Inline SVG art (stylistic)
  const hatSVG = `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%23a66b2a'/><stop offset='1' stop-color='%23422a18'/></linearGradient></defs><g transform='translate(0,10)'><ellipse cx='256' cy='400' rx='220' ry='40' fill='%23000000' opacity='0.35'/><path d='M94,280 C86,160 160,90 256,90 C352,90 426,160 418,280 C340,320 172,320 94,280 Z' fill='url(%23g)' stroke='%230b0602' stroke-width='6' /><path d='M150,230 C170,200 220,170 256,170 C292,170 342,200 362,230' fill='none' stroke='%23e3c08d' stroke-width='6' stroke-opacity='0.12'/></g></svg>`;

  const houseArts = {
    G: { name:'Gryffindor', color:'#b71c1c', img:`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g transform='translate(20,12)'><polygon points='60,0 90,30 60,60 30,30' fill='%23b71c1c' stroke='%23ffe082' stroke-width='3'/></g></svg>`},
    S: { name:'Slytherin', color:'#0f5e37', img:`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g transform='translate(20,12)'><path d='M20,30 C60,0 120,0 160,30 C140,70 120,100 110,120 C80,110 50,110 20,120 Z' fill='%230f5e37' stroke='%23c6f6e0' stroke-width='3'/></g></svg>`},
    R: { name:'Ravenclaw', color:'#1e3250', img:`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g transform='translate(18,12)'><rect x='10' y='10' width='120' height='120' rx='12' fill='%231e3250' stroke='%23cfe7ff' stroke-width='3'/></g></svg>`},
    H: { name:'Hufflepuff', color:'#e6b800', img:`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g transform='translate(18,12)'><circle cx='70' cy='70' r='50' fill='%23e6b800' stroke='%230f0f0f' stroke-width='3'/></g></svg>`}
  };

  const questions = [
    { q: "Mana yang paling kamu hargai dalam dirimu?", a:[{t:"Keberanian", h:"G"},{t:"Ambisi", h:"S"},{t:"Kecerdasan", h:"R"},{t:"Kesetiaan", h:"H"}]},
    { q: "Jika melihat ketidakadilan, kamu akan...", a:[{t:"Melawan langsung", h:"G"},{t:"Mencari cara untuk mengendalikan situasi", h:"S"},{t:"Menyusun rencana bijak", h:"R"},{t:"Membantu yang dirugikan", h:"H"}]},
    { q: "Apa yang paling kamu inginkan dari orang lain?", a:[{t:"Kepercayaan", h:"H"},{t:"Pengakuan", h:"G"},{t:"Rasa hormat", h:"S"},{t:"Kekaguman atas kepintaranmu", h:"R"}]},
    { q: "Pilih artefak yang paling menarik:", a:[{t:"Pedang cahaya", h:"G"},{t:"Cincin bertuah", h:"S"},{t:"Buku kuno", h:"R"},{t:"Piala persahabatan", h:"H"}]},
    { q: "Bagaimana kamu ingin dikenang?", a:[{t:"Sebagai pahlawan", h:"G"},{t:"Sebagai pemimpin yang licik", h:"S"},{t:"Sebagai orang bijak", h:"R"},{t:"Sebagai teman setia", h:"H"}]}
  ];

  const houseAttrs = {
    G: [{n:"Berani"},{n:"Impulsif"},{n:"Berjiwa petualang"}],
    S: [{n:"Ambisius"},{n:"Visioner"},{n:"Cerdik"}],
    R: [{n:"Logis"},{n:"Intelektual"},{n:"Pena tajam"}],
    H: [{n:"Setia"},{n:"Ramah"},{n:"Tangguh"}]
  };

  // Elements
  const hatImg = document.getElementById('hat-art');
  const startBtn = document.getElementById('start-btn');
  const startArea = document.getElementById('start-area');
  const alreadyEl = document.getElementById('already');
  const doneBadge = document.getElementById('done-badge');
  const quizArea = document.getElementById('quiz-area');
  const qText = document.getElementById('question-text');
  const optsEl = document.getElementById('options');
  const resultEl = document.getElementById('result');
  const houseArtEl = document.getElementById('house-art');
  const houseNameEl = document.getElementById('house-name');
  const descImgEl = document.getElementById('desc-img');
  const descTextEl = document.getElementById('desc-text');
  const attrsEl = document.getElementById('attrs');

  hatImg.src = hatSVG;

  // state
  let index = 0;
  let scores = {G:0,S:0,R:0,H:0};

  // check storage
  const stored = localStorage.getItem('sortingHatResult');
  if (stored) {
    startArea.classList.add('locked');
    startBtn.style.display = 'none';
    alreadyEl.style.display = 'block';
    const parsed = JSON.parse(stored);
    doneBadge.innerText = `Sudah ditempatkan di ${parsed.name}`;
    setTimeout(()=> showResult(parsed.key, false), 500);
  } else {
    startBtn.addEventListener('click', begin);
  }

  function begin(){
    startBtn.disabled = true;
    startArea.style.display = 'none';
    quizArea.style.display = 'block';
    renderQuestion();
  }

  function renderQuestion(){
    const q = questions[index];
    qText.innerText = `(${index+1}/${questions.length})  ${q.q}`;
    optsEl.innerHTML = '';
    q.a.forEach(o=>{
      const b = document.createElement('button');
      b.className = 'opt';
      b.type = 'button';
      b.innerHTML = `<span class="label">${o.t}</span>`;
      b.addEventListener('click', ()=> {
        scores[o.h] += 1;
        index++;
        if (index < questions.length) {
          renderQuestion();
        } else {
          finalize();
        }
      });
      optsEl.appendChild(b);
    });
  }

  function finalize(){
    // compute winner (tie handled)
    const entries = Object.entries(scores);
    const max = Math.max(...entries.map(e=>e[1]));
    const top = entries.filter(e=>e[1] === max).map(e=>e[0]);
    const winner = top[Math.floor(Math.random() * top.length)];
    const resultObj = {key: winner, name: houseArts[winner].name, time: new Date().toISOString()};
    try { localStorage.setItem('sortingHatResult', JSON.stringify(resultObj)); } catch(e){}
    quizArea.style.display = 'none';
    showResult(winner, true);
  }

  function showResult(key, confetti){
    const house = houseArts[key];
    // set art src (safe)
    houseArtEl.src = house.img;
    houseNameEl.innerText = house.name;
    houseNameEl.style.color = house.color;
    houseNameEl.style.textShadow = `0 0 18px ${house.color}`;

    // put SVG markup into img container for desc image (use proper img tag)
    descImgEl.innerHTML = `<img src="${house.img}" alt="${house.name} art" style="width:100%;height:auto;display:block" />`;
    const descs = {
      G: "Keberanianmu mendefinisikanmu. Kamu siap mempertaruhkan segalanya demi kebenaran.",
      S: "Ambisi dan ketegasan. Kamu pandai merencanakan dan mencapai tujuan.",
      R: "Kecerdasan dan rasa ingin tahu. Kamu menonjol lewat pengetahuan.",
      H: "Kesetiaan dan kerja keras. Kamu sahabat yang dapat diandalkan."
    };
    descTextEl.innerText = descs[key];

    // attributes
    attrsEl.innerHTML = '';
    houseAttrs[key].forEach(a=>{
      const el = document.createElement('div');
      el.className = 'attr-pill';
      el.innerText = a.n;
      attrsEl.appendChild(el);
    });

    resultEl.style.display = 'block';
    houseArtEl.animate([{transform:'scale(.92)'},{transform:'scale(1.06)'},{transform:'scale(1)'}], {duration:700, easing:'cubic-bezier(.2,.9,.4,1)'});

    if (confetti) runConfetti(house.color);
  }

  /* CANVAS SETUP with DPR scaling */
  const bgCanvas = document.getElementById('bg-canvas');
  const ctx = bgCanvas.getContext('2d');
  const confettiCanvas = document.getElementById('confetti');
  const cctx = confettiCanvas.getContext('2d');

  function resizeCanvases(){
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    // bg
    bgCanvas.style.width = window.innerWidth + 'px';
    bgCanvas.style.height = window.innerHeight + 'px';
    bgCanvas.width = Math.floor(window.innerWidth * dpr);
    bgCanvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    // confetti
    confettiCanvas.style.width = window.innerWidth + 'px';
    confettiCanvas.style.height = window.innerHeight + 'px';
    confettiCanvas.width = Math.floor(window.innerWidth * dpr);
    confettiCanvas.height = Math.floor(window.innerHeight * dpr);
    cctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', () => { resizeCanvases(); initStars(); });

  // Stars
  let W = window.innerWidth, H = window.innerHeight;
  let stars = [];
  function initStars(){
    W = window.innerWidth; H = window.innerHeight;
    resizeCanvases();
    stars = [];
    const count = Math.max(80, Math.floor((W*H)/7000));
    for (let i=0;i<count;i++){
      stars.push({x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.6+0.2, v: Math.random()*0.4+0.02, o: Math.random()*0.9+0.1, t: Math.random()*1000});
    }
  }

  function drawStars(){
    // clear
    ctx.clearRect(0,0,W,H);
    // subtle nebula
    const g = ctx.createRadialGradient(W*0.12,H*0.1,0,W*0.6,H*0.55,Math.max(W,H));
    g.addColorStop(0,'rgba(0,40,70,0.07)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    for (const s of stars){
      s.y += s.v;
      if (s.y > H) s.y = 0;
      s.t += 0.02;
      const op = Math.max(0.06, s.o + Math.sin(s.t)*0.18);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${op})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    if (Math.random() < 0.004) shootStar();
    requestAnimationFrame(drawStars);
  }

  function shootStar(){
    const sx = Math.random()*W*0.9 + W*0.05;
    const sy = Math.random()*H*0.35 + 10;
    let life = 0;
    const len = Math.random()*160 + 100;
    const vx = (Math.random()*-6) - 2;
    const vy = Math.random()*2 + 1.5;
    const id = setInterval(()=>{
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 1.2;
      ctx.moveTo(sx + vx*life, sy + vy*life);
      ctx.lineTo(sx + vx*life + vx*3, sy + vy*life + vy*3);
      ctx.stroke();
      life++;
      if (life > len/2) clearInterval(id);
    },14);
  }

  initStars();
  drawStars();

  /* CONFETTI */
  function runConfetti(primary){
    const colors = [primary, '#fff', '#ffd371', '#9fe5ff'];
    let particles = [];
    const N = 86;
    for (let i=0;i<N;i++){
      particles.push({
        x: Math.random()*window.innerWidth,
        y: -Math.random()*window.innerHeight*0.5,
        vx: Math.random()*6 - 3,
        vy: Math.random()*6 + 2,
        s: Math.random()*6 + 4,
        color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*360,
        vr: Math.random()*6 - 3,
        life: 0
      });
    }

    function frame(){
      cctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
      for (const p of particles){
        p.x += p.vx; p.y += p.vy + Math.sin(p.life/8)*0.6; p.rot += p.vr; p.vy += 0.06; p.life++;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot*Math.PI/180);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.s/2, -p.s/2, p.s, p.s*0.6);
        cctx.restore();
      }
      particles = particles.filter(p => p.y < window.innerHeight + 80 && p.life < 300);
      if (particles.length) requestAnimationFrame(frame);
      else cctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    }
    requestAnimationFrame(frame);
  }

  // keyboard start
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !localStorage.getItem('sortingHatResult') && startArea.style.display !== 'none') begin();
  });
});