import axios from "axios";
import {
  NaverSearchType,
  NaverSearchConfig,
  NaverSearchParams,
  NaverSearchResponse,
  DatalabSearchRequest,
  DatalabShoppingRequest,
  VisionCelebrityRequest,
  VisionCelebrityResponse,
} from "./types/naver-search.types.js";

export class NaverSearchClient {
  private static instance: NaverSearchClient | null = null;
  private readonly baseUrl = "https://openapi.naver.com/v1/search";
  private config: NaverSearchConfig | null = null;

  private constructor() {}

  static getInstance(): NaverSearchClient {
    if (!NaverSearchClient.instance) {
      NaverSearchClient.instance = new NaverSearchClient();
    }
    return NaverSearchClient.instance;
  }

  initialize(config: NaverSearchConfig) {
    this.config = config;
  }

  private getHeaders() {
    if (!this.config) {
      throw new Error(
        "NaverSearchClient가 초기화되지 않았습니다. initialize()를 먼저 호출해주세요."
      );
    }
    return {
      "X-Naver-Client-Id": this.config.clientId,
      "X-Naver-Client-Secret": this.config.clientSecret,
    };
  }

  async search(
    type: NaverSearchType,
    params: NaverSearchParams
  ): Promise<NaverSearchResponse> {
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Naver API Error: ${
            error.response?.data?.errorMessage || error.message
          }`
        );
      }
      throw error;
    }
  }

  // 편의 메서드들
  async searchNews(params: NaverSearchParams) {
    return this.search("news", params);
  }

  async searchBlog(params: NaverSearchParams) {
    return this.search("blog", params);
  }

  async searchShop(params: NaverSearchParams) {
    return this.search("shop", params);
  }

  async searchImage(params: NaverSearchParams) {
    return this.search("image", params);
  }

  async searchKin(params: NaverSearchParams) {
    return this.search("kin", params);
  }

  async searchBook(params: NaverSearchParams) {
    return this.search("book", params);
  }

  // DataLab Search API
  async searchTrend(params: DatalabSearchRequest): Promise<any> {
    return this.post("/v1/datalab/search", params);
  }

  // DataLab Shopping APIs
  async shoppingCategoryTrend(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/categories", params);
  }

  async shoppingCategoryByDevice(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/category/device", params);
  }

  async shoppingCategoryByGender(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/category/gender", params);
  }

  async shoppingCategoryByAge(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/category/age", params);
  }

  async shoppingCategoryKeywords(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/category/keywords", params);
  }

  async shoppingKeywordByDevice(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/category/keyword/device", params);
  }

  async shoppingKeywordByGender(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/category/keyword/gender", params);
  }

  async shoppingKeywordByAge(params: DatalabShoppingRequest): Promise<any> {
    return this.post("/v1/datalab/shopping/category/keyword/age", params);
  }

  // Vision API
  async detectCelebrity(
    params: VisionCelebrityRequest
  ): Promise<VisionCelebrityResponse> {
    return this.post("/v1/vision/celebrity", params);
  }

  private async post(endpoint: string, data: any): Promise<any> {
    const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}

export class NaverSearchMCP {
  private client: NaverSearchClient;

  constructor() {
    this.client = NaverSearchClient.getInstance();
  }

  async search(
    type: NaverSearchType,
    query: string,
    options: Partial<NaverSearchParams> = {}
  ) {
    try {
      const result = await this.client.search(type, {
        query,
        ...options,
      });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  // 편의 메서드들
  async searchNews(query: string, options: Partial<NaverSearchParams> = {}) {
    return this.search("news", query, options);
  }

  async searchBlog(query: string, options: Partial<NaverSearchParams> = {}) {
    return this.search("blog", query, options);
  }

  async searchShop(query: string, options: Partial<NaverSearchParams> = {}) {
    return this.search("shop", query, options);
  }

  async searchImage(query: string, options: Partial<NaverSearchParams> = {}) {
    return this.search("image", query, options);
  }

  async searchKin(query: string, options: Partial<NaverSearchParams> = {}) {
    return this.search("kin", query, options);
  }

  async searchBook(query: string, options: Partial<NaverSearchParams> = {}) {
    return this.search("book", query, options);
  }
}
