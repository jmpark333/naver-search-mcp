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
  items: Array<{
    title: string;
    link: string;
    description: string;
    [key: string]: any;
  }>;
}
