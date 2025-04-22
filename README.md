# Naver Search MCP Server

[![한국어](https://img.shields.io/badge/한국어-README-yellow)](README-ko.md)
[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

MCP server for Naver Search API and DataLab API integration, enabling comprehensive search across various Naver services and data trend analysis.

#### Prerequisites

- Naver Developers API Key (Client ID and Secret)
- Node.js 18 or higher
- NPM 8 or higher
- Docker (optional, for container deployment)

#### Getting API Keys

1. Visit [Naver Developers](https://developers.naver.com/apps/#/register)
2. Click "Register Application"
3. Enter application name and select ALL of the following APIs:
   - Search (for blog, news, book search, etc.)
   - DataLab (Search Trends)
   - DataLab (Shopping Insight)
4. Set the obtained Client ID and Client Secret as environment variables

## Tool Details

### Available tools:

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

## Installation

### Option 1: Quick Install via Smithery (Recommended)

To install Naver Search MCP Server automatically via Smithery, use one of these commands based on your AI client:

For Claude Desktop:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client claude
```

For Cursor:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client cursor
```

For Windsurf:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client windsurf
```

For Cline:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client cline
```

The installer will prompt you for:

- NAVER_CLIENT_ID
- NAVER_CLIENT_SECRET

### Option 2: Manual Installation

#### Environment Variables

```bash
# Windows
set NAVER_CLIENT_ID=your_client_id
set NAVER_CLIENT_SECRET=your_client_secret

# Linux/Mac
export NAVER_CLIENT_ID=your_client_id
export NAVER_CLIENT_SECRET=your_client_secret
```

#### Run with NPX

```bash
npx @modelcontextprotocol/server-naver-search
```

#### Run with Docker

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
## Build

Docker build:

```bash
docker build -t mcp/naver-search .
```



## License

MIT License
