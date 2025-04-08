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
            {
                name: "datalab_search",
                description: "네이버 통합검색의 검색어 트렌드를 분석합니다.",
                inputSchema: zodToJsonSchema(datalab_search.schema),
            },
            {
                name: "datalab_shopping_category",
                description: "네이버 쇼핑의 카테고리별 트렌드를 분석합니다.",
                inputSchema: zodToJsonSchema(datalab_shopping_category.schema),
            },
            {
                name: "datalab_shopping_by_device",
                description: "네이버 쇼핑의 기기별(PC/모바일) 트렌드를 분석합니다.",
                inputSchema: zodToJsonSchema(datalab_shopping_by_device.schema),
            },
            {
                name: "datalab_shopping_by_gender",
                description: "네이버 쇼핑의 성별 트렌드를 분석합니다.",
                inputSchema: zodToJsonSchema(datalab_shopping_by_gender.schema),
            },
            {
                name: "datalab_shopping_by_age",
                description: "네이버 쇼핑의 연령대별 트렌드를 분석합니다.",
                inputSchema: zodToJsonSchema(datalab_shopping_by_age.schema),
            },
            {
                name: "datalab_shopping_keywords",
                description: "네이버 쇼핑의 키워드별 트렌드를 분석합니다.",
                inputSchema: zodToJsonSchema(datalab_shopping_keywords.schema),
            },
            {
                name: "vision_celebrity",
                description: "이미지에서 유명인을 감지하고 닮은 정도를 분석합니다.",
                inputSchema: zodToJsonSchema(vision_celebrity.schema),
            },
        ],
    };
});
// 도구 호출 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        switch (name) {
            case "search": {
                const parsed = SearchArgsSchema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for search: ${parsed.error}`);
                }
                const result = await client.search(parsed.data.type, {
                    query: parsed.data.query,
                    display: parsed.data.display,
                    start: parsed.data.start,
                    sort: parsed.data.sort,
                });
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
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
                const result = await client.search(name.replace("search_", ""), {
                    query: parsed.data.query,
                    display: parsed.data.display,
                    start: parsed.data.start,
                    sort: parsed.data.sort,
                });
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "datalab_search": {
                const parsed = datalab_search.schema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for datalab_search: ${parsed.error}`);
                }
                const result = await datalab_search.handler(parsed.data);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "datalab_shopping_category": {
                const parsed = datalab_shopping_category.schema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for datalab_shopping_category: ${parsed.error}`);
                }
                const result = await datalab_shopping_category.handler(parsed.data);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "datalab_shopping_by_device": {
                const parsed = datalab_shopping_by_device.schema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for datalab_shopping_by_device: ${parsed.error}`);
                }
                const result = await datalab_shopping_by_device.handler(parsed.data);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "datalab_shopping_by_gender": {
                const parsed = datalab_shopping_by_gender.schema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for datalab_shopping_by_gender: ${parsed.error}`);
                }
                const result = await datalab_shopping_by_gender.handler(parsed.data);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "datalab_shopping_by_age": {
                const parsed = datalab_shopping_by_age.schema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for datalab_shopping_by_age: ${parsed.error}`);
                }
                const result = await datalab_shopping_by_age.handler(parsed.data);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "datalab_shopping_keywords": {
                const parsed = datalab_shopping_keywords.schema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for datalab_shopping_keywords: ${parsed.error}`);
                }
                const result = await datalab_shopping_keywords.handler(parsed.data);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "vision_celebrity": {
                const parsed = vision_celebrity.schema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for vision_celebrity: ${parsed.error}`);
                }
                const result = await vision_celebrity.handler(parsed.data);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});
// DataLab Search
const datalab_search = {
    schema: z.object({
        startDate: z.string().describe("조회 시작 날짜 (yyyy-mm-dd)"),
        endDate: z.string().describe("조회 종료 날짜 (yyyy-mm-dd)"),
        timeUnit: z.enum(["date", "week", "month"]).describe("구간 단위"),
        keywordGroups: z.array(z.object({
            groupName: z.string().describe("그룹명"),
            keywords: z.array(z.string()).describe("검색어 목록"),
        })),
    }),
    handler: async (params) => {
        return await client.searchTrend(params);
    },
};
// DataLab Shopping
const datalab_shopping_category = {
    schema: z.object({
        startDate: z.string().describe("조회 시작 날짜 (yyyy-mm-dd)"),
        endDate: z.string().describe("조회 종료 날짜 (yyyy-mm-dd)"),
        timeUnit: z.enum(["date", "week", "month"]).describe("구간 단위"),
        category: z.string().describe("쇼핑 분야 코드"),
    }),
    handler: async (params) => {
        return await client.shoppingCategoryTrend(params);
    },
};
const datalab_shopping_by_device = {
    schema: z.object({
        startDate: z.string(),
        endDate: z.string(),
        timeUnit: z.enum(["date", "week", "month"]),
        category: z.string(),
        device: z.enum(["pc", "mo"]).describe("기기 종류 (pc 또는 mo)"),
    }),
    handler: async (params) => {
        return await client.shoppingCategoryByDevice(params);
    },
};
const datalab_shopping_by_gender = {
    schema: z.object({
        startDate: z.string(),
        endDate: z.string(),
        timeUnit: z.enum(["date", "week", "month"]),
        category: z.string(),
        gender: z.enum(["f", "m"]).describe("성별 (f 또는 m)"),
    }),
    handler: async (params) => {
        return await client.shoppingCategoryByGender(params);
    },
};
const datalab_shopping_by_age = {
    schema: z.object({
        startDate: z.string(),
        endDate: z.string(),
        timeUnit: z.enum(["date", "week", "month"]),
        category: z.string(),
        ages: z.array(z.string()).describe('연령대 목록 (예: ["10","20","30"])'),
    }),
    handler: async (params) => {
        return await client.shoppingCategoryByAge(params);
    },
};
const datalab_shopping_keywords = {
    schema: z.object({
        startDate: z.string(),
        endDate: z.string(),
        timeUnit: z.enum(["date", "week", "month"]),
        category: z.string(),
        keyword: z.string().describe("검색 키워드"),
    }),
    handler: async (params) => {
        return await client.shoppingCategoryKeywords(params);
    },
};
// Vision API
const vision_celebrity = {
    schema: z.object({
        image: z.string().describe("Base64로 인코딩된 이미지 데이터"),
    }),
    handler: async (params) => {
        return await client.detectCelebrity(params);
    },
};
const tools = {
    // ... existing tools ...
    // DataLab Search
    datalab_search,
    // DataLab Shopping
    datalab_shopping_category,
    datalab_shopping_by_device,
    datalab_shopping_by_gender,
    datalab_shopping_by_age,
    datalab_shopping_keywords,
    // Vision API
    vision_celebrity,
};
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
