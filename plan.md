# 📋 프로젝트 전체 설계도 (Plan)

## 🎯 목표
자동 가격 조정 웹앱 기능 고도화 및 안정적인 백엔드 연동, 그리고 향후 Desktop App(PWA) 지원을 통한 확장성 확보

## 🚀 파악된 아키텍처
* **Front-End:** React + Vite + TailwindCSS + shadcn/ui
* **Back-End:** Supabase (DB & Auth)
* **Background 작업 (Scraper & Auto Pricing):** Node.js 기반 Cron scheduler

## 📌 주요 단계별 실행 계획
1. **1단계 (완료):** 프론트엔드 UI 수정 및 사용자 지침(매뉴얼) 환경 구축 완료
2. **2단계 (완료):** Supabase 대체 시나리오 - **오프라인 JSON 백업/복구 시스템 및 LocalStorage 연동** 구축 완료
3. **3단계 (진행중):** PWA 전용 `manifest.json` 세팅 및 서비스 워커 기반 **데스크톱 앱 변환 요소** 추가 설정 (승인 대기)
4. **4단계 (보류):** 백엔드(Supabase/Cron) 기능 실전 통합 (디자인/테스트 확정 후 진행 예정)
