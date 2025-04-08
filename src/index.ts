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
  NaverSearchType,
  NaverSearchParamsSchema,
  NaverSearchConfigSchema,
  NaverSearchParams,
  DatalabSearchRequest,
  // VisionCelebrityRequest,
  NaverLocalSearchParamsSchema,
  NaverDocumentSearchParamsSchema,
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
  query: z.string().describe("Search query"),
  display: z
    .number()
    .optional()
    .describe("Number of results to display (default: 10)"),
  start: z
    .number()
    .optional()
    .describe("Start position of search results (default: 1)"),
  sort: z
    .enum(["sim", "date"])
    .optional()
    .describe("Sort method (sim: similarity, date: date)"),
});

// Base DataLab schema
const DatalabBaseSchema = z.object({
  startDate: z.string().describe("Start date (yyyy-mm-dd)"),
  endDate: z.string().describe("End date (yyyy-mm-dd)"),
  timeUnit: z.enum(["date", "week", "month"]).describe("Time unit"),
});

// Shopping Category schema (for general category trends)
const DatalabShoppingSchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).describe("Category codes"),
      })
    )
    .describe("Array of category name and code pairs"),
});

// Device-specific schema
const DatalabShoppingDeviceSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  device: z.enum(["pc", "mo"]).describe("Device type"),
});

// Gender-specific schema
const DatalabShoppingGenderSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  gender: z.enum(["f", "m"]).describe("Gender"),
});

// Age-specific schema
const DatalabShoppingAgeSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .describe("Age groups"),
});

// Keywords trend schema
const DatalabShoppingKeywordsSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z
    .array(
      z.object({
        name: z.string().describe("Keyword name"),
        param: z.array(z.string()).describe("Keyword values"),
      })
    )
    .describe("Array of keyword name and value pairs"),
});

// Keyword by device schema
const DatalabShoppingKeywordDeviceSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  device: z.enum(["pc", "mo"]).describe("Device type"),
});

// Keyword by gender schema
const DatalabShoppingKeywordGenderSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  gender: z.enum(["f", "m"]).describe("Gender"),
});

// Keyword by age schema
const DatalabShoppingKeywordAgeSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .describe("Age groups"),
});

// Shopping Insight Category Trends
const DatalabShoppingCategorySchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).describe("Category codes"),
      })
    )
    .describe("Array of category name and code pairs"),
  device: z.enum(["pc", "mo"]).optional().describe("Device type"),
  gender: z.enum(["f", "m"]).optional().describe("Gender"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("Age groups"),
});

// Shopping Insight Category Device/Gender/Age Trends
const DatalabShoppingCategoryDeviceSchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).describe("Category codes"),
      })
    )
    .describe("Array of category name and code pairs"),
  device: z.enum(["pc", "mo"]).optional().describe("Device type"),
  gender: z.enum(["f", "m"]).optional().describe("Gender"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("Age groups"),
});

// Shopping Insight Keyword Trends
const DatalabShoppingKeywordSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z
    .array(
      z.object({
        name: z.string().describe("Keyword name"),
        param: z.array(z.string()).describe("Keyword values"),
      })
    )
    .describe("Array of keyword name and value pairs"),
  device: z.enum(["pc", "mo"]).optional().describe("Device type"),
  gender: z.enum(["f", "m"]).optional().describe("Gender"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("Age groups"),
});

// Shopping Insight Keyword Device/Gender/Age Trends
const DatalabShoppingKeywordTrendSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z
    .array(
      z.object({
        name: z.string().describe("Keyword name"),
        param: z.array(z.string()).describe("Keyword values"),
      })
    )
    .describe("Array of keyword name and value pairs"),
  device: z.enum(["pc", "mo"]).optional().describe("Device type"),
  gender: z.enum(["f", "m"]).optional().describe("Gender"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("Age groups"),
});

// DataLab Search schema
const DatalabSearchSchema = DatalabBaseSchema.extend({
  keywordGroups: z
    .array(
      z.object({
        groupName: z.string().describe("Group name"),
        keywords: z.array(z.string()).describe("List of keywords"),
      })
    )
    .describe("Keyword groups"),
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
      // 네이버 검색 API - 기본 검색 기능
      {
        name: "search_news",
        description: "Perform a search on Naver News. (네이버 뉴스 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_blog",
        description: "Perform a search on Naver Blog. (네이버 블로그 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_shop",
        description: "Perform a search on Naver Shopping. (네이버 쇼핑 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_image",
        description: "Perform a search on Naver Image. (네이버 이미지 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_kin",
        description: "Perform a search on Naver KnowledgeiN. (네이버 지식iN 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_book",
        description: "Perform a search on Naver Book. (네이버 책 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_doc",
        description: "Perform a search on Naver Document DB. (네이버 웹문서 검색)",
        inputSchema: zodToJsonSchema(NaverDocumentSearchParamsSchema),
      },
      {
        name: "search_encyc",
        description: "Perform a search on Naver Encyclopedia. (네이버 지식백과 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_academic",
        description: "Perform a search on Naver Academic. (네이버 전문자료 검색)",
        inputSchema: zodToJsonSchema(SearchArgsSchema),
      },
      {
        name: "search_local",
        description: "Perform a search on Naver Local. (네이버 지역 검색)",
        inputSchema: zodToJsonSchema(NaverLocalSearchParamsSchema),
      },

      // 네이버 데이터랩 API - 검색어 트렌드 분석
      {
        name: "datalab_search",
        description: "Perform a trend analysis on Naver search keywords. (네이버 검색어 트렌드 분석)",
        inputSchema: zodToJsonSchema(DatalabSearchSchema),
      },

      // 네이버 데이터랩 API - 쇼핑인사이트 분석
      {
        name: "datalab_shopping_category",
        description: "Perform a trend analysis on Naver Shopping category. (네이버 쇼핑 카테고리별 트렌드 분석)",
        inputSchema: zodToJsonSchema(DatalabShoppingSchema),
      },
      {
        name: "datalab_shopping_by_device",
        description: "Perform a trend analysis on Naver Shopping by device. (네이버 쇼핑 기기별 트렌드 분석)",
        inputSchema: zodToJsonSchema(
          DatalabShoppingDeviceSchema.pick({
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
        description: "Perform a trend analysis on Naver Shopping by gender. (네이버 쇼핑 성별 트렌드 분석)",
        inputSchema: zodToJsonSchema(
          DatalabShoppingGenderSchema.pick({
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
        description: "Perform a trend analysis on Naver Shopping by age. (네이버 쇼핑 연령별 트렌드 분석)",
        inputSchema: zodToJsonSchema(
          DatalabShoppingAgeSchema.pick({
            startDate: true,
            endDate: true,
            timeUnit: true,
            category: true,
            ages: true,
          })
        ),
      },
      {
        name: "datalab_shopping_keywords",
        description: "Perform a trend analysis on Naver Shopping keywords. (네이버 쇼핑 키워드별 트렌드 분석)",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordsSchema),
      },
      {
        name: "datalab_shopping_keyword_by_device",
        description: "Perform a trend analysis on Naver Shopping keywords by device. (네이버 쇼핑 키워드 기기별 트렌드 분석)",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordDeviceSchema),
      },
      {
        name: "datalab_shopping_keyword_by_gender",
        description: "Perform a trend analysis on Naver Shopping keywords by gender. (네이버 쇼핑 키워드 성별 트렌드 분석)",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordGenderSchema),
      },
      {
        name: "datalab_shopping_keyword_by_age",
        description: "Perform a trend analysis on Naver Shopping keywords by age. (네이버 쇼핑 키워드 연령별 트렌드 분석)",
        inputSchema: zodToJsonSchema(DatalabShoppingKeywordAgeSchema),
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
      case "search_book":
      case "search_doc":
      case "search_encyc":
      case "search_academic": {
        const params = SearchArgsSchema.parse(args);
        const type = name.replace("search_", "") as NaverSearchType;
        result = await client.search({ type, ...params });
        break;
      }

      case "search_local": {
        const params = NaverLocalSearchParamsSchema.parse(args);
        result = await client.searchLocal(params);
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
        const params = DatalabShoppingDeviceSchema.parse(args);
        result = await client.datalabShoppingByDevice({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          device: params.device,
        });
        break;
      }

      case "datalab_shopping_by_gender": {
        const params = DatalabShoppingGenderSchema.parse(args);
        result = await client.datalabShoppingByGender({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          gender: params.gender,
        });
        break;
      }

      case "datalab_shopping_by_age": {
        const params = DatalabShoppingAgeSchema.parse(args);
        result = await client.datalabShoppingByAge({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          ages: params.ages,
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
        const params = DatalabShoppingKeywordsSchema.parse(args);
        result = await client.datalabShoppingKeywords({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          keyword: params.keyword,
        });
        break;
      }

      case "datalab_shopping_keyword_by_device": {
        const params = DatalabShoppingKeywordDeviceSchema.parse(args);
        result = await client.datalabShoppingKeywordByDevice({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          keyword: params.keyword,
          device: params.device,
        });
        break;
      }

      case "datalab_shopping_keyword_by_gender": {
        const params = DatalabShoppingKeywordGenderSchema.parse(args);
        result = await client.datalabShoppingKeywordByGender({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          keyword: params.keyword,
          gender: params.gender,
        });
        break;
      }

      case "datalab_shopping_keyword_by_age": {
        const params = DatalabShoppingKeywordAgeSchema.parse(args);
        result = await client.datalabShoppingKeywordByAge({
          startDate: params.startDate,
          endDate: params.endDate,
          timeUnit: params.timeUnit,
          category: params.category,
          keyword: params.keyword,
          ages: params.ages,
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
