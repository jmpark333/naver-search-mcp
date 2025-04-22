# Naver Search MCP Server

[![English](https://img.shields.io/badge/English-README-yellow)](README.md)
[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

Naver 검색 API와 DataLab API 통합을 위한 MCP 서버로, 다양한 Naver 서비스에서의 종합적인 검색과 데이터 트렌드 분석을 가능하게 합니다.

#### 필수 요구 사항

- Naver Developers API 키(클라이언트 ID 및 시크릿)
- Node.js 18 이상
- NPM 8 이상

#### API 키 얻기

1. [Naver Developers](https://developers.naver.com/apps/#/register)에 방문
2. "애플리케이션 등록"을 클릭
3. 애플리케이션 이름을 입력하고 다음 API를 모두 선택:
   - 검색 (블로그, 뉴스, 책 검색 등을 위한)
   - DataLab (검색 트렌드)
   - DataLab (쇼핑 인사이트)
4. 얻은 클라이언트 ID와 클라이언트 시크릿을 환경 변수로 설정

## 도구 세부 정보

### 사용 가능한 도구:

- **search_webkr**: Naver 웹 문서 검색
- **search_news**: Naver 뉴스 검색
- **search_blog**: Naver 블로그 검색
- **search_shop**: Naver 쇼핑 검색
- **search_image**: Naver 이미지 검색
- **search_kin**: Naver 지식iN 검색
- **search_book**: Naver 책 검색
- **search_encyc**: Naver 백과사전 검색
- **search_academic**: Naver 학술 논문 검색
- **search_local**: Naver 지역 장소 검색

<!-- 트렌드 분석 도구 제거 (2025-04-22 09:55:00) -->
<!-- 아래 도구들은 더 이상 제공되지 않습니다. -->
<!-- - **datalab_search**: 검색어 트렌드 분석 -->
<!-- - **datalab_shopping_category**: 쇼핑 카테고리 트렌드 분석 -->
<!-- - **datalab_shopping_by_device**: 기기별 쇼핑 트렌드 분석 -->
<!-- - **datalab_shopping_by_gender**: 성별 쇼핑 트렌드 분석 -->
<!-- - **datalab_shopping_by_age**: 연령대별 쇼핑 트렌드 분석 -->
<!-- - **datalab_shopping_keywords**: 쇼핑 키워드 트렌드 분석 -->
<!-- - **datalab_shopping_keyword_by_device**: 쇼핑 키워드 기기별 트렌드 분석 -->
<!-- - **datalab_shopping_keyword_by_gender**: 쇼핑 키워드 성별 트렌드 분석 -->
<!-- - **datalab_shopping_keyword_by_age**: 쇼핑 키워드 연령별 트렌드 분석 -->

## 설치

### GitHub 저장소를 통한 설치 (2025-04-22 09:57:00)

아래 명령어로 저장소를 직접 클론하여 설치합니다:

```bash
# 저장소 클론
 git clone https://github.com/jmpark333/naver-search-mcp.git
 cd naver-search-mcp

# 환경 변수 설정 (네이버 API 키 필요)
 export NAVER_CLIENT_ID=여기에_클라이언트_ID_입력
 export NAVER_CLIENT_SECRET=여기에_클라이언트_SECRET_입력

# MCP 서버 실행
 npx -y github:jmpark333/naver-search-mcp
```

- Node.js 18 이상, npm 8 이상 필요
- 네이버 API 키는 [Naver Developers](https://developers.naver.com/apps/#/register)에서 직접 발급받아야 합니다.

<!-- Docker 설치 방법 제거 (2025-04-22 09:57:00) -->

## Cursor Desktop 구성

`claude_desktop_config.json`에 아래와 같이 추가하세요:

```json
{
  "mcpServers": {
    "naver-search": {
      "command": "npx",
      "args": ["-y", "github:jmpark333/naver-search-mcp"],
      "env": {
        "NAVER_CLIENT_ID": "your_client_id",
        "NAVER_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

## 빌드

```bash
npm install
```

## 라이선스

MIT License
