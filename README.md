# PPTX Surgeon for macOS 🩺

![PPTX Surgeon](https://img.shields.io/badge/PPTX-Surgeon-blue.svg)
![Electron](https://img.shields.io/badge/Electron-28-blueviolet.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**네이티브 macOS 애플리케이션으로 재탄생한 PowerPoint 폰트 문제 해결 도구**

이 프로젝트는 (https://github.com/rse/pptx-surgeon)의 강력한 `pptx-surgeon` CLI 도구를 기반으로 만들어진 웹 인터페이스(https://github.com/jvisualschool/pptx-surgeon-web)를, 다시 Electron을 사용하여 macOS 데스크톱 애플리케이션으로 전환한 것입니다. 이제 복잡한 설정 없이 앱을 실행하여 PPTX 파일의 폰트 문제를 간편하게 해결할 수 있습니다.

---

## ✨ 주요 기능

- **파일 선택** - 클릭 또는 드래그앤드롭으로 PPTX 파일 선택
- **폰트 분석** - 파일 내 폰트 정보 자동 분석 및 문제점 탐지
- **수술 옵션 선택** - 직관적인 체크박스로 원하는 작업 선택 (폰트 임베딩 제거, 폰트 이름 매핑, 올인원 폰트 정리)
- **수술 실행** - 실시간 진행 상황 모니터링 및 결과 파일 저장
- **네이티브 경험** - macOS 표준 메뉴, 파일 대화상자, 데스크톱 알림 지원

## 🚀 개발 및 빌드

이 프로젝트를 직접 수정하거나 빌드하고 싶다면 다음 안내를 따르세요.

### 필수 요구사항

- **Node.js** 18.0.0 이상
- **npm** 또는 **yarn**

### 1. 개발 환경에서 실행

```bash
# 1. 저장소 클론
# git clone https://github.com/astheboy/pptx-surgeon-mac.git
# cd pptx-surgeon-mac

# 2. 의존성 설치
npm install

# 3. 애플리케이션 실행
npm start
```

### 2. 배포용 앱 빌드 (.dmg)

macOS에서 다른 사람에게 배포할 수 있는 `.dmg` 설치 파일을 만들 수 있습니다.

```bash
# 1. 의존성 설치 (아직 안했다면)
npm install

# 2. 빌드 스크립트 실행
npm run dist
```

빌드가 완료되면 `dist/` 디렉토리 안에 `PPTX Surgeon-x.x.x.dmg` 파일이 생성됩니다.

## 🤝 원본 프로젝트

이 프로젝트는 다음의 훌륭한 오픈소스들을 기반으로 합니다.

- **원본 CLI 도구**:
  - [pptx-surgeon by rse](https://github.com/rse/pptx-surgeon)
  - [pptx-surgeon-web by jvisualschool](https://github.com/jvisualschool/pptx-surgeon-web)
- **웹 인터페이스 아이디어**: 이 데스크톱 앱의 기반이 된 웹 프로젝트

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
