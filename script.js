(function () {
  const screen = document.getElementById('screen');
  const clock = document.getElementById('clock');
  document.documentElement.style.setProperty('--accent', PHONE.accent);
  document.title = PHONE.owner + '의 휴대폰';

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wallStyle = () => PHONE.wallpaper
    ? `background-image:url('${PHONE.wallpaper}')`
    : `background:${PHONE.wallpaperGradient}`;

  function tick() {
    const d = new Date();
    clock.textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
    const t = document.getElementById('lockTime');
    if (t) t.textContent = clock.textContent;
  }
  setInterval(tick, 10000); tick();

  function show(html, cls) {
    screen.innerHTML = `<div class="view ${cls || ''}">${html}</div>`;
    return screen.firstElementChild;
  }

  /* ---------- 잠금화면 ---------- */
  function lockScreen() {
    if (!PHONE.password) return homeScreen();
    let input = '';
    const len = PHONE.password.length;
    const d = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const v = show(`
      <div class="lock wall" style="${wallStyle()};flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="time" id="lockTime">${clock.textContent}</div>
        <div class="date">${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일</div>
        <div class="msg">${esc(PHONE.lockMessage)}</div>
        <div class="dots" id="dots">${'<i></i>'.repeat(len)}</div>
        <div class="hint">${esc(PHONE.passwordHint || '')}</div>
        <div class="pad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k => `<button data-k="${k}" ${k === '' ? 'style="visibility:hidden"' : ''}>${k}</button>`).join('')}</div>
      </div>`);
    const dots = v.querySelectorAll('#dots i');
    v.querySelector('.pad').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const k = b.dataset.k;
      if (k === '⌫') input = input.slice(0, -1);
      else if (input.length < len) input += k;
      dots.forEach((el, i) => el.classList.toggle('on', i < input.length));
      if (input.length === len) {
        if (input === PHONE.password) homeScreen();
        else {
          const d = v.querySelector('#dots'); d.classList.add('shake');
          setTimeout(() => { input = ''; dots.forEach(x => x.classList.remove('on')); d.classList.remove('shake'); }, 400);
        }
      }
    });
  }

  /* ---------- 앱 정의 ---------- */
  const APPS = {
    messenger: { name: '메신저', icon: '💬', color: '#fee500', open: openMessenger },
    gallery:   { name: '갤러리', icon: '🖼️', color: '#ff7eb3', open: openGallery },
    memo:      { name: '메모',   icon: '📝', color: '#ffd54f', open: openMemo },
    search:    { name: '검색',   icon: '🔍', color: '#4f8cff', open: openSearch },
    music:     { name: '음악',   icon: '🎵', color: '#b388ff', open: openMusic },
    contacts:  { name: '연락처', icon: '📇', color: '#66bb6a', open: openContacts },
    calendar:  { name: '캘린더', icon: '📅', color: '#ef5350', open: openCalendar },
    twt:       { name: 'SNS',    icon: '🐦', color: '#1d9bf0', open: openTwt }
  };

  function homeScreen() {
    const v = show(`
      <div class="home wall" style="${wallStyle()};flex:1">
        <div class="owner">${esc(PHONE.owner)}의 휴대폰</div>
        <div class="grid">
          ${HOME_APPS.filter(k => APPS[k]).map(k => `
            <button class="app" data-app="${k}">
              <span class="ico" style="background:${APPS[k].color}">${APPS[k].icon}</span>${APPS[k].name}
            </button>`).join('')}
        </div>
      </div>`);
    v.addEventListener('click', e => {
      const b = e.target.closest('.app'); if (b) APPS[b.dataset.app].open();
    });
  }

  function appShell(title, bodyHtml, opts) {
    opts = opts || {};
    const v = show(`
      <div class="top"><button class="back">‹</button><span>${esc(title)}</span></div>
      <div class="body" ${opts.bodyStyle ? `style="${opts.bodyStyle}"` : ''}>${bodyHtml}</div>`, 'appview ' + (opts.cls || ''));
    v.querySelector('.back').onclick = opts.back || homeScreen;
    return v;
  }

  document.getElementById('homebtn').onclick = () => {
    if (screen.querySelector('.lock')) return;
    homeScreen();
  };

  /* ---------- 메신저 ---------- */
  function openMessenger() {
    const v = appShell('메신저', MESSENGER.map((c, i) => `
      <div class="row" data-i="${i}">
        <div class="av">${c.avatar || '👤'}</div>
        <div><div class="t">${esc(c.name)}</div>
        <div class="s">${esc(c.messages[c.messages.length - 1].text)}</div></div>
        <div class="time">${esc(c.time || '')}</div>
      </div>`).join(''));
    v.addEventListener('click', e => {
      const r = e.target.closest('.row'); if (r) openChat(+r.dataset.i);
    });
  }
  function openChat(i) {
    const c = MESSENGER[i];
    appShell(c.name, c.messages.map(m => `<div class="bub ${m.from === 'me' ? 'me' : 'them'}">${esc(m.text)}</div>`).join(''),
      { back: openMessenger, bodyStyle: 'background:#b2c7da;display:flex;flex-direction:column;gap:8px;padding:14px' });
  }

  /* ---------- 갤러리 ---------- */
  function openGallery() {
    const v = appShell('갤러리', `<div class="photos">${GALLERY.map((p, i) =>
      `<div class="photo" data-i="${i}" ${p.image ? `style="background-image:url('${p.image}')"` : ''}>${p.image ? '' : p.emoji || ''}</div>`).join('')}</div>`);
    v.addEventListener('click', e => {
      const p = e.target.closest('.photo'); if (!p) return;
      const g = GALLERY[+p.dataset.i];
      const o = document.createElement('div');
      o.className = 'viewer';
      o.innerHTML = `<div class="big" ${g.image ? `style="background-image:url('${g.image}')"` : ''}>${g.image ? '' : g.emoji || ''}</div><div>${esc(g.caption || '')}</div>`;
      o.onclick = () => o.remove();
      v.appendChild(o);
    });
  }

  /* ---------- 메모 ---------- */
  function openMemo() {
    const v = appShell('메모', MEMOS.map((m, i) => `
      <div class="memo" data-i="${i}"><b>${esc(m.title)}</b><span>${esc(m.body.split('\n')[0])}</span></div>`).join(''));
    v.addEventListener('click', e => {
      const r = e.target.closest('.memo'); if (!r) return;
      const m = MEMOS[+r.dataset.i];
      appShell(m.title, `<div class="note">${esc(m.body)}</div>`, { back: openMemo, bodyStyle: 'display:flex;background:#fffbe8' });
    });
  }

  /* ---------- 검색 ---------- */
  function openSearch() {
    appShell('검색 기록', SEARCH_HISTORY.map(s => `<div class="plain">🔍 ${esc(s)}</div>`).join(''));
  }

  /* ---------- 음악 ---------- */
  function openMusic() {
    const n = MUSIC.nowPlaying;
    appShell('음악', `
      <div class="music">
        <div class="cover">${n.emoji || '🎵'}</div>
        <h3 style="margin:0">${esc(n.title)}</h3>
        <div style="opacity:.6;margin-top:4px">${esc(n.artist)}</div>
        <ul>${MUSIC.playlist.map(s => `<li>▶ ${esc(s)}</li>`).join('')}</ul>
      </div>`, { bodyStyle: 'background:#0e0f14;display:flex' });
  }

  /* ---------- 연락처 ---------- */
  function openContacts() {
    appShell('연락처', CONTACTS.map(c => `
      <div class="row"><div class="av">👤</div><div><div class="t">${esc(c.name)}</div><div class="s">${esc(c.number)}</div></div></div>`).join(''));
  }

  /* ---------- 캘린더 ---------- */
  function openCalendar() {
    appShell('캘린더', CALENDAR.map(c => `<div class="plain"><b>${esc(c.date)}</b> ${esc(c.title)}</div>`).join(''));
  }

  /* ---------- SNS ---------- */
  function openTwt() {
    appShell(TWT.handle, TWT.posts.map(p => `<div class="plain">${esc(p.text)}<small>${esc(p.time)}</small></div>`).join(''), { cls: 'dark' });
  }

  lockScreen();
})();
