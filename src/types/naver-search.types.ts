import { z } from "zod";

export const NaverSearchTypeSchema = z.enum([
  "news",
  "encyc",
  "blog",
  "shop",
  "webkr",
  "image",
  "doc",
  "kin",
  "book",
  "cafearticle",
]);

export type NaverSearchType = z.infer<typeof NaverSearchTypeSchema>;

export const NaverSearchParamsSchema = z.object({
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
    .describe("Sort method (sim: similarity, date: chronological)"),
});

export type NaverSearchParams = z.infer<typeof NaverSearchParamsSchema>;

export const NaverSearchConfigSchema = z.object({
  clientId: z.string().describe("Client ID issued by Naver Developer Center"),
  clientSecret: z
    .string()
    .describe("Client Secret issued by Naver Developer Center"),
});

export type NaverSearchConfig = z.infer<typeof NaverSearchConfigSchema>;

export interface NaverSearchResponse {
  lastBuildDate: string; // Timestamp when the search results were generated
  total: number; // Total number of search results
  start: number; // Start position of search results
  display: number; // Number of items displayed
  items: NaverSearchItem[];
  isError?: boolean;
}

export interface NaverSearchItem {
  title: string; // Item title
  link: string; // Item URL
  description: string; // Item description
}

export interface NaverDocumentSearchResponse extends NaverSearchResponse {
  items: NaverDocumentItem[];
}

export interface NaverDocumentItem extends NaverSearchItem {
  title: string; // Document title (search term is wrapped in <b> tags)
  link: string; // Document URL
  description: string; // Document summary (search term is wrapped in <b> tags)
}

// DataLab Search Types
export interface DatalabSearchRequest {
  startDate: string; // Start date in yyyy-mm-dd format
  endDate: string; // End date in yyyy-mm-dd format
  timeUnit: "date" | "week" | "month"; // Time unit for analysis
  keywordGroups: Array<{
    groupName: string; // Group name
    keywords: string[]; // List of keywords in the group
  }>;
}

export interface DatalabShoppingResponse {
  startDate: string; // Start date of analysis
  endDate: string; // End date of analysis
  timeUnit: string; // Time unit used for analysis
  results: {
    title: string; // Result title
    category?: string[]; // Category information
    keyword?: string[]; // Keyword information
    data: {
      period: string; // Time period
      group?: string; // Group information
      ratio: number; // Ratio/percentage value
    }[];
  }[];
}

export interface NaverWebSearchParams extends NaverSearchParams {
  type?: "webkr"; // Web search type identifier
}

// DataLab Shopping Category Types
export interface DatalabShoppingCategoryRequest {
  startDate: string; // Start date in yyyy-mm-dd format
  endDate: string; // End date in yyyy-mm-dd format
  timeUnit: "date" | "week" | "month"; // Time unit for analysis
  category: Array<{
    name: string; // Category name
    param: string[]; // Category parameters
  }>;
  device?: "pc" | "mo"; // Device type (pc or mobile)
  gender?: "f" | "m"; // Gender (female or male)
  ages?: string[]; // Age groups
}

// DataLab Shopping Device Types
export interface DatalabShoppingDeviceRequest {
  startDate: string; // Start date in yyyy-mm-dd format
  endDate: string; // End date in yyyy-mm-dd format
  timeUnit: "date" | "week" | "month"; // Time unit for analysis
  category: string; // Category code
  device: "pc" | "mo"; // Device type (pc or mobile)
}

// DataLab Shopping Gender Types
export interface DatalabShoppingGenderRequest {
  startDate: string; // Start date in yyyy-mm-dd format
  endDate: string; // End date in yyyy-mm-dd format
  timeUnit: "date" | "week" | "month"; // Time unit for analysis
  category: string; // Category code
  gender: "f" | "m"; // Gender (female or male)
}

// DataLab Shopping Age Types
export interface DatalabShoppingAgeRequest {
  startDate: string; // Start date in yyyy-mm-dd format
  endDate: string; // End date in yyyy-mm-dd format
  timeUnit: "date" | "week" | "month"; // Time unit for analysis
  category: string; // Category code
  ages: string[]; // Age groups
}

// DataLab Shopping Keywords Types
export interface DatalabShoppingKeywordsRequest {
  startDate: string; // Start date in yyyy-mm-dd format
  endDate: string; // End date in yyyy-mm-dd format
  timeUnit: "date" | "week" | "month"; // Time unit for analysis
  category: string; // Category code
  keyword: Array<{
    name: string; // Keyword name
    param: string[]; // Keyword parameters
  }>;
}

// DataLab Shopping Keyword Types
export interface DatalabShoppingKeywordRequest {
  startDate: string; // Start date in yyyy-mm-dd format
  endDate: string; // End date in yyyy-mm-dd format
  timeUnit: "date" | "week" | "month"; // Time unit for analysis
  category: string; // Category code
  keyword: string; // Search keyword
  device?: "pc" | "mo"; // Device type (pc or mobile)
  gender?: "f" | "m"; // Gender (female or male)
  ages?: string[]; // Age groups
}
