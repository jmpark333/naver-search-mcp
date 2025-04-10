# 네이버 검색 MCP 서버

[![English](https://img.shields.io/badge/English-README-blue)](README.md)
[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

네이버 검색 API를 사용하여 다양한 콘텐츠를 검색하고 데이터랩으로 데이터를 분석할 수 있는 MCP 서버입니다.

## 필수 요구사항

- 네이버 개발자 API 키 (Client ID와 Secret)
- Node.js 18 이상
- NPM 8 이상
- Docker (선택사항, 컨테이너 배포용)

## API 키 발급 방법

1. [네이버 개발자 센터](https://developers.naver.com/apps/#/register)에 접속합니다.
2. 애플리케이션 등록을 클릭합니다.
3. 애플리케이션 이름을 입력하고, 사용 API에서 다음 항목들을 반드시 모두 선택합니다:
   - 검색 (검색 API - 블로그, 뉴스, 책 등 검색 기능 사용)
   - 데이터랩(검색어 트렌드) (검색어 트렌드 분석 기능 사용)
   - 데이터랩(쇼핑인사이트) (쇼핑 분야 트렌드 분석 기능 사용)
4. 발급받은 Client ID와 Client Secret을 환경 변수로 설정합니다.

## 주요 기능

### 검색 기능

- 네이버 웹문서 검색 (search_webkr)
- 네이버 뉴스 검색 (search_news)
- 네이버 블로그 검색 (search_blog)
- 네이버 쇼핑 검색 (search_shop)
- 네이버 이미지 검색 (search_image)
- 네이버 지식iN 검색 (search_kin)
- 네이버 책 검색 (search_book)
- 네이버 백과사전 검색 (search_encyc)
- 네이버 학술자료 검색 (search_academic)
- 네이버 지역 검색 (search_local)

### 데이터랩 기능

- 네이버 검색어 트렌드 분석 (datalab_search)
- 네이버 쇼핑 카테고리별 트렌드 분석 (datalab_shopping_category)
- 네이버 쇼핑 기기별 트렌드 분석 (datalab_shopping_by_device)
- 네이버 쇼핑 성별 트렌드 분석 (datalab_shopping_by_gender)
- 네이버 쇼핑 연령별 트렌드 분석 (datalab_shopping_by_age)
- 네이버 쇼핑 키워드별 트렌드 분석 (datalab_shopping_keywords)
- 네이버 쇼핑 키워드 기기별 트렌드 분석 (datalab_shopping_keyword_by_device)
- 네이버 쇼핑 키워드 성별 트렌드 분석 (datalab_shopping_keyword_by_gender)
- 네이버 쇼핑 키워드 연령별 트렌드 분석 (datalab_shopping_keyword_by_age)

## 라이선스

MIT 라이선스
