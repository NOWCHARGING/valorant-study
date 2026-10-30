# VALORANT Study Protocol — 테스트 버전 1.2.1

## 이번 수정 내용
- 프런트엔드가 보내는 Gemini 요청(`contents`, `systemInstruction`, `generationConfig`)과 서버리스 API의 계약을 통일했습니다.
- 실제 Vercel 경로인 `api/gemini.js`를 추가했습니다.
- API 키는 서버 환경변수 `GEMINI_API_KEY`에서만 읽습니다.
- 모델 이름을 프런트엔드 기본값과 맞췄습니다. 필요하면 `GEMINI_MODEL` 환경변수로 변경할 수 있습니다.
- 요청 시간, 전체 시간, 시도 횟수를 브라우저 콘솔에 기록하고 30초 요청 제한 및 오류 메시지를 추가했습니다.
- Vercel 프록시를 기본 연결 모드로 설정했습니다.

## 가장 쉬운 실행 방법: Vercel 배포
1. 이 폴더의 파일을 GitHub 저장소에 올립니다. `api/gemini.js`는 반드시 `api` 폴더 안에 있어야 합니다.
2. Vercel에서 해당 저장소를 프로젝트로 가져옵니다.
3. Project Settings → Environment Variables에 `GEMINI_API_KEY`를 등록합니다.
4. 필요하면 `GEMINI_MODEL`을 등록합니다. 기본값은 `gemini-3-flash-preview`입니다.
5. Deploy 후 웹 주소로 접속합니다.

## 로컬 실행
1. Node.js가 설치된 컴퓨터에서 이 폴더를 엽니다.
2. 터미널에서 `npm install`을 실행합니다.
3. `.env.local` 파일을 만들고 다음 줄을 넣습니다.
   `GEMINI_API_KEY=여기에_본인의_API_키`
4. `npm run dev`를 실행하고 터미널에 표시된 로컬 주소를 엽니다.

> API 키를 `index.html`에 넣거나 GitHub에 직접 작성하지 마세요. `.env.local`은 공개 저장소에 올리지 마세요.

## 첫 테스트 체크리스트
- [ ] 화면이 열리고 레이아웃이 깨지지 않는다.
- [ ] 과목과 단원을 선택할 수 있다.
- [ ] AI 문제 생성 버튼을 누르면 요청이 발생한다.
- [ ] AI 응답이 오면 문제와 선택지가 표시된다.
- [ ] 정답/해설과 학습 진행 기록이 정상 작동한다.
- [ ] 실패 시 개발자 도구 Console에 `[AI]` 시간 기록과 오류가 보인다.

## 참고
- 브라우저에서 `index.html` 파일만 직접 열면 `/api/gemini` 서버리스 경로가 존재하지 않으므로 AI 호출은 성공하지 않습니다. Vercel 배포 또는 `vercel dev`로 실행하세요.
- 기존 UI의 일부 동작은 AI 연결에 실패하면 내장 예시 문제로 폴백하도록 되어 있습니다. 테스트 시 Console과 Network 탭도 함께 확인하세요.
