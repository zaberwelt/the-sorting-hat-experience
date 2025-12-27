// script.js
(function(){
  // Inline SVG art (stylized, illustrative)
  const hatSVG = `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0' stop-color='%23a66b2a'/>
        <stop offset='1' stop-color='%23422a18'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='none'/>
    <g transform='translate(0,10)'>
      <ellipse cx='256' cy='400' rx='220' ry='40' fill='%23000000' opacity='0.35'/>
      <path d='M94,280 C86,160 160,90 256,90 C352,90 426,160 418,280 C340,320 172,320 94,280 Z' fill='url(%23g)' stroke='%230b0602' stroke-width='6' />
      <path d='M150,230 C170,200 220,170 256,170 C292,170 342,200 362,230' fill='none' stroke='%23e3c08d' stroke-width='6' stroke-opacity='0.12'/>
      <path d='M180,270 C190,240 230,210 256,210 C282,210 322,240 342,270' fill='none' stroke='%23fff' stroke-width='2' opacity='0.06'/>
    </g>
  </svg>`;

  const houseArts = {
    G: {
      name:'Gryffindor',
      color:'#b71c1c',
      img: `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
        <rect width='100%' height='100%' rx='18' fill='none'/>
        <g transform='translate(20,12)'>
          <polygon points='60,0 90,30 60,60 30,30' fill='%23b71c1c' stroke='%23ffe082' stroke-width='3'/>
          <path d='M10,120 Q50,70 110,120 L90,150 Q50,120 10,150 Z' fill='%23b71c1c' stroke='%23ffe082' stroke-width='3'/>
        </g>
      </svg>`
    },
    S: {
      name:'Slytherin',
      color:'#0f5e37',
      img: `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
        <g transform='translate(20,12)'>
          <path d='M20,30 C60,0 120,0 160,30 C140,70 120,100 110,120 C80,110 50,110 20,120 Z' fill='%230f5e37' stroke='%23c6f6e0' stroke-width='3'/>
          <circle cx='100' cy='80' r='10' fill='%230f5e37' opacity='0.12'/>
        </g>
      </svg>`
    },
    R: {
      name:'Ravenclaw',
      color:'#1e3250',
      img: `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
        <g transform='translate(18,12)'>
          <rect x='10' y='10' width='120' height='120' rx='12' fill='%231e3250' stroke='%23cfe7ff' stroke-width='3'/>
          <polyline points='20,100 60,50 100,100' fill='none' stroke='%23cfe7ff' stroke-width='4'/>
        </g>
      </svg>`
    },
    H: {
      name:'Hufflepuff',
      color:'#e6b800',
      img: `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
        <g transform='translate(18,12)'>
          <circle cx='70' cy='70' r='50' fill='%23e6b800' stroke='%230f0f0f' stroke-width='3'/>
          <path d='M30,120 Q70,80 110,120' fill='none' stroke='%230f0f0f' stroke-width='3'/>
        </g>
      </svg>`
    }
  };

  /* Questions data (5 soal). Each option maps to house key: G,S,R,H */
  const questions = [
    { q: "Mana yang paling kamu hargai dalam dirimu?", a:[
        {t:"Keberanian", h:"G"}, {t:"Ambisi", h:"S"}, {t:"Kecerdasan", h:"R"}, {t:"Kesetiaan", h:"H"}
      ]},
    { q: "Jika melihat ketidakadilan, kamu akan...", a:[
        {t:"Melawan langsung", h:"G"}, {t:"Mencari cara untuk mengendalikan situasi", h:"S"}, {t:"Menyusun rencana bijak", h:"R"}, {t:"Membantu yang dirugikan", h:"H"}
      ]},
    { q: "Apa yang paling kamu inginkan dari orang lain?", a:[
        {t:"Kepercayaan", h:"H"}, {t:"Pengakuan", h:"G"}, {t:"Rasa hormat", h:"S"}, {t:"Kekaguman atas kepintaranmu", h:"R"}
      ]},
    { q: "Pilih artefak yang paling menarik:", a:[
        {t:"Pedang cahaya", h:"G"}, {t:"Cincin bertuah", h:"S"}, {t:"Buku kuno", h:"R"}, {t:"Piala persahabatan", h:"H"}
      ]},
    { q: "Bagaimana kamu ingin dikenang?", a:[
        {t:"Sebagai pahlawan", h:"G"}, {t:"Sebagai pemimpin yang licik", h:"S"}, {t:"Sebagai orang bijak", h:"R"}, {t:"Sebagai teman setia", h:"H"}
      ]}
  ];

  /* Attributes for each house to show as pills */
  const houseAttrs = {
    G: [{n:"Berani"},{n:"Impulsif"},{n:"Berjiwa petualang"}],
    S: [{n:"Ambisius"},{n:"Visioner"},{n:"Cerdik"}],
    R: [{n:"Logis"},{n:"Intelektual"},{n:"Pena tajam"}],
    H: [{n:"Setia"},{n:"Ramah"},{n:"Tangguh"}]
  };

  /* local state */
  let index = 0;
  let scores = {G:0,S:0,R:0,H:0};
  const startBtn = document.getElementById('start-btn');
  const hatImg = document.getElementById('hat-art');
  hatImg.src = hatSVG;

  /* check if already sorted in this browser */
  const stored = localStorage.getItem('sortingHatResult');
  if(stored){
    // show badge
    document.getElementById('start-area').classList.add('locked');
    document.getElementById('start-btn').style.display = 'none';
    const already = document.getElementById('already');
    already.style.display = 'block';
    document.getElementById('done-badge').innerText = `Sudah ditempatkan di ${JSON.parse(stored).name}`;
    // show result immediately
    setTimeout(()=> showResult(JSON.parse(stored).key, false), 600);
  } else {
    document.getElementById('start-btn').addEventListener('click', begin);
  }

  /* begin quiz */
  function begin(){
    startBtn.disabled = true;
    startBtn.style.transform = 'scale(.98)';
    setTimeout(()=>{
      document.getElementById('start-area').style.display = 'none';
      document.getElementById('quiz-area').style.display = 'block';
      renderQuestion();
    },220);
  }

  /* render question */
  function renderQuestion(){
    const q = questions[index];
    document.getElementById('question-text').innerText = `(${index+1}/5)  ${q.q}`;
    const opt = document.getElementById('options');
    opt.innerHTML = '';
    q.a.forEach((o,i)=>{
      const btn = document.createElement('button');
      btn.className = 'opt';
      btn.innerHTML = `<span class="label">${o.t}</span>`;
      btn.addEventListener('click', ()=>{
        btn.style.transform = 'scale(.98)';
        setTimeout(()=>btn.style.transform='none',160);
        scores[o.h] += 1;
        index += 1;
        if(index < questions.length){
          document.getElementById('quiz-area').animate([{opacity:1, transform:'translateY(0)'}, {opacity:0, transform:'translateY(-8px)'}], {duration:220, easing:'ease-in-out', direction:'normal'}).onfinish = () => {
            renderQuestion();
          };
        } else {
          finalize();
        }
      });
      opt.appendChild(btn);
    });
  }

  /* finalize quiz: compute winner, save and show result */
  function finalize(){
    const entries = Object.entries(scores);
    let max = Math.max(...entries.map(e=>e[1]));
    const top = entries.filter(e=>e[1]===max).map(e=>e[0]);
    const winner = top[Math.floor(Math.random()*top.length)];
    const resultObj = {key:winner, name: houseArts[winner].name, time: new Date().toISOString()};
    try{
      localStorage.setItem('sortingHatResult', JSON.stringify(resultObj));
    }catch(e){}
    document.getElementById('quiz-area').style.display = 'none';
    showResult(winner, true);
  }

  /* show result UI, with confetti & animations */
  function showResult(winnerKey, playConfetti){
    const house = houseArts[winnerKey];
    const art = document.getElementById('house-art');
    art.src = house.img;
    art.style.color = house.color;
    document.getElementById('house-name').innerText = house.name;
    document.getElementById('house-name').style.color = house.color;
    document.getElementById('house-name').style.textShadow = `0 0 22px ${house.color}`;
    const descText = document.getElementById('desc-text');
    const descImg = document.getElementById('desc-img');
    descImg.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%">${house.img.replace(/"/g, "'")}</div>`;
    const descriptions = {
      G: `Keberanianmu mendefinisikanmu. Kalian yang jatuh ke rumah ini akan selalu siap menghadapi bahaya demi kebenaran. Kamu berani mengambil risiko demi apa yang benar.`,
      S: `Ambisi dan perencanaan adalah kekuatanmu. Kamu fokus, pandai menyesuaikan diri, dan bersedia melakukan apa pun untuk mencapai tujuanmu.`,
      R: `Pikiran analitis dan rasa ingin tahu membawamu jauh. Kamu menghargai pengetahuan, kebijaksanaan, dan cara-cara elegan untuk memecahkan masalah.`,
      H: `Kesetiaan dan kerja keras adalah nilai inti. Kamu peduli pada orang lain, pantang menyerah, dan selalu setia pada teman-temanmu.`
    };
    descText.innerText = descriptions[winnerKey];
    const attrsWrap = document.getElementById('attrs');
    attrsWrap.innerHTML = '';
    houseAttrs[winnerKey].forEach(a=>{
      const d = document.createElement('div');
      d.className = 'attr-pill';
      d.innerText = a.n;
      attrsWrap.appendChild(d);
    });
    const resultEl = document.getElementById('result');
    resultEl.style.display = 'block';
    const artEl = document.getElementById('house-art');
    artEl.animate([{transform:'scale(.9)'},{transform:'scale(1.08)'},{transform:'scale(1)'}], {duration:900, easing:'cubic-bezier(.2,.9,.4,1)'});
    if(playConfetti) runConfetti(house.color);
  }

  /* BACKGROUND STARS - canvas animation */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W = innerWidth, H = innerHeight;
  canvas.width = W; canvas.height = H;
  window.addEventListener('resize', ()=>{W=innerWidth;H=innerHeight;canvas.width=W;canvas.height=H; initStars();});

  let stars = [];
  function initStars(){
    stars = [];
    const count = Math.floor((W*H)/6000) + 80;
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*W,
        y: Math.random()*H,
        r: Math.random()*1.6 + 0.2,
        v: Math.random()*0.4 + 0.02,
        opacity: Math.random()*0.9 + 0.1,
        tw: Math.random()*1000
      });
    }
  }
  function drawStars(t){
    ctx.clearRect(0,0,W,H);
    const g = ctx.createRadialGradient(W*0.1,H*0.1,0,W*0.5,H*0.5,Math.max(W,H));
    g.addColorStop(0,'rgba(0,40,70,0.08)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    for(const s of stars){
      s.y += s.v;
      if(s.y > H) s.y = 0;
      s.tw += 0.02;
      const op = s.opacity + Math.sin(s.tw)*0.18;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0.08, op)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    if(Math.random() < 0.004) shootStar();
    requestAnimationFrame(drawStars);
  }
  initStars();
  drawStars();

  /* Shoot star */
  function shootStar(){
    const sx = Math.random()*W*0.9 + W*0.05;
    const sy = Math.random()*H*0.4 + 10;
    let len = Math.random()*200 + 120;
    let vx = -5 - Math.random()*6, vy = 2 + Math.random()*3;
    let life = 0;
    const id = setInterval(()=>{
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1.6;
      ctx.moveTo(sx + vx*life, sy + vy*life);
      ctx.lineTo(sx + vx*life + vx*2, sy + vy*life + vy*2);
      ctx.stroke();
      life++;
      if(life>len/3){ clearInterval(id);}
    },14);
  }

  /* CONFETTI (simple particles) */
  const confettiCanvas = document.getElementById('confetti');
  const cctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight;
  window.addEventListener('resize', ()=>{confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight;});

  function runConfetti(hex){
    const colors = [hex, '#fff', '#ffd371', '#9fe5ff'];
    let particles = [];
    const N = 90;
    for(let i=0;i<N;i++){
      particles.push({
        x: Math.random()*confettiCanvas.width,
        y: -Math.random()*confettiCanvas.height/2,
        vx: Math.random()*6 - 3,
        vy: Math.random()*6 + 2,
        r: Math.random()*6 + 4,
        color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*360,
        vr: Math.random()*6 - 3,
        life:0
      });
    }
    let t0 = null;
    function frame(t){
      if(!t0)t0=t;
      const dt = t - t0;
      t0 = t;
      cctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
      for(const p of particles){
        p.x += p.vx; p.y += p.vy + (Math.sin(p.life/10)*0.6);
        p.rot += p.vr;
        p.vy += 0.06; p.life++;
        cctx.save();
        cctx.translate(p.x,p.y);
        cctx.rotate(p.rot*Math.PI/180);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
        cctx.restore();
      }
      particles = particles.filter(p=>p.y < confettiCanvas.height + 80 && p.life < 240);
      if(particles.length>0) requestAnimationFrame(frame);
      else cctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    }
    requestAnimationFrame(frame);
  }

  /* Accessibility: press Enter to start */
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' && !localStorage.getItem('sortingHatResult') && document.getElementById('start-area').style.display !== 'none'){
      begin();
    }
  });

  // function resetSorting(){ localStorage.removeItem('sortingHatResult'); location.reload(); }
})();