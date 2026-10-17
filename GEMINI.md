# Stepless in Korea - Antigravity Agent Rules

이 저장소(Stepless in Korea)에서 코드를 작성, 리팩토링, 디버깅할 때 Antigravity 에이전트가 반드시 준수해야 하는 최상위 프로젝트 룰입니다.

---

## 1. 🛡️ 보안 규칙 (Security Standards)
- **비밀키 클라이언트 노출 금지**: `GEMINI_API_KEY`, `KOREA_TOUR_API_KEY`, `NAVER_CLIENT_SECRET` 등 모든 시크릿 키는 오직 서버(`server.ts`, `.env`)에서만 취급하며, `src/` 코드 및 클라이언트 번들에 노출하지 않습니다.
- **클라이언트 환경변수 제한**: `src/`에서 접근하는 환경변수는 오직 공개 식별자인 `VITE_` 접두사만 허용합니다.
- **XSS 차단**: React에서 `dangerouslySetInnerHTML`의 임의 사용을 금지하며, 외부 링크에는 `rel="noopener noreferrer"`를 항상 포함합니다.
- **상세 규정**: [보안 규칙 상세](.agents/rules/security.md)

---

## 2. 🔍 코드 리뷰 표준 (Code Review Standards)
- **TypeScript 엄격성**: `any` 타입 사용을 금지하고, 모든 Props와 데이터 구조에 구체적인 인터페이스를 작성합니다.
- **방어적 프로그래밍**: 배열 탐색, API 응답 데이터 가공 시 null/undefined 옵셔널 체이닝(`?.`)을 필수로 적용합니다.
- **컴포넌트 단일 책임**: 비대한 모놀리식 UI 지양, 독립적인 뷰와 프레젠테이션 컴포넌트로 분리합니다.
- **에러 복원력**: 공공데이터 API나 외부 네트워크 장애 시 서비스가 멈추지 않도록 로컬 데이터 폴백과 Graceful Degradation을 유지합니다.
- **상세 규정**: [코드 리뷰 표준 상세](.agents/rules/code-review.md)

---

## 3. 💰 파이어스토어 DB 비용 절약 표준 스킬 (Firestore Cost-Optimization Standards)
- **Cache-First 원칙**: 지하철역 출구, 기준 추천 코스 등 정적 데이터는 Firestore를 거치지 않고 로컬 데이터(`src/data.ts`, `recommendations-db.json`) 및 브라우저 캐시(`localStorage`)를 최우선으로 참조합니다.
- **실시간 리스너(`onSnapshot`) 금지**: 대량 읽기 과금을 유발하는 실시간 리스너 대신, 1회성 조회(`getDocs`)를 사용합니다.
- **쿼리 제약 필수**: 모든 Firestore 컬렉션 쿼리에는 `limit()`(최대 10~20건)을 반드시 명시합니다.
- **역정규화 활용**: 서브컬렉션을 남발하지 않고 부모 문서 하나에 맵/배열로 묶어 1회의 읽기 비용으로 처리합니다.
- **클라이언트 쓰기 디바운싱**: 추천수(`upvotes`) 등 빈번한 인터랙션은 낙관적 UI 적용 후 디바운스/배치로 서버에 반영합니다.
- **상세 규정**: [파이어스토어 절약 표준 상세](.agents/rules/firestore-cost-optimization.md)

---

## 4. 🧭 UI/UX 일관성 원칙
- **미니멀 & 명확한 히어로**: 첫 접속 화면은 군더더기 없는 핵심 카피와 단 하나의 검색창에 집중합니다.
- **기존 비즈니스 로직 및 주석 보존**: 무관한 주석이나 라이선스, 기존 검증 안내 콘텐츠를 임의로 훼손하지 않습니다.
