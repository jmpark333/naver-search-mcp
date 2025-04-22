# Naver Search MCP Server

[![한국어](https://img.shields.io/badge/한국어-README-yellow)](README-ko.md)
[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

MCP server for Naver Search API and DataLab API integration, enabling comprehensive search across various Naver services and data trend analysis.

#### Prerequisites

- Naver Developers API Key (Client ID and Secret)
- Node.js 18 or higher
- NPM 8 or higher

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

<!-- Removed DataLab trend analysis tools (2025-04-22 09:55:00) -->
<!-- The following tools are no longer provided. -->
<!-- - **datalab_search**: Analyze search term trends -->
<!-- - **datalab_shopping_category**: Analyze shopping category trends -->
<!-- - **datalab_shopping_by_device**: Analyze shopping trends by device -->
<!-- - **datalab_shopping_by_gender**: Analyze shopping trends by gender -->
<!-- - **datalab_shopping_by_age**: Analyze shopping trends by age group -->
<!-- - **datalab_shopping_keywords**: Analyze shopping keyword trends -->
<!-- - **datalab_shopping_keyword_by_device**: Analyze shopping keyword trends by device -->
<!-- - **datalab_shopping_keyword_by_gender**: Analyze shopping keyword trends by gender -->
<!-- - **datalab_shopping_keyword_by_age**: Analyze shopping keyword trends by age group -->

## Installation

### Install via GitHub repository (2025-04-22 09:57:00)

Clone the repository and run directly:

```bash
# Clone repository
git clone https://github.com/jmpark333/naver-search-mcp.git
cd naver-search-mcp

# Set environment variables (Naver API keys required)
export NAVER_CLIENT_ID=your_client_id
export NAVER_CLIENT_SECRET=your_client_secret

# Run MCP server
npx -y github:jmpark333/naver-search-mcp
```

- Requires Node.js 18+ and npm 8+
- You must issue your own Naver API keys from [Naver Developers](https://developers.naver.com/apps/#/register)

<!-- Docker installation method removed (2025-04-22 09:57:00) -->

## Cursor Desktop Configuration

Add to `claude_desktop_config.json`:

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

## Build

```bash
npm install
```

## License

MIT License
