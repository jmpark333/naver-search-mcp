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
    "local",
]);
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
export const NaverSearchConfigSchema = z.object({
    clientId: z.string().describe("Client ID issued by Naver Developer Center"),
    clientSecret: z
        .string()
        .describe("Client Secret issued by Naver Developer Center"),
});
// 전문자료 검색 파라미터 스키마
export const NaverDocumentSearchParamsSchema = z.object({
    query: z.string().describe("Search query"),
    display: z
        .number()
        .optional()
        .describe("Number of results to display (default: 10, max: 100)"),
    start: z
        .number()
        .optional()
        .describe("Start position of search results (default: 1, max: 1000)"),
});
// 지역 검색 파라미터 스키마
export const NaverLocalSearchParamsSchema = NaverSearchParamsSchema.extend({
    sort: z.enum(["random", "comment"])
        .optional()
        .describe("Sort method (random: accuracy, comment: review count)"),
    display: z
        .number()
        .optional()
        .describe("Number of results to display (default: 1, max: 5)"),
    start: z
        .number()
        .optional()
        .describe("Start position of search results (default: 1, max: 1)"),
});
