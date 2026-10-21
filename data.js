/* ============================================================
   내용은 여기서 바꾸면 돼요
   - 글자만 고치면 됩니다. 따옴표(" ")와 쉼표(,)는 지우지 마세요.
   - 사진은 images/ 폴더에 넣고 경로만 적으세요. (예: "images/a.jpg")
   - 시간은 "몇 시간 전"(h)으로 적어요. 보는 사람의 휴대폰 시간 기준으로
     '오후 3:12 / 어제 / 월요일 / 2026. 10. 3.' 처럼 자동으로 바뀌어요.
   ============================================================ */

const DATA = {
  owner: "주선혜",
  passcode: "0223",
  carrier: "SKT",           // 잠금화면 왼쪽 위에 보이는 통신사
  missedBadge: 6,           // 전화 앱 '통화' 탭의 빨간 숫자 (0이면 안 보임)
  wallpaper: "",            // 비우면 검은색 단색. 사진을 쓰려면 "images/wall.jpg"

  /* ---------- 홈 화면 ----------
     앞에 *를 붙이면 '오래 안 써서 아이클라우드 다운로드 표시가 생긴 앱'이에요.
     쓸 수 있는 이름: facetime photos camera notes clock maps weather
                      appstore settings kakao youtube instagram coupang netflix */
  homeRows: [
    ["*facetime", "photos",    "camera",   "notes"],
    ["clock",     "*maps",     "*weather", "appstore"],
    ["settings",  "kakao",     "youtube",  "instagram"],
    ["coupang",   "netflix"]
  ],
  dock: ["phone", "safari", "messages", "music"],

  /* ---------- 전화: 연락처 ---------- */
  contacts: [
    { name: "지우♡",  number: "010-0000-0223" },
    { name: "어머니", number: "010-0000-0505" }
  ],

  /* ---------- 전화: 최근 기록 (위가 최근) ----------
     t: in(수신) / out(발신) / missed(부재중),  h: 몇 시간 전
     맨 위 한 화면은 전부 지우♡, 그 아래 오래된 기록은 070·국제전화(일 관련) */
  recents: [
    { n: "지우♡", t: "in",     h: 0.4 },
    { n: "지우♡", t: "out",    h: 1.5 },
    { n: "지우♡", t: "missed", h: 3.2 },
    { n: "지우♡", t: "out",    h: 6 },
    { n: "지우♡", t: "in",     h: 9.5 },
    { n: "지우♡", t: "out",    h: 27 },
    { n: "지우♡", t: "in",     h: 30 },
    { n: "지우♡", t: "missed", h: 33 },
    { n: "지우♡", t: "out",    h: 50 },
    { n: "지우♡", t: "in",     h: 53 },
    { n: "지우♡", t: "out",    h: 74 },
    { n: "지우♡", t: "missed", h: 77 },
    { n: "지우♡", t: "in",     h: 98 },
    { n: "지우♡", t: "out",    h: 122 },
    { n: "지우♡", t: "in",     h: 146 },
    { n: "지우♡", t: "out",    h: 170 },
    { n: "070-0412-8831",      t: "missed", h: 215, place: "대한민국" },
    { n: "+1 202-555-0143",    t: "in",     h: 260, place: "미국" },
    { n: "070-0731-2046",      t: "missed", h: 310, place: "대한민국" },
    { n: "+44 7700 900318",    t: "missed", h: 380, place: "영국" },
    { n: "+81 90-0000-4417",   t: "in",     h: 450, place: "일본" },
    { n: "070-0188-5509",      t: "out",    h: 520, place: "대한민국" }
  ],

  /* ---------- Safari ----------
     즐겨찾기는 없음. 검색기록은 오래된 것 → 최근 순으로 적으세요. */
  searches: ["리락쿠마", "아기치타", "햄스터 분양", "20대 커플링", "남자친구 선물"],

  /* ---------- 문자 ----------
     pinned: 상단에 고정된 대화 (messages에 대화 내용을 넣을 수 있어요)
     threads: 목록. h = 몇 시간 전 */
  pinned: [
    { id: "jiwoo", name: "우지우", initial: "우", avatar: "images/jiwoo.jpg",
    messages: [
      { stamp: "그저께 오후 9:41" },
      { from: "them", text: "바보" },
      { from: "me",   text: "ㅎㅎ" },
      { stamp: "어제 오전 8:52" },
      { from: "them", text: "멍청아" },
      { from: "me",   text: "지우는 바보" },
      { from: "them", text: "아닌데" },
      { from: "me",   text: "맞는데" },
      { from: "them", text: "형이 더" },
      { from: "them", text: "바보" },
      { from: "them", text: "똥개" },
      { from: "them", text: "해삼 말미잘" },
      { from: "me",   text: "지ㅜ가 더" },
      { from: "them", text: "지ㅜ" },
      { from: "me",   text: "지우" },
      { stamp: "오늘 오전 7:18" },
      { from: "me",   text: "사랑해" },
      { from: "them", text: "ㅋ" },
      { from: "them", text: "나도" }
    ] }
  ],
  threads: [
    { name: "+82 2-0000-1204", h: 2,
      messages: [{ from: "them", text: "[Web발신]\n****치과입니다.\n주선혜님의 예약은 10월 24일(토) 오후 2시 30분입니다.\n변경이 필요하시면 전화 부탁드립니다." }] },
    { name: "+82 10-0000-3345", h: 20,
      messages: [{ from: "them", text: "[Web발신]\n[한진택배]\n안녕하세요. 한진택배입니다.\n고객님의 물품을 금일 중 배송 예정입니다. 부재 시 문 앞에 놓아드리겠습니다." }] },
    { name: "+82 10-0000-7782", h: 45,
      messages: [{ from: "them", text: "[Web발신]\n[CJ대한통운_배송완료]\n일요일에도 신속하게!!\n고객님의 상품이 문 앞에 배송 완료되었습니다." }] },
    { name: "+82 2-0000-9019", h: 100,
      messages: [{ from: "them", text: "[외교부] 해외위급 상황 발생 시 영사안전콜센터로 연락하시기 바랍니다. 해외 체류 중 안전에 유의하세요." }] },
    { name: "어머니", h: 140,
      messages: [{ from: "them", text: "얼굴 좀 비추지" }] },
    { name: "+82 1588-0000", h: 400,
      messages: [{ from: "them", text: "[Web발신]\n(광고)[현대카드] 회원님, 요청하신 수신거부 처리가 정상적으로 완료되었습니다." }] }
  ],

  /* ---------- 사진 (추후 첨부) ----------
     예: { src: "images/01.jpg", title: "제목", date: "2026. 9. 11.", place: "장소" } */
  photos: [
    { src: "images/photos/p01.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p02.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p03.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p04.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p05.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p06.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p07.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p08.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p09.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p10.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p11.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p12.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p13.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p14.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p15.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p16.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p17.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p18.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p19.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p20.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p21.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p22.jpg", title: "", date: "", place: "" },
    { src: "images/photos/p23.jpg", title: "", date: "", place: "" }
  ],

  /* ---------- 메모 (추후 첨부) ----------
     본문 줄 앞에 "[ ] " 를 붙이면 체크리스트, "[x] " 는 체크된 항목이에요.
     예: { title: "제목", date: "2026. 10. 3.", body: "첫 줄\n[ ] 할 일\n[x] 한 일" } */
  notes: [
    { title: "오늘 살 거", date: "오후 10:34",
      body: "라면\n지우 간식\n킷캣?\n무화과\n요거트\n뭐 사지...\n리락쿠마 수면양말 ㅎㅎ\n지우 수면안대\n핫팩\n음 리락쿠마 수면양말부터 사야지" }
  ],

  /* ---------- 음악 (유튜브 플레이리스트 연동) ----------
     url에 유튜브(또는 애플뮤직) 플레이리스트 링크를 붙여넣으면 앱 안에서 재생돼요. */
  music: { title: "", url: "https://youtube.com/playlist?list=PLcoWEBXabJHI&si=m4h5EgSiu2URd2Ol" },

  /* ---------- 카카오톡 ----------
     open: true 인 대화방만 눌러서 열려요. fav=즐겨찾기 별, muted=알림 끔, unread=안 읽은 개수 */
  kakao: [
    { name: "지우♡", avatar: "images/kakao/jiwoo.jpg", fav: true, time: "오후 2:10", open: true,
      messages: [
        { from: "them", text: "오늘 따뜻하게 입어", time: "오전 11:00" },
        { from: "me",   text: "지우도", time: "오전 11:30" },
        { from: "them", text: "따뜻하게", time: "오전 11:50" },
        { from: "them", text: "목도리 두르고", time: "오전 11:50" },
        { from: "them", text: "패딩 입고", time: "오전 11:50" },
        { from: "them", text: "콧물", time: "오전 11:50" },
        { from: "them", text: "흘리지 말고", time: "오전 11:50" },
        { from: "me",   text: "콧물 안 흘려 바보", time: "오전 11:50" },
        { from: "me",   text: "지우야아", time: "오전 11:50" },
        { from: "me",   text: "학교 잘 다녀와", time: "오전 11:50" },
        { from: "me",   text: "사랑해", time: "오전 11:50" },
        { from: "them", img: "images/emoticon.png", time: "오후 1:30" },
        { from: "me",   text: "바보", time: "오후 1:31" },
        { from: "me",   text: "지우 주려고 쿠키 굽고 있어", time: "오후 1:31" },
        { from: "me",   text: "얼른 와 ㅎㅎ", time: "오후 1:31" },
        { from: "me",   text: "벌써 보고 싶어", time: "오후 2:10" }
      ] },
    { name: "김실장", avatar: "images/kakao/kim.jpg", muted: true, time: "오후 1:22",
      preview: "인터뷰 때 너무 딴길로 새지 마시고 아까 보내드린 모범 답안 위주로 ..." },
    { name: "카카오톡", avatar: "images/icons/kakao.png", time: "오전 10:05",
      preview: "[PC버전 자동로그인]" },
    { name: "카카오톡 선물하기", avatar: "images/icons/kakao.png", time: "어제",
      preview: "상품 유효기간이 7일 남았습니다. 유효기간 만료 전 사용하시거나 선물함에..." },
    { name: "이지환 선생님", avatar: "images/kakao/lee.jpg", unread: 1, time: "어제",
      preview: "선혜야~ 이번에 윤이상 준비하는 제자가 잠깐 연습하는 거 참관 ..." },
    { name: "쿠팡", avatar: "images/kakao/coupang.jpg", time: "어제",
      preview: "[쿠팡] 구매하신 상품은 어떠셨나요? ..." },
    { name: "김주영", avatar: "images/kakao/jy.jpg", unread: 1, time: "10월 19일",
      preview: "선혜야 나 기억나? 카톡 친구보고 생각나서 연락 ..." },
    { name: "정부24", avatar: "images/kakao/gov24.jpg", time: "10월 14일",
      preview: "메시지가 도착했습니다." }
  ]
};
