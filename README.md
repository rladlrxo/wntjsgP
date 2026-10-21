# 자캐 휴대폰 엿보기

정적 사이트(HTML/CSS/JS)라 서버 없이 GitHub Pages로 바로 올릴 수 있어요.

## 고치는 곳
**`data.js` 한 파일만** 수정하면 됩니다. (이름, 잠금 비밀번호, 대화, 메모, 검색 기록 등)
- 사진/배경화면은 `images/` 폴더를 만들어 넣고 `data.js`에 경로를 적으세요. (예: `"images/photo1.jpg"`)
- 홈 화면에 보일 앱은 `HOME_APPS`에서 빼거나 순서를 바꾸면 돼요.
- 잠금을 없애려면 `password: ""`

## GitHub Pages로 올리기
1. GitHub에서 새 저장소 만들기 (예: `my-phone`)
2. 이 폴더의 파일 전부 업로드 (`index.html`, `style.css`, `script.js`, `data.js`)
3. 저장소 **Settings → Pages → Branch: main / (root)** 저장
4. 1~2분 뒤 `https://내아이디.github.io/my-phone/` 에서 확인

## 미리보기
`index.html`을 브라우저로 열면 바로 동작합니다.
