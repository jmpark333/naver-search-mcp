import axios from "axios";
export class NaverSearchClient {
    constructor() {
        this.baseUrl = "https://openapi.naver.com/v1/search";
        this.config = null;
    }
    static getInstance() {
        if (!NaverSearchClient.instance) {
            NaverSearchClient.instance = new NaverSearchClient();
        }
        return NaverSearchClient.instance;
    }
    initialize(config) {
        this.config = config;
    }
    getHeaders() {
        if (!this.config) {
            throw new Error("NaverSearchClient가 초기화되지 않았습니다. initialize()를 먼저 호출해주세요.");
        }
        return {
            "X-Naver-Client-Id": this.config.clientId,
            "X-Naver-Client-Secret": this.config.clientSecret,
        };
    }
    async search(type, params) {
        try {
            const response = await axios.get(`${this.baseUrl}/${type}`, {
                headers: this.getHeaders(),
                params: {
                    ...params,
                    display: params.display || 10,
                    start: params.start || 1,
                },
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
    // 편의 메서드들
    async searchNews(params) {
        return this.search("news", params);
    }
    async searchBlog(params) {
        return this.search("blog", params);
    }
    async searchShop(params) {
        return this.search("shop", params);
    }
    async searchImage(params) {
        return this.search("image", params);
    }
    async searchKin(params) {
        return this.search("kin", params);
    }
    async searchBook(params) {
        return this.search("book", params);
    }
}
NaverSearchClient.instance = null;
export class NaverSearchMCP {
    constructor() {
        this.client = NaverSearchClient.getInstance();
    }
    async search(type, query, options = {}) {
        try {
            const result = await this.client.search(type, {
                query,
                ...options,
            });
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "알 수 없는 오류가 발생했습니다.",
            };
        }
    }
    // 편의 메서드들
    async searchNews(query, options = {}) {
        return this.search("news", query, options);
    }
    async searchBlog(query, options = {}) {
        return this.search("blog", query, options);
    }
    async searchShop(query, options = {}) {
        return this.search("shop", query, options);
    }
    async searchImage(query, options = {}) {
        return this.search("image", query, options);
    }
    async searchKin(query, options = {}) {
        return this.search("kin", query, options);
    }
    async searchBook(query, options = {}) {
        return this.search("book", query, options);
    }
}
