#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ToolSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { NaverSearchTypeSchema, } from "./types/naver-search.types.js";
import { NaverSearchClient } from "./naver-search.js";
// API 키 확인
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error("Error: NAVER_CLIENT_ID and NAVER_CLIENT_SECRET environment variables are required");
    process.exit(1);
}
// 네이버 검색 클라이언트 초기화
const client = NaverSearchClient.getInstance();
client.initialize({
    clientId: NAVER_CLIENT_ID,
    clientSecret: NAVER_CLIENT_SECRET,
});
const server = new Server({
    name: "naver-search-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// 검색 도구 스키마 정의
const SearchArgsSchema = z.object({
    type: NaverSearchTypeSchema,
    query: z.string(),
    display: z.number().optional(),
    start: z.number().optional(),
    sort: z.enum(["sim", "date"]).optional(),
});
const ToolInputSchema = ToolSchema.shape.inputSchema;
// 도구 목록 핸들러
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search",
                description: "네이버 검색 API를 사용하여 뉴스, 블로그, 쇼핑, 이미지 등 다양한 컨텐츠를 검색합니다.",
                inputSchema: zodToJsonSchema(SearchArgsSchema),
            },
            {
                name: "search_news",
                description: "네이버 뉴스 검색 결과를 반환합니다.",
                inputSchema: zodToJsonSchema(SearchArgsSchema.omit({ type: true })),
            },
            {
                name: "search_blog",
                description: "네이버 블로그 검색 결과를 반환합니다.",
                inputSchema: zodToJsonSchema(SearchArgsSchema.omit({ type: true })),
            },
            {
                name: "search_shop",
                description: "네이버 쇼핑 검색 결과를 반환합니다.",
                inputSchema: zodToJsonSchema(SearchArgsSchema.omit({ type: true })),
            },
            {
                name: "search_image",
                description: "네이버 이미지 검색 결과를 반환합니다.",
                inputSchema: zodToJsonSchema(SearchArgsSchema.omit({ type: true })),
            },
            {
                name: "search_kin",
                description: "네이버 지식iN 검색 결과를 반환합니다.",
                inputSchema: zodToJsonSchema(SearchArgsSchema.omit({ type: true })),
            },
            {
                name: "search_book",
                description: "네이버 책 검색 결과를 반환합니다.",
                inputSchema: zodToJsonSchema(SearchArgsSchema.omit({ type: true })),
            },
        ],
    };
});
// 도구 호출 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        let type;
        let params;
        switch (name) {
            case "search": {
                const parsed = SearchArgsSchema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for search: ${parsed.error}`);
                }
                type = parsed.data.type;
                params = parsed.data;
                break;
            }
            case "search_news":
            case "search_blog":
            case "search_shop":
            case "search_image":
            case "search_kin":
            case "search_book": {
                const parsed = SearchArgsSchema.omit({ type: true }).safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for ${name}: ${parsed.error}`);
                }
                type = name.replace("search_", "");
                params = { ...parsed.data, type };
                break;
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
        const result = await client.search(type, {
            query: params.query,
            display: params.display,
            start: params.start,
            sort: params.sort,
        });
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});
// 서버 시작
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Naver Search MCP Server running on stdio");
    console.error("Client ID:", NAVER_CLIENT_ID);
}
runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
