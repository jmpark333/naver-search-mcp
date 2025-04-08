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

// DataLab Search Types
export interface DatalabSearchRequest {
  startDate: string; // 조회 기간 시작날짜(yyyy-mm-dd)
  endDate: string; // 조회 기간 종료날짜(yyyy-mm-dd)
  timeUnit: "date" | "week" | "month"; // 구간 단위
  keywordGroups: Array<{
    groupName: string;
    keywords: string[];
  }>;
}

// DataLab Shopping Types
export interface DatalabShoppingRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: string; // 쇼핑 분야 코드
  keyword?: string; // 검색어 (키워드 관련 API에서 사용)
  device?: "pc" | "mo"; // 기기별 조회시 사용
  gender?: "f" | "m"; // 성별 조회시 사용
  ages?: string[]; // 연령별 조회시 사용 (예: ["10","20","30"])
}

// Vision Celebrity Types
export interface VisionCelebrityRequest {
  image: string; // Base64 인코딩된 이미지 데이터
}

export interface VisionCelebrityResponse {
  info: {
    size: {
      width: number;
      height: number;
    };
    faceCount: number;
  };
  faces: Array<{
    celebrity: {
      value: string;
      confidence: number;
    };
  }>;
}
