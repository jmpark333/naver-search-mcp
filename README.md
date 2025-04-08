# 네이버 검색 MCP 서버

네이버 검색 API를 사용하여 다양한 컨텐츠를 검색할 수 있는 MCP 서버입니다.

## 기능

- 뉴스 검색
- 블로그 검색
- 쇼핑 검색
- 이미지 검색
- 지식iN 검색
- 책 검색
- 백과사전 검색
- 웹문서 검색
- 전문정보 검색
- 카페글 검색

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

`claude_desktop_config.json`에 다음을 추가하세요:

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

또는 Docker를 사용하는 경우:

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

## 도구

### 통합 검색

- **search**
  - 모든 타입의 검색을 수행할 수 있는 통합 검색 도구
  - 입력:
    - `type`: 검색 타입 (news, blog, shop 등)
    - `query`: 검색어
    - `display`: 검색 결과 출력 건수 (기본값: 10)
    - `start`: 검색 시작 위치 (기본값: 1)
    - `sort`: 정렬 방식 (sim: 유사도순, date: 날짜순)

### 개별 검색 도구들

- **search_news**: 뉴스 검색
- **search_blog**: 블로그 검색
- **search_shop**: 쇼핑 검색
- **search_image**: 이미지 검색
- **search_kin**: 지식iN 검색
- **search_book**: 책 검색

각 도구는 다음 매개변수를 받습니다:

- `query`: 검색어
- `display`: 검색 결과 출력 건수 (기본값: 10)
- `start`: 검색 시작 위치 (기본값: 1)
- `sort`: 정렬 방식 (sim: 유사도순, date: 날짜순)

## 빌드

Docker 빌드:

```bash
docker build -t mcp/naver-search .
```

## 라이선스

MIT License
