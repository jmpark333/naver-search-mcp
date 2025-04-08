#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  NaverSearchTypeSchema,
  NaverSearchParamsSchema,
  NaverSearchConfigSchema,
  NaverSearchType,
  DatalabSearchRequest,
  DatalabShoppingRequest,
  // VisionCelebrityRequest,
} from "./types/naver-search.types.js";
import { NaverSearchClient } from "./naver-search.js";
import fs from "fs";

// Validate required API keys
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
  console.error(
    "Error: NAVER_CLIENT_ID and NAVER_CLIENT_SECRET environment variables are required"
  );
  process.exit(1);
}

// Initialize Naver Search client singleton
const client = NaverSearchClient.getInstance();
client.initialize({
  clientId: NAVER_CLIENT_ID,
  clientSecret: NAVER_CLIENT_SECRET,
});

// Create MCP server instance
const server = new Server(
  {
    name: "naver-search",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define base search arguments schema
const SearchArgsSchema = z.object({
  query: z.string().describe("검색어"),
  display: z.number().optional().describe("검색 결과 출력 건수 (기본값: 10)"),
  start: z.number().optional().describe("검색 시작 위치 (기본값: 1)"),
  sort: z
    .enum(["sim", "date"])
    .optional()
    .describe("정렬 방식 (sim: 유사도순, date: 날짜순)"),
});

// Define DataLab search arguments schema
const DatalabBaseSchema = z.object({
  startDate: z.string().describe("시작 날짜 (yyyy-mm-dd)"),
  endDate: z.string().describe("종료 날짜 (yyyy-mm-dd)"),
  timeUnit: z.enum(["date", "week", "month"]).describe("시간 단위"),
});

const DatalabSearchSchema = DatalabBaseSchema.extend({
  keywordGroups: z
    .array(
      z.object({
        groupName: z.string().describe("그룹명"),
        keywords: z.array(z.string()).describe("키워드 목록"),
      })
    )
    .describe("검색어 그룹"),
});

// 쇼핑인사이트 분야별 트렌드 조회
const DatalabShoppingSchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("분야 이름"),
        param: z.array(z.string()).describe("분야 코드"),
      })
    )
    .describe("분야 이름과 코드 쌍의 배열"),
  device: z.enum(["pc", "mo"]).optional().describe("기기 타입"),
  gender: z.enum(["f", "m"]).optional().describe("성별"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("연령대"),
});

// 쇼핑인사이트 분야 내 기기별/성별/연령별 트렌드 조회
const DatalabShoppingCategorySchema = DatalabBaseSchema.extend({
  category: z.string().describe("분야 코드"),
  device: z.enum(["pc", "mo"]).optional().describe("기기 타입"),
  gender: z.enum(["f", "m"]).optional().describe("성별"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("연령대"),
});

// 쇼핑인사이트 키워드별 트렌드 조회
const DatalabShoppingKeywordSchema = DatalabBaseSchema.extend({
  category: z.string().describe("분야 코드"),
  keyword: z.string().describe("검색 키워드"),
  device: z.enum(["pc", "mo"]).optional().describe("기기 타입"),
  gender: z.enum(["f", "m"]).optional().describe("성별"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("연령대"),
});

// 쇼핑인사이트 키워드 기기별/성별/연령별 트렌드 조회
const DatalabShoppingKeywordTrendSchema = DatalabBaseSchema.extend({
  category: z.string().describe("분야 코드"),
  keyword: z.string().describe("검색 키워드"),
  device: z.enum(["pc", "mo"]).optional().describe("기기 타입"),
  gender: z.enum(["f", "m"]).optional().describe("성별"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("연령대"),
});

// Vision API
// const vision_celebrity = {
//   schema: z.object({
//     image: z.string().describe("Base64로 인코딩된 이미지 데이터"),
//   }),
//   handler: async (params: VisionCelebrityRequest) => {
//     return await client.detectCelebrity(params);
//   },
// };

// Register available tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_news",
        description: "네이버 뉴스 검색을 수행합니다.",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_blog",
        description: "네이버 블로그 검색을 수행합니다.",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_shop",
        description: "네이버 쇼핑 검색을 수행합니다.",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_image",
        description: "네이버 이미지 검색을 수행합니다.",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_kin",
        description: "네이버 지식iN 검색을 수행합니다.",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_book",
        description: "네이버 책 검색을 수행합니다.",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "datalab_search",
        description: "네이버 검색어 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(DatalabSearchSchema),
      },
      {
        name: "datalab_shopping_category",
        description: "네이버 쇼핑 카테고리별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(DatalabShoppingSchema),
      },
      {
        name: "datalab_shopping_by_device",
        description: "네이버 쇼핑 기기별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(
          DatalabShoppingSchema.pick({
            startDate: true,
            endDate: true,
            timeUnit: true,
            category: true,
            device: true,
          })
        ),
      },
      {
        name: "datalab_shopping_by_gender",
        description: "네이버 쇼핑 성별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(
          DatalabShoppingSchema.pick({
            startDate: true,
            endDate: true,
            timeUnit: true,
            category: true,
            gender: true,
          })
        ),
      },
      {
        name: "datalab_shopping_by_age",
        description: "네이버 쇼핑 연령대별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(
          DatalabShoppingSchema.pick({
            startDate: true,
            endDate: true,
            timeUnit: true,
            category: true,
            ages: true,
          })
        ),
      },
      // {
      //   name: "vision_celebrity",
      //   description: "이미지에서 유명인을 감지합니다.",
      //   inputSchema: zodToJsonSchema(vision_celebrity.schema),
      // },
      {
        name: "datalab_shopping_keywords",
        description: "네이버 쇼핑 키워드별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordSchema),
      },
      {
        name: "datalab_shopping_keyword_by_device",
        description: "네이버 쇼핑 키워드 기기별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordTrendSchema),
      },
      {
        name: "datalab_shopping_keyword_by_gender",
        description: "네이버 쇼핑 키워드 성별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordTrendSchema),
      },
      {
        name: "datalab_shopping_keyword_by_age",
        description: "네이버 쇼핑 키워드 연령별 트렌드 분석을 수행합니다.",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordTrendSchema),
      },
    ],
  };
});

// Initialize and start server
async function runServer() {
  try {
    const transport = new StdioServerTransport();

    // 서버 에러 핸들링
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    // API 키 검증
    if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
      console.error(
        "Error: NAVER_CLIENT_ID and NAVER_CLIENT_SECRET environment variables are required"
      );
      process.exit(1);
    }

    await server.connect(transport);
    console.error("Naver Search MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error running server:", error);
    process.exit(1);
  }
}

// 에러 응답 헬퍼 함수
function createErrorResponse(error: unknown): {
  content: Array<{ type: string; text: string }>;
  isError: boolean;
} {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("API Error:", errorMessage);
  return {
    content: [{ type: "text", text: `Error: ${errorMessage}` }],
    isError: true,
  };
}

// Handle tool execution requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    console.error(`Executing tool: ${name} with args:`, args);

    if (!args) {
      throw new Error("Arguments are required");
    }

    let result;

    switch (name) {
      // Search API
      case "search_news":
      case "search_blog":
      case "search_shop":
      case "search_image":
      case "search_kin":
      case "search_book": {
        const params = SearchArgsSchema.parse(args);
        const type = name.replace("search_", "") as NaverSearchType;
        result = await client.search({ type, ...params });
        break;
      }

      // DataLab Search API
      case "datalab_search": {
        const params = DatalabSearchSchema.parse(args);
        result = await client.searchTrend(params);
        break;
      }

      // DataLab Shopping API
      case "datalab_shopping_category": {
        const params = DatalabShoppingSchema.parse(args);
        console.error(
          "Calling shopping category trend API with params:",
          params
        );
        result = await client.datalabShoppingCategory(params);
        break;
      }

      case "datalab_shopping_by_device": {
        const params = DatalabShoppingCategorySchema.pick({
          startDate: true,
          endDate: true,
          timeUnit: true,
          category: true,
          device: true,
        }).parse(args);
        result = await client.datalabShoppingCategoryDevice({
          ...params,
          category: [{ name: params.category, param: [params.category] }],
        });
        break;
      }

      case "datalab_shopping_by_gender": {
        const params = DatalabShoppingCategorySchema.pick({
          startDate: true,
          endDate: true,
          timeUnit: true,
          category: true,
          gender: true,
        }).parse(args);
        result = await client.datalabShoppingCategoryGender({
          ...params,
          category: [{ name: params.category, param: [params.category] }],
        });
        break;
      }

      case "datalab_shopping_by_age": {
        const params = DatalabShoppingCategorySchema.pick({
          startDate: true,
          endDate: true,
          timeUnit: true,
          category: true,
          ages: true,
        }).parse(args);
        result = await client.datalabShoppingCategoryAge({
          ...params,
          category: [{ name: params.category, param: [params.category] }],
        });
        break;
      }

      // Vision API
      // case "vision_celebrity": {
      //   const parsed = vision_celebrity.schema.safeParse(args);
      //   if (!parsed.success) {
      //     throw new Error(
      //       `Invalid arguments for vision_celebrity: ${parsed.error}`
      //     );
      //   }

      //   result = await vision_celebrity.handler(parsed.data);
      //   break;
      // }

      case "datalab_shopping_keywords": {
        const params = DatalabShoppingKeywordSchema.parse(args);
        console.error(
          "Calling shopping keywords trend API with params:",
          params
        );
        result = await client.datalabShoppingKeywords(params);
        break;
      }

      case "datalab_shopping_keyword_by_device": {
        const params = DatalabShoppingKeywordTrendSchema.parse(args);
        result = await client.datalabShoppingKeywordDevice({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          keyword: params.keyword,
          device: params.device || "",
          gender: "",
          ages: [],
        });
        break;
      }

      case "datalab_shopping_keyword_by_gender": {
        const params = DatalabShoppingKeywordTrendSchema.parse(args);
        result = await client.datalabShoppingKeywordGender({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          keyword: params.keyword,
          device: "",
          gender: params.gender || "",
          ages: [],
        });
        break;
      }

      case "datalab_shopping_keyword_by_age": {
        const params = DatalabShoppingKeywordTrendSchema.parse(args);
        result = await client.datalabShoppingKeywordAge({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          keyword: params.keyword,
          device: "",
          gender: "",
          ages: params.ages || [],
        });
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    console.error(`Tool ${name} executed successfully`);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return createErrorResponse(error);
  }
});

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
