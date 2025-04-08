# Naver Search MCP Server

An MCP server that enables searching various content using the Naver Search API.

## Features

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

Each tool accepts the following parameters:

- `query`: Search term
- `display`: Number of results to display (default: 10)
- `start`: Starting position for search results (default: 1)
- `sort`: Sort method (sim: by similarity, date: by date)

## Build

Docker build:

```bash
docker build -t mcp/naver-search .
```

## License

MIT License
