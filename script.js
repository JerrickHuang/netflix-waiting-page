// ===== 進度條 =====
let progress = document.querySelector(".progress");
let width = 0;
setInterval(() => {
  if (width < 100) { width++; progress.style.width = width + "%"; }
}, 600);

// ===== 翻牌倒數 =====
let time = 60;

function pad(n) { return String(n).padStart(2, '0'); }

function flipTo(el, val) {
  if (!el || el.textContent === val) return;
  el.classList.add('flip');
  setTimeout(() => { el.textContent = val; el.classList.remove('flip'); }, 150);
}

const elMin = document.getElementById('cdMin');
const elSec = document.getElementById('cdSec');

const countdownTimer = setInterval(() => {
  time--;
  if (time <= 0) {
    clearInterval(countdownTimer);
    flipTo(elMin, '00');
    flipTo(elSec, '00');
    showToast('🎉 咖啡喝完了！重新載入中...');
    setTimeout(() => location.reload(), 3000);
    return;
  }
  flipTo(elMin, pad(Math.floor(time / 60)));
  flipTo(elSec, pad(time % 60));
}, 1000);

// ===== 訊息輪播 =====
const allMessages = [
  '☕ 伺服器正在補咖啡中...',
  '🔧 工程師剛到現場，找停車位中...',
  '🍕 訂了披薩，等外送先...',
  '💤 重開機中（已打盹 3 次）',
  '🚀 即將恢復！（第 7 次說了）',
  '工程師正在追進度中 🚀',
  '你的爆米花還沒涼 🍿',
  '下一集沒有消失放心 🎬',
  '伺服器正在全力修復中 🛠️'
];

const messageEl = document.getElementById('message');
setInterval(() => {
  const idx = Math.floor(Math.random() * allMessages.length);
  if (messageEl) {
    messageEl.style.opacity = 0;
    setTimeout(() => {
      messageEl.innerText = allMessages[idx];
      messageEl.style.transition = 'opacity 0.5s';
      messageEl.style.opacity = 1;
    }, 300);
  }
}, 5000);

// ===== 播放下一集按鈕（多階段互動） =====
const button = document.getElementById("nextEpisode");

const stages = [
  { text: "▶ 播放下一集",           style: "#E50914", action: null },
  { text: "⏳ 正在連線伺服器...",     style: "#c57800", action: null },
  { text: "☕ 伺服器去倒咖啡了...",   style: "#7a4e00", action: null },
  { text: "🔄 重新嘗試連線中...",     style: "#1a6e3a", action: null },
  { text: "📡 訊號微弱，再按一次！",  style: "#1a3a7a", action: null },
  { text: "🎉 載入成功！（騙你的）",  style: "#5a1a7a", action: "fake_success" },
  { text: "💀 伺服器徹底放棄了",      style: "#555",    action: "give_up" },
  { text: "🔃 好啦重來...",          style: "#E50914", action: "reset" },
];

let stageIdx = 0;
let isAnimating = false;

function setButtonStage(idx) {
  const s = stages[idx];
  button.style.background = s.style;
  button.style.transition = "background 0.4s, transform 0.1s";

  if (s.action === "fake_success") {
    button.innerText = s.text;
    // 假裝成功：進度條瞬間滿
    const bar = document.querySelector(".progress");
    if (bar) { bar.style.transition = "width 0.3s"; bar.style.width = "100%"; }
    showToast("🎬 載入完成！Just kidding 😈");
    setTimeout(() => {
      if (bar) { bar.style.transition = "width 2s"; bar.style.width = "30%"; }
    }, 1500);

  } else if (s.action === "give_up") {
    button.innerText = s.text;
    // 抖動效果
    button.style.animation = "shake 0.4s ease";
    setTimeout(() => { button.style.animation = ""; }, 400);
    showToast("😂 工程師已離職，請改用 YouTube");

  } else if (s.action === "reset") {
    // 短暫閃爍後回到第一階
    button.innerText = s.text;
    setTimeout(() => {
      stageIdx = 0;
      setButtonStage(0);
    }, 1200);
    return; // 不再推進 idx

  } else {
    button.innerText = s.text;
    // 一般階段：顯示對應 toast
    const toasts = [
      null,
      "📶 正在嘗試叫醒伺服器...",
      "☕ 等它喝完咖啡就好了",
      "🔄 第三次嘗試，感覺這次行了！",
      "📡 收到 1 格訊號，別動！",
    ];
    if (toasts[idx]) showToast(toasts[idx]);
  }
}

button.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;

  // 按下時輕微縮放回饋
  button.style.transform = "scale(0.95)";
  setTimeout(() => { button.style.transform = "scale(1)"; }, 100);

  stageIdx = (stageIdx + 1) % stages.length;
  setTimeout(() => {
    setButtonStage(stageIdx);
    isAnimating = false;
  }, 120);
});

// ===== Toast（固定暫留 4 秒，避免快速覆蓋） =====
let _toastTimer = null;

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;

  // 清掉舊的 timer，先讓它滑出
  if (_toastTimer) {
    clearTimeout(_toastTimer);
    _toastTimer = null;
  }

  // 先移除 show，強制 reflow，再重新加回來（確保動畫重新觸發）
  t.classList.remove('show');
  t.textContent = msg;

  // 用 requestAnimationFrame 確保 DOM 更新後才加 show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      t.classList.add('show');
      _toastTimer = setTimeout(() => {
        t.classList.remove('show');
        _toastTimer = null;
      }, 4000); // 固定 4 秒，夠讀完又不拖太久
    });
  });
}

// ===== 粒子背景 =====
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const pts = Array.from({ length: 55 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    a:  Math.random() * 0.45 + 0.08
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pts) {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229,9,20,${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
  window._particles = pts;
})();

// ===== 爆米花點擊 =====
(function initPopcorn() {
  const row = document.getElementById('popcornRow');
  if (!row) return;
  row.addEventListener('click', e => {
    if (e.target.tagName !== 'SPAN') return;
    const s = e.target;
    s.style.animation = 'none';
    s.textContent = '💥';
    setTimeout(() => { s.textContent = '🍿'; s.style.animation = ''; }, 500);
    showToast('爆米花炸掉了！😂');
  });
})();

// ===== Mini 跑酷遊戲 =====
(function initGame() {
  const gc = document.getElementById('gameCanvas');
  if (!gc) return;
  const ctx = gc.getContext('2d');
  const groundY = 85;
  let active = true, score = 0, spd = 2.5, frame = 0, spawnT = 0;
  let srv  = { x: 60, y: groundY, vy: 0, jumping: false, w: 30, h: 34 };
  let obs  = [];

  function drawServer(x, y) {
    ctx.fillStyle = '#E50914';
    ctx.fillRect(x, y - srv.h, srv.w, srv.h);
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(x + 3, y - srv.h + 5,  srv.w - 6, 4);
    ctx.fillRect(x + 3, y - srv.h + 14, srv.w - 6, 4);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + srv.w - 8, y - srv.h + 9, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop() {
    if (!active) return;
    frame++;
    ctx.clearRect(0, 0, gc.width, gc.height);
    ctx.fillStyle = '#444';
    ctx.fillRect(0, groundY + 2, gc.width, 1);
    srv.vy += 0.6;
    srv.y  += srv.vy;
    if (srv.y >= groundY) { srv.y = groundY; srv.vy = 0; srv.jumping = false; }
    score++;
    spd = 2.5 + score / 600;
    const sd = document.getElementById('scoreDisplay');
    if (sd) sd.textContent = Math.floor(score / 5);
    spawnT++;
    if (spawnT > 70 + Math.random() * 60) {
      obs.push({ x: 510, y: groundY, w: 12, h: 15 + Math.random() * 28 });
      spawnT = 0;
    }
    for (let i = obs.length - 1; i >= 0; i--) {
      const o = obs[i];
      o.x -= spd;
      ctx.fillStyle = '#666';
      ctx.fillRect(o.x, o.y - o.h, o.w, o.h);
      if (o.x + o.w < 0) { obs.splice(i, 1); continue; }
      if (
        srv.x + srv.w - 4 > o.x + 2 &&
        srv.x + 4 < o.x + o.w - 2 &&
        srv.y - srv.h + 4 < o.y &&
        srv.y > o.y - o.h
      ) { gameOver(); return; }
    }
    drawServer(srv.x, srv.y);
    requestAnimationFrame(loop);
  }

  function jump() {
    if (!srv.jumping && active) { srv.vy = -9; srv.jumping = true; }
  }

  function gameOver() {
    active = false;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, gc.width, gc.height);
    ctx.fillStyle = '#E50914';
    ctx.font = 'bold 17px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GG！伺服器撞牆了 😵', gc.width / 2, 44);
    ctx.fillStyle = '#aaa';
    ctx.font = '13px Arial';
    ctx.fillText('點擊重新開始', gc.width / 2, 68);
    obs = []; score = 0; spd = 2.5; frame = 0; spawnT = 0;
  }

  gc.addEventListener('click', () => {
    if (!active) {
      active = true;
      srv.y = groundY; srv.vy = 0;
      const sd = document.getElementById('scoreDisplay');
      if (sd) sd.textContent = '0';
      loop();
      return;
    }
    jump();
  });
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); jump(); }
  });
  loop();
})();

// ===== 彩蛋按鈕 =====
const _eggMsgs = [
  '🥚 發現彩蛋！工程師偷偷躲在這裡睡覺 💤',
  '🎭 404: 彩蛋不存在（這就是彩蛋）',
  '🍕 你找到了！請工程師喝珍奶謝謝',
  '🤖 伺服器：我累了，讓我休息一下嘛...',
  '📺 這個頁面比 Netflix 本體更有娛樂性'
];
let _eggIdx = 0;
function revealEasterEgg() {
  const btn = document.querySelector('.secret-btn');
  if (btn) {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 400);
  }
  showToast(_eggMsgs[_eggIdx++ % _eggMsgs.length]);
}

// ===== Konami Code =====
(function initKonami() {
  const code = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let idx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === code[idx]) {
      if (++idx === code.length) {
        idx = 0;
        showToast('🎮 KONAMI CODE！獲得無限等待耐心 +999');
        const logo = document.querySelector('.logo');
        if (logo) logo.style.animationDuration = '0.15s';
        if (window._particles) window._particles.forEach(p => { p.dx *= 6; p.dy *= 6; });
        setTimeout(() => {
          if (logo) logo.style.animationDuration = '';
          if (window._particles) window._particles.forEach(p => { p.dx /= 6; p.dy /= 6; });
        }, 3000);
      }
    } else idx = 0;
  });
})();