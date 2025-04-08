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
  VisionCelebrityRequest,
} from "./types/naver-search.types.js";
import { NaverSearchClient } from "./naver-search.js";

// API 키 확인
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
  console.error(
    "Error: NAVER_CLIENT_ID and NAVER_CLIENT_SECRET environment variables are required"
  );
  process.exit(1);
}

// 네이버 검색 클라이언트 초기화
const client = NaverSearchClient.getInstance();
client.initialize({
  clientId: NAVER_CLIENT_ID,
  clientSecret: NAVER_CLIENT_SECRET,
});

const server = new Server(
  {
    name: "naver-search-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 검색 도구 스키마 정의
const SearchArgsSchema = z.object({
  type: NaverSearchTypeSchema,
  query: z.string(),
  display: z.number().optional(),
  start: z.number().optional(),
  sort: z.enum(["sim", "date"]).optional(),
});

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

// 도구 목록 핸들러
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search",
        description:
          "Search across all Naver services using the unified search API",
        inputSchema: zodToJsonSchema(SearchArgsSchema) as ToolInput,
      },
      {
        name: "search_news",
        description: "Search for news articles from Naver News",
        inputSchema: zodToJsonSchema(
          SearchArgsSchema.omit({ type: true })
        ) as ToolInput,
      },
      {
        name: "search_blog",
        description: "Search for blog posts from Naver Blog",
        inputSchema: zodToJsonSchema(
          SearchArgsSchema.omit({ type: true })
        ) as ToolInput,
      },
      {
        name: "search_shop",
        description: "Search for products from Naver Shopping",
        inputSchema: zodToJsonSchema(
          SearchArgsSchema.omit({ type: true })
        ) as ToolInput,
      },
      {
        name: "search_image",
        description: "Search for images across Naver services",
        inputSchema: zodToJsonSchema(
          SearchArgsSchema.omit({ type: true })
        ) as ToolInput,
      },
      {
        name: "search_kin",
        description: "Search for Q&A posts from Naver Knowledge-iN",
        inputSchema: zodToJsonSchema(
          SearchArgsSchema.omit({ type: true })
        ) as ToolInput,
      },
      {
        name: "search_book",
        description: "Search for books in Naver Books",
        inputSchema: zodToJsonSchema(
          SearchArgsSchema.omit({ type: true })
        ) as ToolInput,
      },
      {
        name: "datalab_search",
        description: "Analyze search trends across Naver services",
        inputSchema: zodToJsonSchema(datalab_search.schema) as ToolInput,
      },
      {
        name: "datalab_shopping_category",
        description: "Analyze shopping trends by category in Naver Shopping",
        inputSchema: zodToJsonSchema(
          datalab_shopping_category.schema
        ) as ToolInput,
      },
      {
        name: "datalab_shopping_by_device",
        description:
          "Analyze shopping trends by device type (PC/Mobile) in Naver Shopping",
        inputSchema: zodToJsonSchema(
          datalab_shopping_by_device.schema
        ) as ToolInput,
      },
      {
        name: "datalab_shopping_by_gender",
        description: "Analyze shopping trends by gender in Naver Shopping",
        inputSchema: zodToJsonSchema(
          datalab_shopping_by_gender.schema
        ) as ToolInput,
      },
      {
        name: "datalab_shopping_by_age",
        description: "Analyze shopping trends by age groups in Naver Shopping",
        inputSchema: zodToJsonSchema(
          datalab_shopping_by_age.schema
        ) as ToolInput,
      },
      {
        name: "datalab_shopping_keywords",
        description: "Analyze shopping trends by keywords in Naver Shopping",
        inputSchema: zodToJsonSchema(
          datalab_shopping_keywords.schema
        ) as ToolInput,
      },
      {
        name: "vision_celebrity",
        description:
          "Detect and analyze celebrity faces in images with similarity scores",
        inputSchema: zodToJsonSchema(vision_celebrity.schema) as ToolInput,
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
        const result = await client.search(
          name.replace("search_", "") as NaverSearchType,
          {
            query: parsed.data.query,
            display: parsed.data.display,
            start: parsed.data.start,
            sort: parsed.data.sort,
          }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datalab_search": {
        const parsed = datalab_search.schema.safeParse(args);
        if (!parsed.success) {
          throw new Error(
            `Invalid arguments for datalab_search: ${parsed.error}`
          );
        }
        const result = await datalab_search.handler(parsed.data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datalab_shopping_category": {
        const parsed = datalab_shopping_category.schema.safeParse(args);
        if (!parsed.success) {
          throw new Error(
            `Invalid arguments for datalab_shopping_category: ${parsed.error}`
          );
        }
        const result = await datalab_shopping_category.handler(parsed.data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datalab_shopping_by_device": {
        const parsed = datalab_shopping_by_device.schema.safeParse(args);
        if (!parsed.success) {
          throw new Error(
            `Invalid arguments for datalab_shopping_by_device: ${parsed.error}`
          );
        }
        const result = await datalab_shopping_by_device.handler(parsed.data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datalab_shopping_by_gender": {
        const parsed = datalab_shopping_by_gender.schema.safeParse(args);
        if (!parsed.success) {
          throw new Error(
            `Invalid arguments for datalab_shopping_by_gender: ${parsed.error}`
          );
        }
        const result = await datalab_shopping_by_gender.handler(parsed.data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datalab_shopping_by_age": {
        const parsed = datalab_shopping_by_age.schema.safeParse(args);
        if (!parsed.success) {
          throw new Error(
            `Invalid arguments for datalab_shopping_by_age: ${parsed.error}`
          );
        }
        const result = await datalab_shopping_by_age.handler(parsed.data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datalab_shopping_keywords": {
        const parsed = datalab_shopping_keywords.schema.safeParse(args);
        if (!parsed.success) {
          throw new Error(
            `Invalid arguments for datalab_shopping_keywords: ${parsed.error}`
          );
        }
        const result = await datalab_shopping_keywords.handler(parsed.data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "vision_celebrity": {
        const parsed = vision_celebrity.schema.safeParse(args);
        if (!parsed.success) {
          throw new Error(
            `Invalid arguments for vision_celebrity: ${parsed.error}`
          );
        }
        const result = await vision_celebrity.handler(parsed.data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
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
    startDate: z.string().describe("Start date (yyyy-mm-dd)"),
    endDate: z.string().describe("End date (yyyy-mm-dd)"),
    timeUnit: z
      .enum(["date", "week", "month"])
      .describe("Time unit for analysis"),
    keywordGroups: z.array(
      z.object({
        groupName: z.string().describe("Group name"),
        keywords: z.array(z.string()).describe("List of keywords"),
      })
    ),
  }),
  handler: async (params: DatalabSearchRequest) => {
    return await client.searchTrend(params);
  },
};

// DataLab Shopping
const datalab_shopping_category = {
  schema: z.object({
    startDate: z.string().describe("Start date (yyyy-mm-dd)"),
    endDate: z.string().describe("End date (yyyy-mm-dd)"),
    timeUnit: z
      .enum(["date", "week", "month"])
      .describe("Time unit for analysis"),
    category: z.string().describe("Shopping category code"),
  }),
  handler: async (params: DatalabShoppingRequest) => {
    return await client.shoppingCategoryTrend(params);
  },
};

const datalab_shopping_by_device = {
  schema: z.object({
    startDate: z.string(),
    endDate: z.string(),
    timeUnit: z.enum(["date", "week", "month"]),
    category: z.string(),
    device: z.enum(["pc", "mo"]).describe("Device type (pc or mo)"),
  }),
  handler: async (params: DatalabShoppingRequest) => {
    return await client.shoppingCategoryByDevice(params);
  },
};

const datalab_shopping_by_gender = {
  schema: z.object({
    startDate: z.string(),
    endDate: z.string(),
    timeUnit: z.enum(["date", "week", "month"]),
    category: z.string(),
    gender: z.enum(["f", "m"]).describe("Gender (f or m)"),
  }),
  handler: async (params: DatalabShoppingRequest) => {
    return await client.shoppingCategoryByGender(params);
  },
};

const datalab_shopping_by_age = {
  schema: z.object({
    startDate: z.string(),
    endDate: z.string(),
    timeUnit: z.enum(["date", "week", "month"]),
    category: z.string(),
    ages: z.array(z.string()).describe('Age groups (e.g. ["10","20","30"])'),
  }),
  handler: async (params: DatalabShoppingRequest) => {
    return await client.shoppingCategoryByAge(params);
  },
};

const datalab_shopping_keywords = {
  schema: z.object({
    startDate: z.string(),
    endDate: z.string(),
    timeUnit: z.enum(["date", "week", "month"]),
    category: z.string(),
    keyword: z.string().describe("Search keyword"),
  }),
  handler: async (params: DatalabShoppingRequest) => {
    return await client.shoppingCategoryKeywords(params);
  },
};

// Vision API
const vision_celebrity = {
  schema: z.object({
    image: z.string().describe("Base64 encoded image data"),
  }),
  handler: async (params: VisionCelebrityRequest) => {
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
