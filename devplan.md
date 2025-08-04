# macOS 데스크톱 앱 전환 개발 계획

이 문서는 `pptx-surgeon-web` 프로젝트를 macOS 데스크톱 앱으로 변환하는 과정의 개발 계획을 정의합니다.

## 최종 목표
- 기존 웹 애플리케이션의 모든 기능을 포함하는 네이티브 macOS 애플리케이션 개발
- Electron 프레임워크를 사용하여 웹 기술(HTML, CSS, JS) 기반으로 구현
- 사용자 편의성을 위한 네이티브 기능(메뉴, 파일 대화상자, 알림) 추가
- 코드 서명 및 Notarization을 통해 안전하게 배포

---

## 단계별 실행 계획

### Phase 1: Electron 기본 구조 설정 및 핵심 로직 통합 (1-2일)
- [x] **Electron 프로젝트 초기화**: `electron` 패키지 설치 및 기본 구조(`main.js`, `index.html`, `preload.js`) 설정
- [x] **핵심 로직 통합**: `server.js`의 핵심 로직을 Electron의 메인 프로세스로 이전
- [x] **UI 마이그레이션**: 기존 `public` 디렉토리의 웹 UI를 Electron `BrowserWindow`에 로드
- [x] **통신 채널 변경**: HTTP 및 WebSocket 통신을 Electron의 `ipcMain`과 `ipcRenderer`로 대체

### Phase 2: 네이티브 기능 추가 및 UI 개선 (2-3일)
- [x] **네이티브 파일 다이얼로그**: 파일 열기/저장 시 네이티브 대화상자 사용
- [x] **드래그앤드롭 기능 개선**: 앱 아이콘 및 창으로 파일 드래그앤드롭 기능 구현
- [x] **애플리케이션 메뉴 추가**: macOS 표준 메뉴(파일, 편집, 도움말) 생성
- [x] **네이티브 알림**: 작업 완료 시 데스크톱 알림 기능 추가

### Phase 3: 빌드, 패키징 및 배포 (1-2일)
- [x] **빌드 시스템 구축**: `electron-builder`를 사용하여 빌드 프로세스 설정
- [ ] **아이콘 및 메타데이터 설정**: 앱 아이콘(`.icns`) 및 `Info.plist` 정보 구성
- [ ] **코드 서명 및 Notarization**: Apple 개발자 계정을 통한 코드 서명 및 공증
- [x] **DMG 파일 생성**: 배포용 `.dmg` 설치 파일 생성
- [ ] **문서화**: `README.md` 파일에 설치 및 사용법 업데이트


