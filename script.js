(function () {
  const D = DATA;
  const $ = s => document.querySelector(s);
  const phone = $('#phone'), screen = $('#screen');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  let state = 'off';

  /* ---------- 크기/상태바 ---------- */
  function fit() { phone.style.fontSize = (phone.clientWidth / 390 * 16) + 'px'; }
  window.addEventListener('resize', fit); fit();

  function pad2(n) { return String(n).padStart(2, '0'); }
  function tick() {
    const d = new Date();
    $('#clock').textContent = state === 'lock' && D.carrier ? D.carrier : (d.getHours() % 12 || 12) + ':' + pad2(d.getMinutes());
    const lt = $('#lockTime'); if (lt) lt.textContent = (d.getHours() % 12 || 12) + ':' + pad2(d.getMinutes());
  }
  setInterval(tick, 5000); tick();
  if (navigator.getBattery) navigator.getBattery().then(b => {
    const f = () => { $('#batfill').style.width = Math.max(8, b.level * 100) + '%'; };
    f(); b.addEventListener('levelchange', f);
  }).catch(() => {});

  function fmtTime(d) { const h = d.getHours(); return (h < 12 ? '오전 ' : '오후 ') + (h % 12 || 12) + ':' + pad2(d.getMinutes()); }
  function sod(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function fmtRel(hAgo) {
    const d = new Date(Date.now() - hAgo * 3600e3), t = new Date();
    const diff = Math.round((sod(t) - sod(d)) / 864e5);
    if (diff <= 0) return fmtTime(d);
    if (diff === 1) return '어제';
    if (diff < 7) return DAYS[d.getDay()] + '요일';
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  }
  function fmtStamp(hAgo) {
    const d = new Date(Date.now() - hAgo * 3600e3), t = new Date();
    const diff = Math.round((sod(t) - sod(d)) / 864e5);
    const day = diff <= 0 ? '오늘' : diff === 1 ? '어제' : `${d.getMonth() + 1}월 ${d.getDate()}일 ${DAYS[d.getDay()]}요일`;
    return `${day} ${fmtTime(d)}`;
  }

  /* ---------- 화면 전환 ---------- */
  function render(html, cls, opt) {
    opt = opt || {};
    screen.innerHTML = `<div class="view ${cls || ''}">${html}</div>`;
    phone.dataset.s = state;
    phone.classList.toggle('lockico', state === 'lock');
    phone.classList.toggle('face', state === 'passcode');
    tick();
    phone.classList.toggle('dark-text', !!opt.darkText);
    phone.classList.toggle('hidden-ind', !!opt.hideInd);
    return screen.firstElementChild;
  }
  const wallStyle = () => D.wallpaper ? `background-image:url('${D.wallpaper}');` : '';

  /* ---------- 꺼진 화면 ---------- */
  function off() {
    state = 'off'; phone.classList.remove('face');
    const v = render(`<div class="off" style="position:absolute;inset:0">눌러서 전원 켜기</div>`, '', { hideInd: true });
    v.onclick = lock;
  }
  $('#power').onclick = () => { if (state !== 'off') off(); else lock(); };

  /* ---------- 스와이프(위로 밀기 / 탭) ---------- */
  function swipeUp(el, cb) {
    let y0 = null, done = false;
    el.addEventListener('pointerdown', e => { y0 = e.clientY; done = false; try { el.setPointerCapture(e.pointerId); } catch (_) {} });
    el.addEventListener('pointermove', e => { if (y0 !== null && !done && y0 - e.clientY > 28) { done = true; cb(); } });
    el.addEventListener('pointerup', e => { if (y0 !== null && !done && Math.abs(e.clientY - y0) < 10) { done = true; cb(); } y0 = null; });
    el.addEventListener('pointercancel', () => { y0 = null; });
  }

  /* ---------- 잠금화면 ---------- */
  const FLASH = '<svg viewBox="0 0 24 24"><path d="M8 2h8v4.2l-1.6 3.1V21a2 2 0 0 1-2 2h-.8a2 2 0 0 1-2-2V9.3L8 6.2z"/><rect x="11.1" y="11" width="1.8" height="4" rx=".9" fill="#5a5a5e"/></svg>';
  const CAM = '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 4 7.8 6H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.8L15 4zM12 9.6a3.9 3.9 0 1 0 0 7.8 3.9 3.9 0 0 0 0-7.8z"/></svg>';
  function lock() {
    state = 'lock'; phone.classList.remove('face');
    const d = new Date();
    const v = render(`
      <div class="lock wall" style="${wallStyle()}position:absolute;inset:0;color:#fff">
        <div class="date">${d.getMonth() + 1}월 ${d.getDate()}일 (${DAYS[d.getDay()]})</div>
        <div class="time" id="lockTime"></div>
        <div class="lbtn" style="left:18.5%">${FLASH}</div>
        <div class="lbtn" style="left:81%">${CAM}</div>
      </div>`, '', { hideInd: false });
    tick();
    swipeUp(v, passcode);
  }

  /* ---------- 암호 ---------- */
  const LETTERS = { 2: 'ABC', 3: 'DEF', 4: 'GHI', 5: 'JKL', 6: 'MNO', 7: 'PQRS', 8: 'TUV', 9: 'WXYZ' };
  function passcode() {
    state = 'passcode';
    phone.classList.add('face');
    const len = D.passcode.length; let val = '';
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map(k => {
      if (k === '') return '<button class="empty"></button>';
      return `<button data-k="${k}"><b>${k}</b><small>${LETTERS[k] || ''}</small></button>`;
    }).join('');
    const v = render(`
      <div class="passcode wall" style="${wallStyle()}position:absolute;inset:0">
        <div class="ttl">암호 입력</div>
        <div class="pdots" id="pdots">${'<i></i>'.repeat(len)}</div>
        <div class="keys">${keys}</div>
        <button class="pc-foot" style="left:24.7%">긴급 상황</button>
        <button class="pc-foot" id="pcCancel" style="left:75.2%" data-k="back">취소</button>
      </div>`, '', { hideInd: true });
    const dots = v.querySelectorAll('#pdots i'), cancel = v.querySelector('#pcCancel');
    function paint() { dots.forEach((el, i) => el.classList.toggle('on', i < val.length)); cancel.textContent = val.length ? '삭제' : '취소'; }
    function leave() { phone.classList.remove('face'); document.removeEventListener('keydown', onKey); }
    function press(k) {
      if (state !== 'passcode') return;
      if (k === 'back') { if (val) { val = val.slice(0, -1); paint(); } else { leave(); lock(); } return; }
      if (val.length >= len) return;
      val += k; paint();
      if (val.length === len) {
        setTimeout(() => {
          if (val === D.passcode) { leave(); home(); }
          else {
            const p = $('#pdots'); if (!p) return; p.classList.add('shake');
            setTimeout(() => { val = ''; paint(); p.classList.remove('shake'); }, 420);
          }
        }, 120);
      }
    }
    v.querySelector('.keys').onclick = e => { const b = e.target.closest('button[data-k]'); if (b) press(b.dataset.k); };
    cancel.onclick = () => press('back');
    function onKey(e) {
      if (state !== 'passcode') { document.removeEventListener('keydown', onKey); return; }
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('back');
    }
    document.addEventListener('keydown', onKey);
  }

  /* ---------- 아이콘 ---------- */
  const G = (bg, inner) => ({ bg, inner });
  const svgWrap = s => `<svg viewBox="0 0 100 100">${s}</svg>`;
  const wd = () => DAYS[new Date().getDay()], dt = () => new Date().getDate();
  const ICONS = {
    facetime:  { name: 'FaceTime', bg: 'linear-gradient(#5be07a,#1fb84c)', html: () => svgWrap('<rect x="20" y="33" width="38" height="34" rx="9" fill="#fff"/><path d="M62 46l18-10v28L62 54z" fill="#fff"/>') },
    calendar:  { name: '캘린더', bg: '#fff', html: () => `<div style="text-align:center;line-height:1;width:100%"><div style="color:#ff3b30;font-size:.62em;font-weight:600;margin-top:.15em">${wd()}</div><div style="font-size:2.1em;font-weight:300;margin-top:-.05em">${dt()}</div></div>` },
    photos:    { name: '사진', bg: '#fff', html: () => svgWrap('<g opacity=".85"><circle cx="50" cy="30" r="15" fill="#ffb300"/><circle cx="70" cy="42" r="15" fill="#ff7043"/><circle cx="70" cy="62" r="15" fill="#ec407a"/><circle cx="50" cy="73" r="15" fill="#ab47bc"/><circle cx="30" cy="62" r="15" fill="#42a5f5"/><circle cx="30" cy="42" r="15" fill="#66bb6a"/></g>') },
    camera:    { name: '카메라', bg: 'linear-gradient(#8e8e93,#636366)', html: () => svgWrap('<rect x="18" y="32" width="64" height="40" rx="9" fill="#1c1c1e"/><circle cx="50" cy="52" r="13" fill="#3a3a3c" stroke="#fff" stroke-width="3"/><rect x="38" y="25" width="14" height="9" rx="3" fill="#1c1c1e"/>') },
    notes:     { name: '메모', bg: 'linear-gradient(#fff 0 32%,#fff 32%)', html: () => `<div style="position:absolute;inset:0;background:#fff"><div style="height:30%;background:#ffd60a"></div><div style="padding:.55em .6em;"><div style="height:2px;background:#d1d1d6;margin:.35em 0"></div><div style="height:2px;background:#d1d1d6;margin:.35em 0"></div><div style="height:2px;background:#d1d1d6;margin:.35em 0"></div></div></div>` },
    clock:     { name: '시계', bg: '#000', html: () => svgWrap('<circle cx="50" cy="50" r="38" fill="#fff"/><path d="M50 50V25M50 50l15 9" stroke="#000" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="50" r="3" fill="#ff9f0a"/>') },
    maps:      { name: '지도', bg: 'linear-gradient(135deg,#9be3a0,#d7f3dc 55%,#8ec5ff)', html: () => svgWrap('<path d="M50 20a17 17 0 0 1 17 17c0 14-17 33-17 33S33 51 33 37a17 17 0 0 1 17-17z" fill="#ff3b30"/><circle cx="50" cy="37" r="6" fill="#fff"/>') },
    weather:   { name: '날씨', bg: 'linear-gradient(#3a8df5,#74c3ff)', html: () => svgWrap('<circle cx="40" cy="38" r="14" fill="#ffd60a"/><path d="M30 68a13 13 0 0 1 3-25 17 17 0 0 1 32 4 11 11 0 0 1-1 21z" fill="#fff"/>') },
    appstore:  { name: 'App Store', bg: 'linear-gradient(#1fa9ff,#1565f0)', html: () => svgWrap('<text x="50" y="68" font-size="54" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">A</text>') },
    settings:  { name: '설정', bg: 'linear-gradient(#9d9da3,#6a6a70)', html: () => svgWrap('<circle cx="50" cy="50" r="22" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="8 6"/><circle cx="50" cy="50" r="12" fill="#3a3a3c"/>') },
    kakao:     { name: '카카오톡', bg: '#fee500', html: () => svgWrap('<ellipse cx="50" cy="46" rx="29" ry="24" fill="#3c1e1e"/><path d="M36 64l-4 12 14-8z" fill="#3c1e1e"/>') },
    youtube:   { name: 'YouTube', bg: '#fff', html: () => svgWrap('<rect x="14" y="28" width="72" height="44" rx="13" fill="#ff0000"/><path d="M44 39l17 11-17 11z" fill="#fff"/>') },
    instagram: { name: 'Instagram', bg: 'linear-gradient(45deg,#fdc468,#f7774b 30%,#d6249f 60%,#4f5bd5)', html: () => svgWrap('<rect x="24" y="24" width="52" height="52" rx="16" fill="none" stroke="#fff" stroke-width="6"/><circle cx="50" cy="50" r="12" fill="none" stroke="#fff" stroke-width="6"/><circle cx="66" cy="34" r="3.5" fill="#fff"/>') },
    coupang:   { name: '쿠팡', bg: '#fff', html: () => `<div style="font-weight:800;font-size:1.05em;color:#e8291c;letter-spacing:-.05em">쿠팡</div>` },
    netflix:   { name: 'Netflix', bg: '#141414', html: () => svgWrap('<path d="M34 24h10l12 31V24h10v52H56L44 45v31H34z" fill="#e50914"/>') },
    phone:     { name: '전화', bg: 'linear-gradient(#5be07a,#1fb84c)', html: () => svgWrap('<path d="M34 24c-5 2-8 7-6 14 5 18 20 32 38 38 7 2 12-1 14-6l-5-9c-1-2-3-3-5-2l-6 3c-8-3-14-10-17-17l3-6c1-2 0-4-2-5z" fill="#fff"/>') },
    safari:    { name: 'Safari', bg: '#fff', html: () => svgWrap('<circle cx="50" cy="50" r="35" fill="#1a8cff"/><circle cx="50" cy="50" r="35" fill="none" stroke="#dbe9ff" stroke-width="3" stroke-dasharray="2 5"/><path d="M50 50l-9-18 18 9z" fill="#ff3b30" transform="rotate(45 50 50)"/><path d="M50 50l9 18-18-9z" fill="#fff" transform="rotate(45 50 50)"/>') },
    messages:  { name: '메시지', bg: 'linear-gradient(#5be07a,#1fb84c)', html: () => svgWrap('<ellipse cx="50" cy="46" rx="30" ry="24" fill="#fff"/><path d="M33 64l-6 12 15-7z" fill="#fff"/>') },
    music:     { name: '음악', bg: 'linear-gradient(#ff5f7a,#ff2d55)', html: () => svgWrap('<path d="M42 66V32l28-6v34" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><circle cx="35" cy="66" r="8" fill="#fff"/><circle cx="63" cy="60" r="8" fill="#fff"/>') }
  };
  const IMG_ICONS = ['messages', 'music', 'notes', 'settings', 'clock', 'safari', 'camera', 'facetime', 'weather', 'maps', 'photos', 'coupang', 'youtube', 'appstore', 'kakao', 'instagram', 'netflix', 'phone'];
  const ACTIVE = { phone: openPhone, safari: openSafari, messages: openMessages, music: openMusic, photos: openPhotos, notes: openNotes, kakao: openKakao };
  const CLOUD_SVG = '<svg viewBox="0 0 24 24"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5 4 4 0 0 1 17.5 18"/><path d="M12 11v8m-3-3l3 3 3-3"/></svg>';

  function iconBtn(key, showLabel) {
    const cloud = key.startsWith('*'); const id = cloud ? key.slice(1) : key;
    const ic = ICONS[id]; if (!ic) return '';
    const img = IMG_ICONS.includes(id);
    const inner = img ? `<img src="images/icons/${id}.png" alt="" draggable="false">` : ic.html();
    return `<button class="appbtn ${cloud ? 'cloud' : ''}" data-app="${id}"><span class="ico ${img ? 'img' : ''}" style="${img ? '' : 'background:' + ic.bg}">${inner}</span>
      <span class="lbl">${cloud ? CLOUD_SVG : ''}${ic.name}</span></button>`;
  }

  /* ---------- 홈 ---------- */
  function home() {
    state = 'home';
    const rows = D.homeRows.map(r => r.map(k => iconBtn(k)).join('')).join('');
    const v = render(`
      <div class="home wall" style="${wallStyle()}position:absolute;inset:0">
        <div class="grid">${rows}</div>
        <div class="dots"><i></i></div>
        <div class="dockwrap">${D.dock.map(k => iconBtn(k)).join('')}</div>
      </div>`, '', {});
    v.onclick = e => {
      const b = e.target.closest('.appbtn'); if (!b) return;
      const f = ACTIVE[b.dataset.app];
      if (f) f();
      else { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); }
    };
  }
  swipeUp($('#swipezone'), () => { if (state === 'app') home(); else if (state === 'lock') passcode(); });

  /* ---------- 앱 틀 ---------- */
  function appView(o) {
    state = 'app';
    const v = render(`
      <div class="app ${o.cls || ''} ${o.white ? 'white' : ''}" style="position:absolute;inset:0">
        <div class="nav" ${o.hideNav ? 'style="display:none"' : ''}>
          ${o.back ? `<button class="back" id="bk"><b>‹</b>${esc(o.backLabel || '')}</button>` : '<span></span>'}
          <span class="mid">${esc(o.mid || '')}</span>
          <span class="act">${o.act || ''}</span>
        </div>
        ${o.large ? `<div class="large">${esc(o.large)}</div>` : ''}
        <div class="abody" id="abody">${o.body}</div>
        ${o.footer || ''}
      </div>`, '', { darkText: true });
    const bk = v.querySelector('#bk'); if (bk) bk.onclick = o.back;
    if (o.toBottom) { const ab = v.querySelector('#abody'); ab.scrollTop = ab.scrollHeight; }
    return v;
  }

  /* ---------- 전화 ---------- */
  function openPhone(tab) {
    tab = typeof tab === 'string' ? tab : 'recents';
    const I = {
      recents: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="currentColor"/><path d="M12 6.2v6.3H7.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      contacts: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="currentColor"/><circle cx="12" cy="9.3" r="3.5" fill="#fff"/><path d="M5.6 18.6c1-3.3 3.9-4.6 6.4-4.6s5.4 1.3 6.4 4.6a10 10 0 0 1-12.8 0z" fill="#fff"/></svg>',
      keypad: '<svg viewBox="0 0 24 24" fill="currentColor">' + [4,12,20].flatMap(y => [4,12,20].map(x => `<circle cx="${x}" cy="${y}" r="2.4"/>`)).join('') + '</svg>'
    };
    const tabs = [['recents', '통화'], ['contacts', '연락처'], ['keypad', '키패드']];
    const badge = D.missedBadge > 0 ? `<span class="badge">${D.missedBadge}</span>` : '';
    const footer = `<div class="pbar"><div class="tabs">${tabs.map(t => `<button class="tab ${t[0] === tab ? 'on' : ''}" data-t="${t[0]}">${I[t[0]]}${t[0] === 'recents' ? badge : ''}${t[1]}</button>`).join('')}</div>
      <button class="srch" aria-label="검색"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button></div>`;
    let body = '', large = '', act = '', filter = 'all';
    if (tab === 'recents') {
      large = '최근 기록'; act = '편집';
      body = `<div style="padding:0 1.1em .7em"><span class="seg" id="seg"><button data-f="all" class="on">전체</button><button data-f="missed">부재중</button></span></div><div class="list" id="calls"></div>`;
    } else if (tab === 'contacts') {
      large = '연락처';
      const sorted = [...D.contacts].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      let last = '';
      body = `<div class="search">🔍 검색</div><div style="padding:.2em 0">${sorted.map(c => {
        const ch = c.name[0]; let h = '';
        if (ch !== last) { h = `<div class="sec">${esc(ch)}</div>`; last = ch; }
        return h + `<div class="list" style="margin-bottom:.1em;border-radius:0"><div class="crow" data-c="${esc(c.name)}"><span class="nm">${esc(c.name)}</span></div></div>`;
      }).join('')}</div>`;
    } else if (tab === 'keypad') {
      body = `<div class="dial" id="dial"></div><div class="pad">${[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(k => `<button data-k="${k}"><b>${k}</b><small>${LETTERS[k] || ''}</small></button>`).join('')}<button class="call-btn">✆</button></div>`;
    } else if (tab === 'favorites') {
      large = '즐겨찾기'; body = `<div class="empty">즐겨찾기가 없습니다.</div>`;
    } else {
      large = '음성 사서함'; body = `<div class="empty">음성 사서함 없음</div>`;
    }
    const v = appView({ large, act, body, footer, cls: 'pbody' });
    v.querySelector('.pbar .tabs').onclick = e => { const b = e.target.closest('button[data-t]'); if (b) openPhone(b.dataset.t); };

    if (tab === 'recents') {
      const draw = () => {
        const rows = D.recents.filter(r => filter === 'all' || r.t === 'missed');
        $('#calls').innerHTML = rows.map(r => {
          const isContact = D.contacts.some(c => c.name === r.n);
          const sub = (r.t === 'out' ? '↗ ' : '') + (isContact ? '휴대전화' : (r.place || '대한민국'));
          return `<div class="call ${r.t === 'missed' ? 'missed' : ''}"><div class="main"><div class="name">${esc(r.n)}</div><div class="sub">${esc(sub)}</div></div><span class="tm">${fmtRel(r.h)}</span><span class="info">i</span></div>`;
        }).join('') || '<div class="empty" style="padding:2em">부재중 전화가 없습니다.</div>';
      };
      draw();
      v.querySelector('#seg').onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        filter = b.dataset.f;
        v.querySelectorAll('#seg button').forEach(x => x.classList.toggle('on', x === b)); draw();
      };
    }
    if (tab === 'contacts') {
      v.querySelector('#abody').onclick = e => {
        const r = e.target.closest('[data-c]'); if (!r) return;
        const c = D.contacts.find(x => x.name === r.dataset.c);
        const d = appView({ back: () => openPhone('contacts'), backLabel: '연락처', act: '편집', white: false, body: `
          <div class="detail"><div class="avatar">${esc(c.name[0])}</div><h2>${esc(c.name)}</h2>
          <div class="acts"><span><i>💬</i>메시지</span><span><i>✆</i>통화</span><span><i>📹</i>FaceTime</span><span><i>✉</i>메일</span></div>
          <div class="card"><small>휴대전화</small><div>${esc(c.number)}</div></div></div>` });
      };
    }
    if (tab === 'keypad') {
      let num = '';
      v.querySelector('.pad').onclick = e => { const b = e.target.closest('button[data-k]'); if (!b) return; num += b.dataset.k; $('#dial').textContent = num; };
    }
  }

  /* ---------- 문자 ---------- */
  function openMessages() {
    const pins = D.pinned.map(p => `<div class="pin" data-p="${esc(p.id)}"><div class="avatar" ${p.avatar ? `style="background-image:url('${esc(p.avatar)}')"` : ''}>${p.avatar ? '' : esc(p.initial || p.name[0])}</div><span>${esc(p.name)}</span></div>`).join('');
    const rows = D.threads.map((t, i) => `
      <div class="mrow" data-i="${i}"><div class="avatar">👤</div><div class="mm">
        <div class="mn"><span>${esc(t.name)}</span><span>${fmtRel(t.h)}</span></div>
        <div class="pv">${esc(t.messages[t.messages.length - 1].text.replace(/\n/g, ' '))}</div></div></div>`).join('');
    const v = appView({ act: '편집', large: '메시지', body: `<div class="pins">${pins}</div><div style="background:#fff;border-radius:1em 1em 0 0">${rows}</div>` });
    v.querySelector('#abody').onclick = e => {
      const p = e.target.closest('.pin');
      if (p) { const t = D.pinned.find(x => x.id === p.dataset.p); return openThread(t.name, t.messages, null, t.initial || t.name[0], t.avatar); }
      const r = e.target.closest('.mrow'); if (!r) return;
      const t = D.threads[+r.dataset.i]; openThread(t.name, t.messages, t.h);
    };
  }
  function openThread(name, msgs, h, initial, avatar) {
    const stamp = h != null ? `<div class="stamp">${fmtStamp(h)}</div>` : '';
    const bubbles = msgs.map(m => m.stamp ? `<div class="stamp">${esc(m.stamp)}</div>` : `<div class="bub ${m.from === 'me' ? 'me' : 'them'}">${esc(m.text)}</div>`).join('');
    const v = appView({
      back: openMessages, backLabel: '', cls: '', white: true,
      mid: '', toBottom: true,
      body: `<div class="hnav"><div class="avatar" ${avatar ? `style="background-image:url('${esc(avatar)}')"` : ''}>${avatar ? '' : esc(initial || '👤')}</div><small>${esc(name)} ›</small></div><div class="thread">${stamp}${bubbles}</div>`,
      footer: `<div class="compose"><span class="plus">＋</span><span class="field">문자 메시지</span></div>`
    });
  }

  /* ---------- Safari ---------- */
  function openSafari() {
    const recent = [...D.searches].reverse();
    state = 'app';
    const v = render(`
      <div class="app safari" style="position:absolute;inset:0">
        <div class="sf-page" id="sfpage">즐겨찾기가 없습니다</div>
        <div id="sfsugg" style="display:none;flex:1;overflow-y:auto;padding-top:.6em"></div>
        <div class="sf-bar"><input class="sf-field" id="sf" placeholder="검색 또는 웹사이트 이름 입력" autocomplete="off" spellcheck="false"></div>
      </div>`, '', { darkText: true });
    const inp = v.querySelector('#sf'), sugg = v.querySelector('#sfsugg'), pg = v.querySelector('#sfpage');
    const draw = () => {
      const q = inp.value.trim();
      const list = q ? recent.filter(s => s.includes(q)) : recent;
      sugg.innerHTML = `<div class="sec">${q ? '검색어 제안' : '최근 검색'}</div><div class="sf-sugg">${list.map(s => `<div class="crow" data-s="${esc(s)}"><span>🔍</span>${esc(s)}</div>`).join('') || '<div class="crow"><span>🔍</span>' + esc(q) + '</div>'}</div>`;
    };
    inp.onfocus = () => { pg.style.display = 'none'; sugg.style.display = 'block'; draw(); };
    inp.oninput = draw;
    sugg.onclick = e => { const r = e.target.closest('[data-s]'); if (r) { inp.value = r.dataset.s; draw(); } };
    v.onclick = e => { if (e.target === v.firstElementChild || e.target === pg) { inp.blur(); sugg.style.display = 'none'; pg.style.display = 'flex'; } };
  }

  /* ---------- 사진 ---------- */
  function openPhotos() {
    const ps = D.photos;
    const body = ps.length
      ? `<div class="photos">${ps.map((p, i) => `<div data-i="${i}" style="background-image:url('${esc(p.src)}')"></div>`).join('')}</div><div class="pcount">${ps.length}장의 사진</div>`
      : `<div class="empty"><b>사진 또는 비디오 없음</b>사진을 찍거나 동기화하면 여기에 표시됩니다.</div>`;
    const v = appView({ large: '보관함', act: '선택', white: true, body });
    v.querySelector('#abody').onclick = e => {
      const t = e.target.closest('[data-i]'); if (!t) return;
      const p = ps[+t.dataset.i];
      const o = document.createElement('div'); o.className = 'viewer';
      o.innerHTML = `<div class="nav"><button class="back" id="vb"><b>‹</b>보관함</button><span></span><span></span></div><div class="vimg" style="background-image:url('${esc(p.src)}')"></div>
        <div class="vcap"><b>${esc(p.title || '')}</b><span>${esc([p.place, p.date].filter(Boolean).join(' · '))}</span></div>`;
      o.querySelector('#vb').onclick = () => o.remove();
      v.firstElementChild.appendChild(o);
    };
  }

  /* ---------- 메모 ---------- */
  function noteHTML(body) {
    return body.split('\n').map(l => {
      const m = l.match(/^\[( |x)\] ?(.*)$/i);
      if (m) return `<div class="chk ${m[1].toLowerCase() === 'x' ? 'done' : ''}"><i>${m[1].toLowerCase() === 'x' ? '✓' : ''}</i><span>${esc(m[2])}</span></div>`;
      return `<div>${esc(l) || '&nbsp;'}</div>`;
    }).join('');
  }
  function openNotes() {
    const ns = D.notes;
    const body = ns.length
      ? `<div class="list">${ns.map((n, i) => `<div class="nrow" data-i="${i}"><b>${esc(n.title)}</b><span>${esc(n.date || '')} ${esc((n.body || '').split('\n')[0].replace(/^\[( |x)\] ?/i, ''))}</span></div>`).join('')}</div><div class="pcount">${ns.length}개의 메모</div>`
      : `<div class="empty"><b>메모 없음</b></div>`;
    const v = appView({ large: '메모', white: false, body });
    v.querySelector('#abody').onclick = e => {
      const r = e.target.closest('[data-i]'); if (!r) return;
      const n = ns[+r.dataset.i];
      appView({ back: openNotes, backLabel: '메모', white: true, body: `<div class="ntitle">${esc(n.title)}</div><div class="nbody">${noteHTML(n.body || '')}</div>` });
    };
  }

  /* ---------- 음악 ---------- */
  function openMusic() {
    const m = D.music || {};
    let body;
    if (m.url) {
      const emb = m.url.replace('://music.apple.com', '://embed.music.apple.com');
      body = /embed\.music\.apple\.com/.test(emb)
        ? `<iframe src="${esc(emb)}" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"></iframe>`
        : `<div class="mcard"><big>♪</big>${esc(m.title || '플레이리스트')}<br><a style="color:#fff" href="${esc(m.url)}" target="_blank" rel="noopener">열기</a></div>`;
    } else body = `<div class="empty">재생 중인 음악이 없습니다.</div>`;
    appView({ large: '지금 듣기', cls: 'music', white: true, body });
  }

  /* ---------- 카카오톡 ---------- */
  const KI = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    newchat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.5A8 7.5 0 1 1 12 5h3"/><path d="M8 19.5l-2.6 2 .6-3.4"/><path d="M19 2.5v5M16.5 5h5"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8l1.7 1.8 2.5-.4.9 2.4 2.3 1.2-.6 2.5 1.4 2.1-1.8 1.8.1 2.6-2.5.8-1.2 2.3-2.5-.5-2 1.5-2-1.5-2.5.5-1.2-2.3-2.5-.8.1-2.6L2.4 12l1.4-2.1-.6-2.5 2.3-1.2.9-2.4 2.5.4z"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17h12l-1.6-2.2V10a4.4 4.4 0 0 0-8.8 0v4.8z"/><path d="M10 20a2 2 0 0 0 4 0M3.5 3.5l17 17"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.2"/><path d="M4 20.5c.6-4 4-5.6 8-5.6s7.400 1.600 8 5.600z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.500 3 2.500 6.500 2.500 11c0 2.800 1.600 5.200 4 6.700L5.800 21l4.200-2.300c.6.100 1.300.2 2 .2 5.500 0 9.500-3.500 9.500-7.900S17.500 3 12 3z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4C7 4 3 7.300 3 11.500c0 2.200 1 4.100 2.700 5.400L5 20l3.700-2c.7.200 1.500.3 2.300.3 5 0 9-3.300 9-7.500S17 4 12 4zm-1.500 5l4.500 2.800-4.500 2.800z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 8h14l1 12.500H4z"/><path d="M8.500 8V6.500a3.500 3.500 0 0 1 7 0V8" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>'
  };
  function openKakao() {
    const ks = D.kakao, unreadSum = ks.reduce((s, k) => s + (k.unread || 0), 0);
    const rows = ks.map((k, i) => {
      const last = (k.messages && k.messages.length) ? k.messages[k.messages.length - 1] : null;
      const pv = k.preview || (last ? (last.img ? '이모티콘을 보냈습니다.' : last.text) : '');
      return `<div class="krow ${k.open ? 'open' : ''}" data-i="${i}">
        <div class="kav" style="background-image:url('${esc(k.avatar || '')}')"></div>
        <div class="km"><div class="kn"><span class="knm">${esc(k.name)}</span>${k.fav ? `<i class="kfav">${KI.star}</i>` : ''}${k.muted ? `<i class="kmute">${KI.mute}</i>` : ''}</div>
          <div class="kp">${esc(pv)}</div></div>
        <div class="kt"><span>${esc(k.time || '')}</span>${k.unread ? `<b>${k.unread}</b>` : ''}</div></div>`;
    }).join('');
    const v = appView({ cls: 'kk', white: true, hideNav: true, body: `
      <div class="khead"><span class="kttl">채팅</span><span class="kic">${KI.search}${KI.newchat}${KI.gear}</span></div>
      <div class="kchips"><span class="on">전체</span><span>안읽음 ${unreadSum ? `<b>${unreadSum}</b>` : ''}</span><span>통화</span></div>
      <div class="klist">${rows}</div>`,
      footer: `<div class="ktab"><i>${KI.person}</i><i class="on">${KI.chat}${unreadSum ? `<b>${unreadSum}</b>` : ''}</i><i>${KI.play}</i><i>${KI.bag}</i><i>${KI.more}</i></div>` });
    v.querySelector('#abody').onclick = e => {
      const r = e.target.closest('.krow.open'); if (!r) return;
      openKakaoChat(+r.dataset.i);
    };
  }
  function openKakaoChat(i) {
    const k = D.kakao[i], msgs = k.messages || [];
    const t = new Date();
    let html = `<div class="kdate"><span>${t.getFullYear()}년 ${t.getMonth() + 1}월 ${t.getDate()}일 ${DAYS[t.getDay()]}요일</span></div>`;
    msgs.forEach((m, n) => {
      const me = m.from === 'me', prev = msgs[n - 1], next = msgs[n + 1];
      const first = !prev || prev.from !== m.from || prev.time !== m.time;
      const lastOfGroup = !next || next.from !== m.from || next.time !== m.time;
      const body = m.img ? `<img class="kemo" src="${esc(m.img)}" alt="">` : `<div class="kbub">${esc(m.text)}</div>`;
      const time = lastOfGroup ? `<span class="ktm">${esc(m.time || '')}</span>` : '';
      if (me) html += `<div class="kmsg me ${first ? 'first' : ''}">${time}${body}</div>`;
      else html += `<div class="kmsg them ${first ? 'first' : ''}">
        <div class="kpf" style="${first ? `background-image:url('${esc(k.avatar || '')}')` : 'visibility:hidden'}"></div>
        <div class="kcol">${first ? `<div class="kname">${esc(k.name)}</div>` : ''}<div class="krowb">${body}${time}</div></div></div>`;
    });
    appView({ back: openKakao, backLabel: '', mid: k.name, cls: 'kk kchat', white: true,
      act: `<span class="kti">${KI.search}</span>`, toBottom: true,
      body: `<div class="kthread">${html}</div>`,
      footer: `<div class="kinput"><span class="kplus">＋</span><span class="kfield"></span><span class="ksend">#</span></div>` });
  }

  lock();
})();
