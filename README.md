# Naver Search MCP Server

[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

MCP server for Naver Search API and DataLab API integration, enabling comprehensive search across various Naver services and data trend analysis.

## Prerequisites

- Naver Developers API Key (Client ID and Secret)
- Node.js 18 or higher
- NPM 8 or higher
- Docker (optional, for container deployment)

## Getting API Keys

1. Visit [Naver Developers](https://developers.naver.com/apps/#/register)
2. Click "Register Application"
3. Enter application name and select ALL of the following APIs:
   - Search (for blog, news, book search, etc.)
   - DataLab (Search Trends)
   - DataLab (Shopping Insight)
4. Set the obtained Client ID and Client Secret as environment variables

## Features

### Search Tools

- Naver Web Documents Search (search_webkr)
- Naver News Search (search_news)
- Naver Blog Search (search_blog)
- Naver Shopping Search (search_shop)
- Naver Image Search (search_image)
- Naver KnowledgeiN Search (search_kin)
- Naver Book Search (search_book)
- Naver Encyclopedia Search (search_encyc)
- Naver Academic Search (search_academic)
- Naver Local Search (search_local)

### DataLab Tools

- Search Trend Analysis (datalab_search)
- Shopping Category Trend Analysis (datalab_shopping_category)
- Shopping Device Usage Analysis (datalab_shopping_by_device)
- Shopping Gender Analysis (datalab_shopping_by_gender)
- Shopping Age Group Analysis (datalab_shopping_by_age)
- Shopping Keyword Trend Analysis (datalab_shopping_keywords)
- Shopping Keyword Device Analysis (datalab_shopping_keyword_by_device)
- Shopping Keyword Gender Analysis (datalab_shopping_keyword_by_gender)
- Shopping Keyword Age Analysis (datalab_shopping_keyword_by_age)

## Installation & Usage

### Environment Variables

```bash
# Windows
set NAVER_CLIENT_ID=your_client_id
set NAVER_CLIENT_SECRET=your_client_secret

# Linux/Mac
export NAVER_CLIENT_ID=your_client_id
export NAVER_CLIENT_SECRET=your_client_secret
```

### Run with NPX

```bash
npx @modelcontextprotocol/server-naver-search
```

### Run with Docker

```bash
docker run -i --rm \
  -e NAVER_CLIENT_ID=your_client_id \
  -e NAVER_CLIENT_SECRET=your_client_secret \
  mcp/naver-search
```

## Cursor Desktop Configuration

Add to `claude_desktop_config.json`:

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

For Docker:

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

## Tool Details

### Search Tools

Each search tool accepts these parameters:

- `query`: Search term (required)
- `display`: Number of results to show (default: 10)
- `start`: Start position (default: 1)
- `sort`: Sort method (sim: similarity, date: date)

Available search tools:

- **search_webkr**: Search Naver web documents
- **search_news**: Search Naver news
- **search_blog**: Search Naver blogs
- **search_shop**: Search Naver shopping
- **search_image**: Search Naver images
- **search_kin**: Search Naver KnowledgeiN
- **search_book**: Search Naver books
- **search_encyc**: Search Naver encyclopedia
- **search_academic**: Search Naver academic papers
- **search_local**: Search Naver local places

### DataLab Tools

- **datalab_search**

  - Analyze search term trends
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Analysis time unit (date/week/month)
    - `keywordGroups`: Array of keyword groups
      - `groupName`: Group name
      - `keywords`: Array of keywords

- **datalab_shopping_category**

  - 쇼핑 카테고리 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드와 이름 배열

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
    - `keyword`: 키워드와 이름 배열

- **datalab_shopping_keyword_by_device**

  - 쇼핑 키워드 기기별 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드
    - `keyword`: 검색 키워드
    - `device`: 기기 유형 (pc: PC, mo: 모바일)

- **datalab_shopping_keyword_by_gender**

  - 쇼핑 키워드 성별 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드
    - `keyword`: 검색 키워드
    - `gender`: 성별 (f: 여성, m: 남성)

- **datalab_shopping_keyword_by_age**
  - 쇼핑 키워드 연령별 트렌드 분석
  - 매개변수:
    - `startDate`: 분석 시작일 (YYYY-MM-DD)
    - `endDate`: 분석 종료일 (YYYY-MM-DD)
    - `timeUnit`: 분석 시간 단위 (date: 일간, week: 주간, month: 월간)
    - `category`: 쇼핑 카테고리 코드
    - `keyword`: 검색 키워드
    - `ages`: 연령대 배열 (예: ["10", "20", "30"])

## Build

Docker build:

```bash
docker build -t mcp/naver-search .
```

## License

MIT License

For Korean documentation, please see [README-ko.md](README-ko.md)
