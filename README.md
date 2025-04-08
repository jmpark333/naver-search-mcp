# Naver Search MCP Server

[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)

An MCP server that enables searching various content using the Naver Search API, analyzing data with Datalab, and utilizing Vision API capabilities.

## Features

### Search Features

- News Search
- Blog Search
- Shopping Search
- Image Search
- Knowledge-iN Search
- Book Search
- Encyclopedia Search
- Web Document Search
- Academic Article Search
- Cafe Post Search

### Datalab Features

- Search Term Trend Analysis
- Shopping Category Trends
- Device-specific Shopping Trends (PC/Mobile)
- Shopping Trends by Gender/Age Groups
- Shopping Keyword Trends

### Vision API Features

- Celebrity Face Detection
- Face Similarity Analysis

## Installation and Execution

### Environment Variables Setup

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

Add the following to your `claude_desktop_config.json`:

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

Or if using Docker:

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

## Tools

### Unified Search

- **search**
  - A unified search tool that can perform searches for all content types
  - Parameters:
    - `type`: Search type (news, blog, shop, etc.)
    - `query`: Search term
    - `display`: Number of results to display (default: 10)
    - `start`: Starting position for search results (default: 1)
    - `sort`: Sort method (sim: by similarity, date: by date)

### Individual Search Tools

- **search_news**: News search
- **search_blog**: Blog search
- **search_shop**: Shopping search
- **search_image**: Image search
- **search_kin**: Knowledge-iN search
- **search_book**: Book search
- **search_encyc**: Encyclopedia search
- **search_doc**: Web document search
- **search_academic**: Academic article search
- **search_cafe**: Cafe post search

Each search tool accepts the following parameters:

- `query`: Search term
- `display`: Number of results to display (default: 10)
- `start`: Starting position for search results (default: 1)
- `sort`: Sort method (sim: by similarity, date: by date)

### Datalab Tools

- **datalab_search_trend**

  - Analyze search term trends
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `keywords`: List of keywords to analyze
    - `category`: Category to analyze within

- **datalab_shopping_trend**
  - Analyze shopping trends
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `category`: Shopping category
    - `device`: Device type (pc, mobile, all)
    - `gender`: Gender filter (m, f, a)
    - `ages`: Age groups to analyze

### Vision API Tools

- **vision_face**

  - Detect and analyze faces in images
  - Parameters:
    - `image`: Image URL or Base64 encoded image
    - `mode`: Analysis mode (face, celebrity)

- **vision_face_compare**
  - Compare faces for similarity
  - Parameters:
    - `image1`: First image URL or Base64 encoded image
    - `image2`: Second image URL or Base64 encoded image

## Build

Docker build:

```bash
docker build -t mcp/naver-search .
```

## License

MIT License
