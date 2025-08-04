# 개발 로그

이 문서는 `pptx-surgeon-mac` 앱 개발 과정의 모든 주요 작업을 기록합니다.

---

### 2025-08-04

- **프로젝트 초기 설정**
  - `~/Dev/pptx-surgeon-mac` 디렉토리 생성
  - 기존 `pptx-surgeon-web` 프로젝트에서 다음 파일 및 디렉토리 복사:
    - `public/`
    - `pptx-surgeon.js`
    - `pptx-surgeon-*.js`
    - `server.js`
    - `package.json` 및 `package-lock.json`
    - `eslint.yaml`
  - `devplan.md`: macOS 앱 전환을 위한 단계별 개발 계획서 작성
  - `devlog.md`: 개발 과정 기록을 위한 로그 파일 생성

- **Phase 1: Electron 프로젝트 초기화**
  - `npm install electron --save-dev` 명령으로 Electron 설치
  - `main.js`: Electron 메인 프로세스 파일 생성 및 기본 윈도우 설정
  - `preload.js`: 메인-렌더러 프로세스 간 통신을 위한 preload 스크립트 생성
  - `package.json`: `main` 필드를 `main.js`로 설정하고, `start` 스크립트를 `electron .`으로 변경

- **Phase 1: 핵심 로직 통합**
  - `main.js`: `server.js`의 파일 처리 및 `pptx-surgeon.js` 실행 로직을 이전하고, `ipcMain` 핸들러로 구현
  - `preload.js`: 렌더러와 메인 프로세스 간의 안전한 통신을 위한 API 재구성
  - `public/script.js`: 기존 `fetch`/`WebSocket` API 호출을 `window.electron.invoke` 및 `window.electron.on`을 사용하도록 전체 로직 수정
  - `server.js` 파일 삭제 및 `package.json`에서 `cors`, `ws` 의존성 제거

- **Phase 2: 네이티브 기능 추가**
  - `public/index.html`: 네이티브 파일 대화상자를 사용하므로 불필요한 `<input type="file">` 및 관련 버튼 삭제
  - `main.js`: `Menu` 모듈을 사용하여 표준 macOS 애플리케이션 메뉴(파일, 편집, 보기 등) 생성
  - `main.js`: '파일 열기' 메뉴 항목에 네이티브 파일 대화상자 호출 기능 연결
  - `public/script.js`: 메뉴를 통한 파일 선택(`file-selected` 이벤트)을 처리하는 IPC 리스너 추가
  - `main.js`: 폰트 처리 완료 시, `Notification` 모듈을 이용해 데스크톱 알림을 보내도록 기능 추가

- **Phase 3: 빌드 및 패키징**
  - `npm install electron-builder --save-dev` 명령으로 `electron-builder` 설치
  - `package.json`: `build` 설정을 추가하고, `dist` 스크립트를 정의하여 빌드 프로세스 구성
  - `npm run dist` 명령을 실행하여 `dist/` 디렉토리에 `.dmg` 설치 파일 및 관련 빌드 파일 생성

- **Phase 3: 오류 수정 및 재빌드**
  - **오류 1 수정 (`dialog:openFile` 핸들러 중복 등록):** `main.js`에서 중복으로 선언된 `ipcMain.handle('dialog:openFile', ...)` 코드를 찾아 하나를 삭제하여 해결.
  - **오류 2 수정 (`pptx-surgeon.js` 모듈 로드 실패):** `package.json`의 `build` 설정에 `asarUnpack` 옵션을 추가. 이를 통해 `pptx-surgeon` 관련 스크립트들이 `asar` 아카이브에 포함되지 않고 외부 파일로 존재하도록 하여, `spawn`을 통해 Node.js 자식 프로세스에서 정상적으로 접근할 수 있도록 수정.

- **Phase 3: 추가 오류 수정 및 재빌드 (2차)**
  - **오류 3 수정 (`run:analyze` 핸들러 없음):** 이전 핸들러 중복 제거 과정에서 실수로 삭제된 `run:analyze`, `run:process`, `dialog:saveFile` IPC 핸들러를 `main.js`에 다시 추가하여 복원.

- **Phase 3: 최종 오류 수정 및 재빌드 (3차)**
  - **오류 4 수정 (`spawn node ENOENT`):** 패키징된 앱 환경에서 `node` 실행 파일을 찾지 못하는 문제 해결. `child_process.spawn`을 `child_process.fork`로 변경하여 Electron에 내장된 Node.js 런타임을 사용하도록 수정. 이를 통해 외부 `node` 명령어 의존성을 제거하고 안정적인 스크립트 실행을 보장.

