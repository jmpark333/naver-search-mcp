import axios from "axios";
/**
 * NaverSearchClient - 네이버 API 서비스를 위한 싱글톤 클라이언트
 * 검색, 데이터랩 API 요청 처리
 */
export class NaverSearchClient {
    constructor() {
        this.searchBaseUrl = "https://openapi.naver.com/v1/search";
        this.datalabBaseUrl = "https://openapi.naver.com/v1/datalab";
        this.config = null;
    }
    /**
     * 싱글톤 인스턴스 반환
     */
    static getInstance() {
        if (!NaverSearchClient.instance) {
            NaverSearchClient.instance = new NaverSearchClient();
        }
        return NaverSearchClient.instance;
    }
    /**
     * API 자격 증명으로 클라이언트 초기화
     */
    initialize(config) {
        this.config = config;
    }
    /**
     * API 요청에 필요한 헤더 생성
     * @throws 클라이언트가 초기화되지 않은 경우 에러 발생
     */
    getHeaders(contentType = "application/json") {
        if (!this.config) {
            throw new Error("NaverSearchClient is not initialized. Please call initialize() first.");
        }
        const headers = {
            "X-Naver-Client-Id": this.config.clientId,
            "X-Naver-Client-Secret": this.config.clientSecret,
            "Content-Type": contentType,
        };
        return { headers };
    }
    /**
     * 모든 검색 유형을 지원하는 일반 검색 메서드
     */
    async search(params) {
        const { type, ...searchParams } = params;
        const response = await axios.get(`${this.searchBaseUrl}/${type}`, {
            params: searchParams,
            ...this.getHeaders(),
        });
        return response.data;
    }
    /**
     * 전문자료 검색 메서드
     */
    async searchAcademic(params) {
        return this.search({ type: "doc", ...params });
    }
    /**
     * 지역 검색 메서드
     */
    async searchLocal(params) {
        const response = await axios.get(`${this.searchBaseUrl}/local`, {
            params: { ...params },
            ...this.getHeaders(),
        });
        return response.data;
    }
    /**
     * 검색어 트렌드 분석 메서드
     */
    async searchTrend(params) {
        return this.post("datalab", "/search", params);
    }
    /**
     * 쇼핑 카테고리 트렌드 분석 메서드
     */
    async datalabShoppingCategory(params) {
        return this.post("datalab", "/shopping/categories", params);
    }
    /**
     * 쇼핑 기기별 트렌드 분석 메서드
     */
    async datalabShoppingByDevice(params) {
        return this.post("datalab", "/shopping/category/device", params);
    }
    /**
     * 쇼핑 성별 트렌드 분석 메서드
     */
    async datalabShoppingByGender(params) {
        return this.post("datalab", "/shopping/category/gender", params);
    }
    /**
     * 쇼핑 연령별 트렌드 분석 메서드
     */
    async datalabShoppingByAge(params) {
        return this.post("datalab", "/shopping/category/age", params);
    }
    /**
     * 쇼핑 키워드 트렌드 분석 메서드
     */
    async datalabShoppingKeywords(params) {
        return this.post("datalab", "/shopping/category/keywords", params);
    }
    /**
     * 쇼핑 키워드 기기별 트렌드 분석 메서드
     */
    async datalabShoppingKeywordByDevice(params) {
        return this.post("datalab", "/shopping/category/keyword/device", params);
    }
    /**
     * 쇼핑 키워드 성별 트렌드 분석 메서드
     */
    async datalabShoppingKeywordByGender(params) {
        return this.post("datalab", "/shopping/category/keyword/gender", params);
    }
    /**
     * 쇼핑 키워드 연령별 트렌드 분석 메서드
     */
    async datalabShoppingKeywordByAge(params) {
        return this.post("datalab", "/shopping/category/keyword/age", params);
    }
    /**
     * POST 요청 처리 헬퍼 메서드
     * @param apiType - API 유형 (search, datalab)
     * @param endpoint - API 엔드포인트
     * @param data - 요청 데이터
     */
    async post(apiType, endpoint, data) {
        if (!this.config) {
            throw new Error("NaverSearchClient is not initialized. Please call initialize() first.");
        }
        const baseUrl = {
            search: this.searchBaseUrl,
            datalab: this.datalabBaseUrl,
        }[apiType];
        try {
            const headers = {
                "X-Naver-Client-Id": this.config.clientId,
                "X-Naver-Client-Secret": this.config.clientSecret,
            };
            const response = await axios.post(`${baseUrl}${endpoint}`, data, {
                headers,
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Naver API Error: ${error.response?.data?.errorMessage || error.message}`);
            }
            throw error;
        }
    }
}
NaverSearchClient.instance = null;
