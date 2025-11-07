# JJ-DESIGN

**JJ-DESIGN**은 인테리어 디자인 및 시공 전문 회사를 위한 공식 홈페이지입니다.  
브랜드 이미지를 강화하고, 고객이 포트폴리오를 확인하며 상담을 신청할 수 있는 웹사이트로,  
기획부터 개발·배포까지 전 과정을 직접 주도했습니다.

🔗 **배포 주소:** [https://jj-design.co.kr](https://jj-design.co.kr)

---

## 프로젝트 개요

- **프로젝트명:** JJ-DESIGN 홈페이지
- **개발기간:** 2025. 08. 11 ~ 2025. 09. 19
- **개발목표:**  
  직관적이고 감각적인 UI로 브랜드 이미지를 강화하고,  
  고객 문의 및 상담 절차를 간소화하는 웹사이트 구축

---

## 기술 스택

| 구분 | 기술 |
|:------|:------|
| **Frontend** | React / TypeScript |
| **Backend** | Node.js / Express /TypeScript / Prisma / PostgreSQL |
| **Infra** | AWS EC2 / RDS / S3 / Route53 / Nginx |
| **협업도구** | GitHub / Discord |

---

## 주요 기능

- **회사 소개 / 포트폴리오 / 서비스 안내**
- **상담 문의(폼 or 메일 전송)**
- **관리자용 포트폴리오 등록 및 수정 기능**
- **반응형 디자인 지원 (모바일/PC)**
- **AWS를 활용한 통합 배포 환경 구축**

---

## 🧑‍💻 담당 역할

| 이름 | 역할 | 주요 담당 |
|:------|:------|:------------|
| **권나현** | 백엔드 개발 | API 설계, DB 모델링, 백엔드/프론트 배포, 프로젝트 기획, 문서 작성 |
| **박규남** |백엔드 개발 & 프론트엔드 | API 설계, 관리자 페이지 설계 |
| **조가현** | 프론트엔드 | 페이지 구성, 디자인 시스템, 반응형 구현 |
| **하상준** | 백엔드 개발 | API 설계, DB 모델링  |

---

## 프로젝트 구조 예시

📦 JJ-DESIGN-WEB

┣ 📂 .github # GitHub 설정 및 워크플로우

┣ 📂 .husky # Git hooks 설정

┣ 📂 admin-dist # 관리자 페이지 빌드 결과물

┣ 📂 api # API 서버 코드

┣ 📂 aws # AWS 관련 설정 파일 (EC2, S3 등)

┣ 📂 dist # 빌드된 서버 코드

┣ 📂 nginx # Nginx 설정 파일 (리버스 프록시, 배포 설정)

┣ 📂 node_modules # 의존성 패키지

┣ 📂 prisma # Prisma 스키마 및 마이그레이션

┣ 📂 src # 주요 서버 소스코드

┣ 📂 user-dist # 사용자용 프론트 빌드 결과물

┣ 📜 .env # 환경 변수 파일

┣ 📜 .gitignore

┣ 📜 docker-compose.yml # Docker 서비스 정의 파일

┣ 📜 Dockerfile # Docker 빌드 설정

┣ 📜 README.md

---