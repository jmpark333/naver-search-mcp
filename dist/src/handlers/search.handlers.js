import { NaverSearchClient } from "../naver-search.client.js";
// 클라이언트 인스턴스
const client = NaverSearchClient.getInstance();
/**
 * 기본 검색 핸들러
 */
export async function handleSearch(params) {
    return client.search({ ...params });
}
/**
 * 전문자료 검색 핸들러
 */
export async function handleAcademicSearch(params) {
    return client.searchAcademic(params);
}
/**
 * 도서 검색 핸들러
 */
export async function handleBookSearch(params) {
    return client.search({ type: "book", ...params });
}
/**
 * 지식백과 검색 핸들러
 */
export async function handleEncycSearch(params) {
    return client.search({ type: "encyc", ...params });
}
/**
 * 이미지 검색 핸들러
 */
export async function handleImageSearch(params) {
    return client.search({ type: "image", ...params });
}
/**
 * 지식iN 검색 핸들러
 */
export async function handleKinSearch(params) {
    return client.search({ type: "kin", ...params });
}
/**
 * 지역 검색 핸들러
 */
export async function handleLocalSearch(params) {
    return client.searchLocal(params);
}
/**
 * 뉴스 검색 핸들러
 */
export async function handleNewsSearch(params) {
    return client.search({ type: "news", ...params });
}
/**
 * 블로그 검색 핸들러
 */
export async function handleBlogSearch(params) {
    return client.search({ type: "blog", ...params });
}
/**
 * 쇼핑 검색 핸들러
 */
export async function handleShopSearch(params) {
    return client.search({ type: "shop", ...params });
}
/**
 * 웹문서 검색 핸들러
 */
export async function handleWebSearch(params) {
    return client.search({ type: "webkr", ...params });
}
/**
 * 카페글 검색 핸들러
 */
export async function handleCafeArticleSearch(params) {
    return client.search({ type: "cafearticle", ...params });
}
export async function handleWebKrSearch(args) {
    const client = NaverSearchClient.getInstance();
    return await client.search({ type: "webkr", ...args });
}
