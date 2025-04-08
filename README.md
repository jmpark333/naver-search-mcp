# Naver Search MCP Server

[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)

An MCP server that enables searching various content using the Naver Search API and analyzing data with Datalab.

## Features

### Search Features

- Unified Search (search)
- News Search (search_news)
- Blog Search (search_blog)
- Shopping Search (search_shop)
- Image Search (search_image)
- Knowledge-iN Search (search_kin)
- Book Search (search_book)
- Encyclopedia Search (search_encyc)
- Web Document Search (search_doc)
- Cafe Article Search (search_cafearticle)

### Datalab Features

- Search Term Trend Analysis (datalab_search)
- Shopping Category Trends (datalab_shopping_category)
- Device-specific Shopping Trends - PC/Mobile (datalab_shopping_by_device)
- Shopping Trends by Gender (datalab_shopping_by_gender)
- Shopping Trends by Age Groups (datalab_shopping_by_age)
- Shopping Keyword Trends (datalab_shopping_keywords)

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
    - `query`: Search term (required)
    - `display`: Number of results to display (default: 10)
    - `start`: Starting position for search results (default: 1)
    - `sort`: Sort method (sim: by similarity, date: by date)

### Individual Search Tools

Each search tool accepts the following parameters:

- `query`: Search term (required)
- `display`: Number of results to display (default: 10)
- `start`: Starting position for search results (default: 1)
- `sort`: Sort method (sim: by similarity, date: by date)

Available search tools:

- **search_news**: News search
- **search_blog**: Blog search
- **search_shop**: Shopping search
- **search_image**: Image search
- **search_kin**: Knowledge-iN search
- **search_book**: Book search
- **search_encyc**: Encyclopedia search
- **search_doc**: Web document search
- **search_cafearticle**: Cafe article search

### Datalab Tools

- **datalab_search**

  - Analyze search term trends
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `keywordGroups`: Array of keyword groups to analyze
      - `groupName`: Name of the keyword group
      - `keywords`: Array of keywords in the group

- **datalab_shopping_category**

  - Analyze shopping category trends
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `category`: Shopping category code

- **datalab_shopping_by_device**

  - Analyze shopping trends by device type
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `category`: Shopping category code
    - `device`: Device type (pc, mo)

- **datalab_shopping_by_gender**

  - Analyze shopping trends by gender
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `category`: Shopping category code
    - `gender`: Gender (f, m)

- **datalab_shopping_by_age**

  - Analyze shopping trends by age groups
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `category`: Shopping category code
    - `ages`: Array of age groups (e.g. ["10", "20", "30"])

- **datalab_shopping_keywords**
  - Analyze shopping keyword trends
  - Parameters:
    - `startDate`: Analysis start date (YYYY-MM-DD)
    - `endDate`: Analysis end date (YYYY-MM-DD)
    - `timeUnit`: Time unit for analysis (date, week, month)
    - `category`: Shopping category code
    - `keyword`: Search keyword

## Build

Docker build:

```bash
docker build -t mcp/naver-search .
```

## License

MIT License
