# Naver Search MCP 서버

[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)

네이버 검색 API를 사용하여 다양한 콘텐츠를 검색하고 데이터랩으로 데이터를 분석할 수 있는 MCP 서버입니다.

## API 키 발급 방법

1. [네이버 개발자 센터](https://developers.naver.com/apps/#/register)에 접속합니다.
2. 애플리케이션 등록을 클릭합니다.
3. 애플리케이션 이름을 입력하고, 사용 API에서 다음 항목들을 반드시 모두 선택합니다:
   - 검색 (검색 API - 블로그, 뉴스, 책 등 검색 기능 사용)
   - 데이터랩(검색어 트렌드) (검색어 트렌드 분석 기능 사용)
   - 데이터랩(쇼핑인사이트) (쇼핑 분야 트렌드 분석 기능 사용)
4. 발급받은 Client ID와 Client Secret을 환경 변수로 설정합니다.

이 서버는 검색 API와 데이터랩 API를 모두 활용합니다:
- 검색 API: 블로그, 뉴스, 쇼핑 등 다양한 네이버 서비스 검색
- 데이터랩 API: 검색어 트렌드와 쇼핑 인사이트를 통한 데이터 분석

## 주요 기능

### 검색 기능

- 통합 검색 (search)
- 블로그 검색 (search_blog)
- 뉴스 검색 (search_news)
- 책 검색 (search_book)
- 성인 검색어 판별 (search_adult)
- 백과사전 검색 (search_encyc)
- 카페글 검색 (search_cafearticle)
- 지식iN 검색 (search_kin)
- 지역 검색 (search_local)
- 오타변환 검색 (search_errata)
- 웹문서 검색 (search_doc)
- 이미지 검색 (search_image)
- 쇼핑 검색 (search_shop)
- 전문자료 검색 (search_academic)

### 데이터랩 기능

- 검색어 트렌드 분석 (datalab_search)
- 쇼핑 카테고리 트렌드 (datalab_shopping_category)
- 기기별 쇼핑 트렌드 - PC/모바일 (datalab_shopping_by_device)
- 성별 쇼핑 트렌드 (datalab_shopping_by_gender)
- 연령대별 쇼핑 트렌드 (datalab_shopping_by_age)
- 쇼핑 키워드 트렌드 (datalab_shopping_keywords)

## 설치 및 실행

### 환경 변수 설정

```bash
# Windows
set NAVER_CLIENT_ID=your_client_id
set NAVER_CLIENT_SECRET=your_client_secret

# Linux/Mac
export NAVER_CLIENT_ID=your_client_id
export NAVER_CLIENT_SECRET=your_client_secret
```

### NPX로 실행

```bash
npx @modelcontextprotocol/server-naver-search
```

### Docker로 실행

```bash
docker run -i --rm \
  -e NAVER_CLIENT_ID=your_client_id \
  -e NAVER_CLIENT_SECRET=your_client_secret \
  mcp/naver-search
```

## Cursor Desktop 설정

`claude_desktop_config.json`에 다음 내용을 추가하세요:

```json
{
  "mcpServers": {
    "naver-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-naver-search"],
      "env": {
        "NAVER_CLIENT_ID": "your_client_id",
        "NAVER_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

Docker를 사용하는 경우:

```json
{
  "mcpServers": {
    "naver-search": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "NAVER_CLIENT_ID=your_client_id",
        "-e",
        "NAVER_CLIENT_SECRET=your_client_secret",
        "mcp/naver-search"
      ]
    }
  }
}
```

## 도구 설명

### 통합 검색

- **search**
  - 모든 콘텐츠 유형에 대한 통합 검색을 수행할 수 있는 도구
  - 매개변수:
    - `type`: 검색 유형 (news, blog, shop 등)
    - `query`: 검색어 (필수)
    - `display`: 표시할 결과 수 (기본값: 10)
    - `start`: 검색 결과 시작 위치 (기본값: 1)
    - `sort`: 정렬 방법 (sim: 유사도순, date: 날짜순)

### 개별 검색 도구

각 검색 도구는 다음 매개변수를 사용합니다:

- `query`: 검색어 (필수)
- `display`: 표시할 결과 수 (기본값: 10)
- `start`: 검색 결과 시작 위치 (기본값: 1)
- `sort`: 정렬 방법 (sim: 유사도순, date: 날짜순)

사용 가능한 검색 도구:

- **search_news**: 뉴스 검색
- **search_blog**: 블로그 검색
- **search_shop**: 쇼핑 검색
- **search_image**: 이미지 검색
- **search_kin**: 지식iN 검색
- **search_book**: 책 검색
- **search_encyc**: 백과사전 검색
- **search_doc**: 웹문서 검색
- **search_cafearticle**: 카페글 검색

### 데이터랩 도구

- **datalab_search**

  - 검색어 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `keywordGroups`: 분석할 키워드 그룹 배열
      - `groupName`: 키워드 그룹 이름
      - `keywords`: 그룹 내 키워드 배열

- **datalab_shopping_category**

  - 쇼핑 카테고리 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드

- **datalab_shopping_by_device**

  - 기기별 쇼핑 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드
    - `device`: 기기 유형 (pc: PC, mo: 모바일)

- **datalab_shopping_by_gender**

  - 성별 쇼핑 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드
    - `gender`: 성별 (f: 여성, m: 남성)

- **datalab_shopping_by_age**

  - 연령대별 쇼핑 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드
    - `ages`: 연령대 배열 (예: ["10", "20", "30"])

- **datalab_shopping_keywords**
  - 쇼핑 키워드 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드
    - `keyword`: 검색 키워드

## 빌드

Docker 빌드:

```bash
docker build -t mcp/naver-search .
```

## 라이선스

MIT 라이선스
