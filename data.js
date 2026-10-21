/* ============================================================
   ✏️ 여기만 고치면 됩니다! (캐릭터 정보 / 앱 내용)
   - 이미지는 images/ 폴더에 넣고 경로만 적으세요. 비워두면 이모지/색으로 대체됩니다.
   - 문자열은 반드시 따옴표("")로 감싸고, 항목 사이에는 쉼표(,)를 넣어주세요.
   ============================================================ */

const PHONE = {
  owner: "하 린",              // 휴대폰 주인(자캐) 이름
  wallpaper: "",               // 배경화면 이미지 경로 (예: "images/wall.jpg"), 비우면 그라데이션
  wallpaperGradient: "linear-gradient(160deg,#2b2d42,#8d99ae)",
  lockMessage: "엿보지 마세요 👀",   // 처음 잠금화면 문구
  password: "0412",            // 잠금 비밀번호 (빈 문자열 "" 이면 잠금 없음)
  passwordHint: "힌트: 생일(월일)", // 비밀번호 힌트 (원치 않으면 "")
  accent: "#4f8cff"
};

/* 홈 화면에 보일 앱 (apps에 없는 건 자동으로 숨김) */
const HOME_APPS = ["messenger", "gallery", "memo", "search", "music", "contacts", "calendar", "twt"];

/* ---------- 메신저 ---------- */
const MESSENGER = [
  {
    name: "엄마", avatar: "👩", time: "오후 6:12",
    messages: [
      { from: "them", text: "밥은 먹고 다니니?" },
      { from: "me",   text: "응 먹었어" },
      { from: "them", text: "거짓말. 사진 보내봐" },
      { from: "me",   text: "…나중에" }
    ]
  },
  {
    name: "단짝 ☆", avatar: "🐱", time: "오후 3:40",
    messages: [
      { from: "them", text: "야 오늘 갈 거지?" },
      { from: "me",   text: "당연하지ㅋㅋ 늦으면 먼저 들어가 있어" },
      { from: "them", text: "ㅇㅋ 자리 맡아둠" },
      { from: "me",   text: "고마워 ㅠㅠ 커피는 내가 살게" }
    ]
  },
  {
    name: "모르는 번호", avatar: "❓", time: "어제",
    messages: [
      { from: "them", text: "기억해?" },
      { from: "me",   text: "…누구세요" }
    ]
  }
];

/* ---------- 갤러리 (image 경로를 넣으면 사진으로 표시) ---------- */
const GALLERY = [
  { image: "", emoji: "🌆", caption: "퇴근길 노을" },
  { image: "", emoji: "🍜", caption: "야식 인증" },
  { image: "", emoji: "🐈", caption: "길고양이" },
  { image: "", emoji: "🌧️", caption: "비 오는 날" },
  { image: "", emoji: "📚", caption: "읽다 만 책" },
  { image: "", emoji: "🎆", caption: "불꽃놀이" }
];

/* ---------- 메모 ---------- */
const MEMOS = [
  { title: "할 일", body: "- 월세 이체\n- 택배 찾기\n- 전화 답장 (미루는 중)" },
  { title: "아무한테도 말 안 한 것", body: "사실 그날 일은 아직도 꿈에 나온다.\n그래도 괜찮은 척하는 건 이제 익숙하다." },
  { title: "가사 메모", body: "새벽 세 시의 창가에서\n아무도 모르게 웃었어" }
];

/* ---------- 검색 기록 ---------- */
const SEARCH_HISTORY = [
  "잠 안 올 때 하는 것",
  "고양이 간식 추천",
  "그 사람 요즘 뭐함",
  "심야 영화 상영",
  "오래된 흉터 연고",
  "이사 비용 견적"
];

/* ---------- 음악 (재생목록) ---------- */
const MUSIC = {
  nowPlaying: { title: "새벽 세 시", artist: "이름 모를 밴드", emoji: "🎧" },
  playlist: [
    "새벽 세 시 — 이름 모를 밴드",
    "Blue Hour — Lumi",
    "작은 방 — 오래된 필름",
    "Run Away — NOVA"
  ]
};

/* ---------- 연락처 ---------- */
const CONTACTS = [
  { name: "엄마",       number: "010-1234-5678" },
  { name: "단짝 ☆",     number: "010-2222-3333" },
  { name: "편의점 사장님", number: "010-9876-5432" },
  { name: "(이름 없음)", number: "010-0000-0000" }
];

/* ---------- 캘린더 ---------- */
const CALENDAR = [
  { date: "10/25", title: "병원 예약" },
  { date: "10/28", title: "단짝 생일 🎂" },
  { date: "11/03", title: "??? (지우지 못한 일정)" }
];

/* ---------- 트위터 같은 SNS (비공개 계정 느낌) ---------- */
const TWT = {
  handle: "@rin_nocturne",
  posts: [
    { text: "오늘도 무사히 퇴근. 칭찬해줘.", time: "3시간 전" },
    { text: "비 오는 날이 좋은 이유: 아무도 안 나와서.", time: "어제" },
    { text: "(삭제된 트윗)", time: "3일 전" }
  ]
};
