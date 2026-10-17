# Security Rules (보안 규칙 표준)

이 프로젝트는 관광 및 대중교통 무장애 여행 서비스로서 사용자의 안전한 브라우징과 시스템 자산 보호를 위해 다음 보안 표준을 엄격히 준수합니다.

---

## 1. 비밀키 및 자격 증명 보호 (Secret Management)
- **절대 클라이언트 노출 금지**:
  - `GEMINI_API_KEY`, `KOREA_TOUR_API_KEY`, `NAVER_CLIENT_SECRET`, `TOUR_API_SERVICE_KEY` 등 비밀키는 반드시 서버 사이드(`server.ts`, `.env`)에서만 로드하며, 절대 `src/` 내 클라이언트 번들에 포함시키지 않습니다.
  - 클라이언트 번들에 노출되는 환경변수는 오직 공개 목적인 `VITE_` 접두사 변수(예: `VITE_GOOGLE_MAPS_API_KEY`, Firebase 공개 설정)로 엄격히 제한합니다.
- **Git 커밋 유출 방지**:
  - `.env`, `service-account*.json`, 개인 키(`*.pem`), 토큰 파일 등은 반드시 `.gitignore`에 등록되어 커밋되지 않도록 검증합니다.
  - 가짜 또는 테스트용 키라도 저장소에 평문으로 하드코딩하지 않습니다.

---

## 2. 입력값 검증 및 XSS / Injection 방지
- **HTML 삽입 제한**:
  - React에서 `dangerouslySetInnerHTML`의 사용을 원칙적으로 금지합니다.
  - 불가피하게 사용할 경우 반드시 검증 라이브러리(DOMPurify 등)를 통해 스크립트 태그와 이벤트 핸들러를 완벽히 소독(sanitize)한 후 렌더링합니다.
- **사용자 입력 필터링**:
  - 여행자 제보, 검색창 입력값, 역 이름, 후기 작성 등 모든 텍스트 입력은 길이 제한(`maxLength`) 및 특수문자 이스케이프 처리를 적용합니다.
- **외부 URL 오픈 시 안전 속성**:
  - `window.open` 또는 외부 링크(`<a>`) 사용 시 반드시 `rel="noopener noreferrer"` 속성을 부여하여 탭 재탈취(tab-nabbing) 취약점을 차단합니다.

---

## 3. 네트워크 및 API 엔드포인트 보안
- **CORS & Rate Limiting**:
  - `server.ts`의 백엔드 API 엔드포인트에는 적절한 허용 Origin을 지정하고, 불필요한 전역 오픈을 지양합니다.
  - AI 생성 API(`/api/gemini`)와 공공 데이터 프록시에는 비정상적인 대량 호출을 방어하는 Rate Limiting 또는 디바운싱을 적용합니다.
- **데이터 전송 보안**:
  - 외부 통신은 반드시 HTTPS 프로토콜을 사용합니다.

---

## 4. 의존성 및 패키지 무결성
- 신규 npm 패키지 설치 시 주 단위/월 단위 다운로드 수와 신뢰도를 확인하며, 의존성 설치 후 `npm audit`으로 고위험 취약점을 주기적으로 점검합니다.
