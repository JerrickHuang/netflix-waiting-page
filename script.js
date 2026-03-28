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

// =============================================
// 音效系統（Web Audio API，無需外部檔案）
// =============================================

const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  // 基礎播放器
  function play(fn) {
    try { fn(getCtx()); } catch(e) {}
  }

  // 工具：建立 oscillator
  function osc(ac, type, freq, start, end, vol = 0.3) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime + start);
    g.gain.setValueAtTime(vol, ac.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + end);
    o.start(ac.currentTime + start);
    o.stop(ac.currentTime + end);
  }

  // 🍿 爆米花爆炸音（隨機短促高頻 pop）
  function popcornPop() {
    play(ac => {
      const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
      }
      const src = ac.createBufferSource();
      const g = ac.createGain();
      const filter = ac.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800 + Math.random() * 400;
      src.buffer = buf;
      src.connect(filter); filter.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.6, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      src.start();
    });
  }

  // ⏳ 按鈕點擊音（每階段不同音調）
  function buttonClick(stageIdx) {
    play(ac => {
      const freqs = [440, 523, 392, 349, 294, 659, 220, 523];
      const types = ['sine','triangle','square','sawtooth','sine','triangle','square','sine'];
      const freq = freqs[stageIdx % freqs.length];
      const type = types[stageIdx % types.length];
      osc(ac, type, freq,       0,    0.05, 0.25);
      osc(ac, type, freq * 1.5, 0.03, 0.12, 0.15);
    });
  }

  // 🎉 假裝成功（上升大和弦）
  function fakeSuccess() {
    play(ac => {
      [[0, 523], [0.08, 659], [0.16, 784], [0.24, 1047]].forEach(([t, f]) => {
        osc(ac, 'sine', f, t, t + 0.35, 0.2);
      });
    });
  }

  // 💀 伺服器放棄（下滑悲鳴）
  function giveUp() {
    play(ac => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(400, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.8);
      g.gain.setValueAtTime(0.3, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.9);
      o.start(); o.stop(ac.currentTime + 0.9);
    });
  }

  // 🥚 彩蛋音（神秘音效）
  function easterEgg() {
    play(ac => {
      [0, 0.1, 0.2, 0.3, 0.4].forEach((t, i) => {
        const freq = [800, 1000, 1200, 1000, 1400][i];
        osc(ac, 'sine', freq, t, t + 0.12, 0.18);
      });
    });
  }

  // 🎮 跳躍音（短促上彈）
  function jump() {
    play(ac => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.type = 'square';
      o.frequency.setValueAtTime(300, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.1);
      g.gain.setValueAtTime(0.15, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
      o.start(); o.stop(ac.currentTime + 0.12);
    });
  }

  // 💥 遊戲結束（撞牆音）
  function gameOver() {
    play(ac => {
      // 低頻撞擊
      const buf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
      }
      const src = ac.createBufferSource();
      const g = ac.createGain();
      const f = ac.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 200;
      src.buffer = buf;
      src.connect(f); f.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.8, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
      src.start();

      // 悲傷音符
      osc(ac, 'sine', 220, 0.05, 0.4, 0.2);
      osc(ac, 'sine', 185, 0.15, 0.5, 0.15);
    });
  }

  // 🔄 重置音（輕快重來）
  function reset() {
    play(ac => {
      [0, 0.07, 0.14].forEach((t, i) => {
        osc(ac, 'sine', [440, 550, 660][i], t, t + 0.1, 0.15);
      });
    });
  }

  // 📡 Konami Code（8bit 勝利曲）
  function konami() {
    play(ac => {
      const melody = [
        [0,    523, 0.12],
        [0.12, 523, 0.12],
        [0.24, 523, 0.12],
        [0.36, 415, 0.09],
        [0.45, 523, 0.12],
        [0.57, 659, 0.24],
        [0.81, 523, 0.36],
      ];
      melody.forEach(([t, f, dur]) => {
        osc(ac, 'square', f, t, t + dur, 0.18);
      });
    });
  }

  // ⏱ 倒數最後 10 秒提示音（每秒一聲）
  function countdownTick(secondsLeft) {
    if (secondsLeft > 10) return;
    play(ac => {
      const freq = secondsLeft <= 3 ? 880 : 660;
      osc(ac, 'sine', freq, 0, 0.08, secondsLeft <= 3 ? 0.35 : 0.2);
    });
  }

  // 🎉 倒數結束（勝利小號）
  function countdownEnd() {
    play(ac => {
      [[0, 392], [0.1, 523], [0.2, 659], [0.3, 784], [0.45, 1047]].forEach(([t, f]) => {
        osc(ac, 'triangle', f, t, t + 0.25, 0.22);
      });
    });
  }

  return {
    popcornPop, buttonClick, fakeSuccess, giveUp,
    easterEgg, jump, gameOver, reset, konami,
    countdownTick, countdownEnd
  };
})();


// =============================================
// 把音效掛進現有的各個互動事件
// =============================================

// — 爆米花點擊音 —
(function patchPopcorn() {
  const row = document.getElementById('popcornRow');
  if (!row) return;
  row.addEventListener('click', e => {
    if (e.target.tagName === 'SPAN') SFX.popcornPop();
  });
})();

// — 按鈕多階段音效（patch 現有按鈕邏輯） —
(function patchButton() {
  const btn = document.getElementById('nextEpisode');
  if (!btn) return;
  btn.addEventListener('click', () => {
    // stageIdx 是外層 script 的變數，這裡用 data attribute 追蹤音效用的 index
    const idx = parseInt(btn.dataset.sfxStage || '0');
    if (idx === 4) SFX.fakeSuccess();
    else if (idx === 5) SFX.giveUp();
    else if (idx === 6) SFX.reset();
    else SFX.buttonClick(idx);
    btn.dataset.sfxStage = String((idx + 1) % 7);
  });
})();

// — 彩蛋按鈕音 —
(function patchEgg() {
  const btn = document.querySelector('.secret-btn');
  if (!btn) return;
  btn.addEventListener('click', () => SFX.easterEgg());
})();

// — 遊戲跳躍 & 撞牆音（patch gameCanvas） —
(function patchGame() {
  const gc = document.getElementById('gameCanvas');
  if (!gc) return;

  // 攔截跳躍：監聽空白鍵 & canvas 點擊
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') SFX.jump();
  }, true); // capture phase，在遊戲邏輯之前觸發

  gc.addEventListener('click', () => SFX.jump(), true);

  // 攔截遊戲結束：觀察 canvas 文字變化（用 MutationObserver 偵測 gameOver 狀態）
  // 改用輪詢方式偵測遊戲是否結束
  let _wasActive = true;
  setInterval(() => {
    // 透過 canvas 第一個 pixel 是否變深判斷 game over overlay
    try {
      const pixel = gc.getContext('2d').getImageData(gc.width / 2, 10, 1, 1).data;
      const isDark = pixel[3] > 100 && pixel[0] < 30; // 半透明黑色覆蓋
      if (isDark && _wasActive) { SFX.gameOver(); _wasActive = false; }
      if (!isDark) { _wasActive = true; }
    } catch(e) {}
  }, 100);
})();

// — 倒數計時音效（patch 現有 countdownTimer） —
(function patchCountdown() {
  // 把音效注入 flipTo，每次翻牌時判斷
  const _origFlipTo = window.flipTo; // 若 flipTo 是全域函式
  const elSec = document.getElementById('cdSec');
  if (!elSec) return;

  // 用 MutationObserver 監聽秒數變化
  const observer = new MutationObserver(() => {
    const val = parseInt(elSec.textContent);
    if (!isNaN(val)) {
      if (val === 0 && parseInt(document.getElementById('cdMin')?.textContent) === 0) {
        SFX.countdownEnd();
      } else {
        SFX.countdownTick(val);
      }
    }
  });
  observer.observe(elSec, { childList: true, characterData: true, subtree: true });
})();

// — Konami Code 音效 —
(function patchKonami() {
  // Konami 已在前面實作，這裡補上音效
  // 用 CustomEvent 或直接 override konami 偵測的方式
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                 'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === code[idx]) {
      if (++idx === code.length) { idx = 0; SFX.konami(); }
    } else idx = 0;
  });
})();