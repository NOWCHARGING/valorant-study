<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>VALO-STUDY // Ver 1.2 Final</title>
  <style>
    :root {
      --bg-dark: #0f1923;
      --card-bg: #1f2731;
      --valo-red: #ff4655;
      --valo-cyan: #00f5d4;
      --text-light: #ece8e1;
      --text-dim: #8b978f;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    html, body {
      width: 100%;
      height: 100dvh;
      overflow-x: hidden;
      background-color: var(--bg-dark);
      color: var(--text-light);
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      flex-direction: column;
    }
    /* 상단 상태바 */
    header {
      padding: 14px 18px;
      background: #17212b;
      border-bottom: 2px solid var(--valo-red);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .logo {
      font-weight: 900;
      font-size: 1.15rem;
      letter-spacing: 1px;
      color: var(--valo-red);
      cursor: pointer;
    }
    .streak-badge {
      background: rgba(0, 245, 212, 0.12);
      border: 1px solid var(--valo-cyan);
      color: var(--valo-cyan);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    /* 중앙 싱글뷰 영역 */
    main {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    .tab-section {
      display: none;
      animation: fadeIn 0.2s ease-in-out;
    }
    .tab-section.active {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    /* 카드 디자인 */
    .card {
      background: var(--card-bg);
      border-left: 4px solid var(--valo-red);
      padding: 18px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 1.05rem;
      font-weight: 800;
      margin-bottom: 10px;
      color: var(--valo-cyan);
    }
    .timer-display {
      font-size: 3.2rem;
      font-weight: 900;
      text-align: center;
      margin: 16px 0;
      letter-spacing: 2px;
      color: var(--text-light);
    }
    .btn-group {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    button {
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 4px;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      transition: 0.15s;
    }
    .btn-red {
      background: var(--valo-red);
      color: #fff;
    }
    .btn-red:disabled {
      background: #553338;
      color: #999;
      cursor: not-allowed;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--valo-cyan);
      color: var(--valo-cyan);
    }
    .btn-outline.selected {
      background: var(--valo-cyan);
      color: #0f1923;
    }
    select, input, textarea {
      width: 100%;
      padding: 12px;
      margin-bottom: 10px;
      background: #111820;
      border: 1px solid #3a4754;
      color: var(--text-light);
      border-radius: 4px;
      font-size: 0.95rem;
    }
    /* 문제 카드 */
    .q-badge {
      display: inline-block;
      padding: 2px 8px;
      font-size: 0.75rem;
      font-weight: 800;
      background: var(--valo-red);
      color: #fff;
      border-radius: 2px;
      margin-bottom: 8px;
    }
    .q-text {
      font-size: 1rem;
      line-height: 1.45;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .opt-btn {
      text-align: left;
      background: #141c24;
      border: 1px solid #2c3844;
      color: var(--text-light);
      padding: 11px 12px;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .opt-btn.correct {
      border-color: var(--valo-cyan);
      background: rgba(0, 245, 212, 0.15);
      color: var(--valo-cyan);
      font-weight: 800;
    }
    .opt-btn.wrong {
      border-color: var(--valo-red);
      background: rgba(255, 70, 85, 0.15);
    }
    .cypher-box {
      margin-top: 10px;
      padding: 12px;
      background: rgba(0, 245, 212, 0.08);
      border-left: 3px solid var(--valo-cyan);
      font-size: 0.88rem;
      line-height: 1.4;
      display: none;
    }
    /* 하단 네비게이션 바 */
    nav {
      display: flex;
      background: #17212b;
      border-top: 1px solid #2b3744;
      flex-shrink: 0;
    }
    .nav-item {
      flex: 1;
      padding: 12px 0;
      text-align: center;
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--text-dim);
      background: none;
      border-radius: 0;
    }
    .nav-item.active {
      color: var(--valo-cyan);
      border-top: 3px solid var(--valo-cyan);
      background: rgba(0, 245, 212, 0.05);
    }
    .cost-info {
      font-size: 0.78rem;
      color: var(--text-dim);
      margin-top: 6px;
      text-align: center;
    }
  </style>
</head>
<body>

  <header>
    <div class="logo" onclick="switchTab('tab-timer', document.querySelectorAll('.nav-item')[0])">VALO-STUDY // V1.2</div>
    <div class="streak-badge" id="streakCount">⚡ 1일 연속 달성</div>
  </header>

  <main>
    <!-- 탭 1: 전술 타이머 -->
    <section id="tab-timer" class="tab-section active">
      <div class="card">
        <div class="card-title">🎯 오늘의 전술 모드 선택</div>
        <div class="btn-group">
          <button class="btn-outline selected" id="mode15" onclick="setTimerMode(15)">🛡️ 15분 방어선 (복습)</button>
          <button class="btn-outline" id="mode30" onclick="setTimerMode(30)">⚔️ 30분 공격선 (딥러닝)</button>
        </div>
        <div class="timer-display" id="timerDisplay">15:00</div>
        <div class="btn-group">
          <button class="btn-red" id="startBtn" onclick="toggleTimer()">작전 시작 (START)</button>
          <button class="btn-outline" onclick="resetTimer()">초기화</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📸 학교 노트/학습 인증 (Vision)</div>
        <p style="font-size:0.88rem; color:#ccc; margin-bottom:10px;">오늘 학교나 학원에서 배운 교과서, 필기 사진을 찍어 올려 기록을 남기세요.</p>
        <input type="file" accept="image/*" capture="environment" id="studyPhoto" onchange="handlePhotoUpload(event)" />
        <div id="photoStatus" style="font-size:0.85rem; color:var(--valo-cyan); margin-top:6px;"></div>
      </div>
    </section>

    <!-- 탭 2: AI 훈련소 -->
    <section id="tab-ai" class="tab-section">
      <div class="card">
        <div class="card-title">🤖 내신 함정 3문제 (실시간 생성)</div>
        <select id="subjectSelect">
          <option value="수학">수학 (중3 내신)</option>
          <option value="영어">영어 (중3 문법/독해)</option>
          <option value="과학">과학 (중3 핵심)</option>
          <option value="역사">역사 (중3 핵심)</option>
        </select>
        <input type="text" id="topicInput" placeholder="단원명 입력 (예: 원주각의 성질, 관계대명사)" value="원주각의 성질" />
        <button class="btn-red" id="genBtn" onclick="generateQuestions()">⚡ AI 문제 출제하기</button>
        <div class="cost-info" id="cacheNotice">💾 생성된 문제는 자동 저장되어 새로고침해도 토큰이 소모되지 않습니다.</div>
      </div>

      <div id="quizContainer"></div>
    </section>

    <!-- 탭 3: 작전 보고 -->
    <section id="tab-report" class="tab-section">
      <div class="card">
        <div class="card-title">📊 오늘의 작전 수행 기록</div>
        <p style="margin-bottom: 12px; font-size:0.95rem; line-height:1.6;">
          • 공부 소요 시간: <b id="studyTimeSpent" style="color:var(--valo-cyan)">0분 0초</b><br/>
          • 노트 인증 상태: <b id="photoCertStatus" style="color:#aaa">미인증</b><br/>
          • 문제 풀이 점수: <b id="solvedCount" style="color:var(--valo-cyan)">0</b> / 3 정답 적중
        </p>
        <button class="btn-red" onclick="sendKakaoReport()">💬 부모님 카톡으로 최종 브리핑 전송</button>
      </div>
    </section>
  </main>

  <nav>
    <button class="nav-item active" onclick="switchTab('tab-timer', this)">⏱️ 타이머</button>
    <button class="nav-item" onclick="switchTab('tab-ai', this)">🔫 AI 훈련소</button>
    <button class="nav-item" onclick="switchTab('tab-report', this)">📡 작전 보고</button>
  </nav>

  <script>
    // 싱글뷰 탭 전환 로직
    function switchTab(tabId, btnEl) {
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      if (btnEl) btnEl.classList.add('active');
    }

    // 타이머 및 소요 시간 측정 로직
    let timeLeft = 15 * 60;
    let timerId = null;
    let currentMode = 15;
    let secondsElapsed = 0; // 아이가 공부한 실제 소요 시간 누적

    function setTimerMode(min) {
      if (timerId) toggleTimer();
      currentMode = min;
      timeLeft = min * 60;
      document.getElementById('mode15').classList.toggle('selected', min === 15);
      document.getElementById('mode30').classList.toggle('selected', min === 30);
      updateTimerDisplay();
    }

    function updateTimerDisplay() {
      const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const s = String(timeLeft % 60).padStart(2, '0');
      document.getElementById('timerDisplay').textContent = `${m}:${s}`;
    }

    function toggleTimer() {
      const btn = document.getElementById('startBtn');
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
        btn.textContent = '작전 재개 (RESUME)';
      } else {
        btn.textContent = '일시 정지 (PAUSE)';
        timerId = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            secondsElapsed++;
            updateTimerDisplay();
          } else {
            clearInterval(timerId);
            timerId = null;
            alert('🎉 목표 시간 달성! AI 훈련소로 이동하여 문제를 풀어보세요.');
            // 요청사항 1: 타이머 완료 시 AI 훈련소로 자동 전환
            switchTab('tab-ai', document.querySelectorAll('.nav-item')[1]);
          }
        }, 1000);
      }
    }

    function resetTimer() {
      if (timerId) toggleTimer();
      timeLeft = currentMode * 60;
      document.getElementById('startBtn').textContent = '작전 시작 (START)';
      updateTimerDisplay();
    }

    // 노트/사진 인증 처리
    function handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        document.getElementById('photoStatus').textContent = `✅ 인증 완료: ${file.name}`;
        document.getElementById('photoCertStatus').textContent = '인증 완료 (사진 등록됨)';
        document.getElementById('photoCertStatus').style.color = 'var(--valo-cyan)';
      }
    }

    // AI 문제 생성 및 쿨타임 제거
    let solved = 0;
    let correct = 0;

    window.addEventListener('DOMContentLoaded', () => {
      const savedQuiz = localStorage.getItem('valo_cached_quiz');
      if (savedQuiz) {
        renderQuiz(JSON.parse(savedQuiz));
        document.getElementById('cacheNotice').textContent = '💾 캐시된 문제 로드 완료 (토큰 소모 없음)';
      }
    });

    async function generateQuestions() {
      const subject = document.getElementById('subjectSelect').value;
      const topic = document.getElementById('topicInput').value.trim();
      const btn = document.getElementById('genBtn');

      if (!topic) return alert('단원명을 입력해주세요!');

      btn.disabled = true;
      btn.textContent = '⏳ 사이퍼가 문제를 설계 중...';

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, topic })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || '오류 발생');

        localStorage.setItem('valo_cached_quiz', JSON.stringify(data.questions));
        solved = 0;
        correct = 0;
        updateScoreBoard();
        renderQuiz(data.questions);

        // 요청사항 3: 30초 강제 대기 제거, 곧바로 다시 출제 가능하도록 버튼 복구
        btn.disabled = false;
        btn.textContent = '⚡ 새 문제 출제하기';
        document.getElementById('cacheNotice').textContent = '✅ 최신 문제 생성 완료';

      } catch (err) {
        alert('문제 생성 실패: ' + err.message);
        btn.disabled = false;
        btn.textContent = '⚡ AI 문제 출제하기';
      }
    }

    function renderQuiz(questions) {
      const container = document.getElementById('quizContainer');
      container.innerHTML = '';

      questions.forEach((item, qIdx) => {
        const card = document.createElement('div');
        card.className = 'card';

        let optionsHtml = '';
        item.options.forEach((opt, oIdx) => {
          optionsHtml += `<button class="opt-btn" onclick="checkAnswer(${qIdx}, ${oIdx}, ${item.ans}, this)">${oIdx + 1}) ${opt}</button>`;
        });

        card.innerHTML = `
          <span class="q-badge">난이도: ${item.level}</span>
          <div class="q-text">Q${qIdx + 1}. ${item.q}</div>
          <div>${optionsHtml}</div>
          <div class="cypher-box" id="feedback-${qIdx}"></div>
        `;
        container.appendChild(card);
      });
    }

    window.checkAnswer = function(qIdx, selectedIdx, ansIdx, btnEl) {
      const questions = JSON.parse(localStorage.getItem('valo_cached_quiz'));
      const item = questions[qIdx];
      const feedbackBox = document.getElementById(`feedback-${qIdx}`);
      const parentCard = btnEl.parentElement;

      feedbackBox.style.display = 'block';

      if (selectedIdx === ansIdx) {
        btnEl.classList.add('correct');
        feedbackBox.innerHTML = `🎯 <b>정답 적중!</b><br/>${item.exp}`;
        if (!parentCard.dataset.done) {
          solved++;
          correct++;
          parentCard.dataset.done = 'true';
        }
      } else {
        btnEl.classList.add('wrong');
        feedbackBox.innerHTML = `🕵️‍♂️ <b>사이퍼의 힌트:</b><br/>"${item.hint}"`;
        if (!parentCard.dataset.done) {
          solved++;
          parentCard.dataset.done = 'true';
        }
      }
      updateScoreBoard();
    };

    function updateScoreBoard() {
      document.getElementById('solvedCount').textContent = correct;
      const minVal = Math.floor(secondsElapsed / 60);
      const secVal = secondsElapsed % 60;
      document.getElementById('studyTimeSpent').textContent = `${minVal}분 ${secVal}초`;
    }

    // 카카오톡 리포트 전송 모의 함수 (Step 4 연동용)
    function sendKakaoReport() {
      const minVal = Math.floor(secondsElapsed / 60);
      const secVal = secondsElapsed % 60;
      alert(`[카카오톡 알림톡 전송 완료]\n\n• 총 학습 시간: ${minVal}분 ${secVal}초\n• 문제 정답 수: ${correct} / 3\n• 부모님 카톡으로 요약 리포트가 전송되었습니다!`);
    }
  </script>
</body>
</html>
