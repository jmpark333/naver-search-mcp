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
  query: z.string().describe("검색어"),
  display: z.number().optional().describe("검색 결과 출력 건수 (기본값: 10)"),
  start: z.number().optional().describe("검색 시작 위치 (기본값: 1)"),
  sort: z
    .enum(["sim", "date"])
    .optional()
    .describe("정렬 방식 (sim: 유사도순, date: 날짜순)"),
});

export type NaverSearchParams = z.infer<typeof NaverSearchParamsSchema>;

export const NaverSearchConfigSchema = z.object({
  clientId: z
    .string()
    .describe("네이버 개발자 센터에서 발급받은 클라이언트 ID"),
  clientSecret: z
    .string()
    .describe("네이버 개발자 센터에서 발급받은 클라이언트 시크릿"),
});

export type NaverSearchConfig = z.infer<typeof NaverSearchConfigSchema>;

export interface NaverSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
  isError?: boolean;
}

export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
}

export interface NaverDocumentSearchResponse extends NaverSearchResponse {
  items: NaverDocumentItem[];
}

export interface NaverDocumentItem extends NaverSearchItem {
  title: string; // 문서 제목 (검색어와 일치하는 부분은 <b> 태그로 감싸짐)
  link: string; // 문서 URL
  description: string; // 문서 내용 요약 (검색어와 일치하는 부분은 <b> 태그로 감싸짐)
}

// DataLab Search Types
export interface DatalabSearchRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  keywordGroups: Array<{
    groupName: string;
    keywords: string[];
  }>;
}

export interface DatalabShoppingResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: {
    title: string;
    category?: string[];
    keyword?: string[];
    data: {
      period: string;
      group?: string;
      ratio: number;
    }[];
  }[];
}

export interface NaverWebSearchParams extends NaverSearchParams {
  type?: "webkr";
}

// DataLab Shopping Category Types
export interface DatalabShoppingCategoryRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: Array<{
    name: string;
    param: string[];
  }>;
  device?: "pc" | "mo";
  gender?: "f" | "m";
  ages?: string[];
}

// DataLab Shopping Device Types
export interface DatalabShoppingDeviceRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: string;
  device: "pc" | "mo";
}

// DataLab Shopping Gender Types
export interface DatalabShoppingGenderRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: string;
  gender: "f" | "m";
}

// DataLab Shopping Age Types
export interface DatalabShoppingAgeRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: string;
  ages: string[];
}

// DataLab Shopping Keywords Types
export interface DatalabShoppingKeywordsRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: string;
  keyword: Array<{
    name: string;
    param: string[];
  }>;
}

// DataLab Shopping Keyword Types
export interface DatalabShoppingKeywordRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: string;
  keyword: string;
  device?: "pc" | "mo";
  gender?: "f" | "m";
  ages?: string[];
}
