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

/**
 * NaverSearchClient - A singleton client for interacting with Naver's APIs
 * Handles search, DataLab, and Vision API requests
 */
export class NaverSearchClient {
  private static instance: NaverSearchClient | null = null;
  private readonly searchBaseUrl = "https://openapi.naver.com/v1/search";
  private readonly datalabBaseUrl = "https://openapi.naver.com/v1/datalab";
  private readonly visionBaseUrl = "https://openapi.naver.com/v1/vision";
  private config: NaverSearchConfig | null = null;

  private constructor() {}

  /**
   * Get singleton instance of NaverSearchClient
   */
  static getInstance(): NaverSearchClient {
    if (!NaverSearchClient.instance) {
      NaverSearchClient.instance = new NaverSearchClient();
    }
    return NaverSearchClient.instance;
  }

  /**
   * Initialize client with API credentials
   */
  initialize(config: NaverSearchConfig) {
    this.config = config;
  }

  /**
   * Get headers required for API requests
   * @throws Error if client is not initialized
   */
  private getHeaders() {
    if (!this.config) {
      throw new Error(
        "NaverSearchClient is not initialized. Please call initialize() first."
      );
    }
    return {
      "X-Naver-Client-Id": this.config.clientId,
      "X-Naver-Client-Secret": this.config.clientSecret,
    };
  }

  /**
   * Generic search method that supports all search types
   */
  async search(
    type: NaverSearchType,
    params: NaverSearchParams
  ): Promise<NaverSearchResponse> {
    try {
      const response = await axios.get(`${this.searchBaseUrl}/${type}`, {
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

  // Convenience methods for specific search types
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

  // DataLab Search API methods
  async searchTrend(params: DatalabSearchRequest): Promise<any> {
    return this.post("datalab", "/search", params);
  }

  // DataLab Shopping API methods
  async shoppingCategoryTrend(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/categories", params);
  }

  async shoppingCategoryByDevice(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/category/device", params);
  }

  async shoppingCategoryByGender(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/category/gender", params);
  }

  async shoppingCategoryByAge(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/category/age", params);
  }

  async shoppingCategoryKeywords(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/category/keywords", params);
  }

  async shoppingKeywordByDevice(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/category/keyword/device", params);
  }

  async shoppingKeywordByGender(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/category/keyword/gender", params);
  }

  async shoppingKeywordByAge(params: DatalabShoppingRequest): Promise<any> {
    return this.post("datalab", "/shopping/category/keyword/age", params);
  }

  // Vision API methods
  async detectCelebrity(
    params: VisionCelebrityRequest
  ): Promise<VisionCelebrityResponse> {
    return this.post("vision", "/celebrity", params);
  }

  /**
   * Generic POST request handler
   * @param apiType - Type of API to use (search, datalab, vision)
   * @param endpoint - API endpoint
   * @param data - Request data
   */
  private async post(
    apiType: "search" | "datalab" | "vision",
    endpoint: string,
    data: any
  ): Promise<any> {
    const baseUrl = {
      search: this.searchBaseUrl,
      datalab: this.datalabBaseUrl,
      vision: this.visionBaseUrl,
    }[apiType];

    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, data, {
        headers: this.getHeaders(),
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
}

/**
 * NaverSearchMCP - High-level wrapper for NaverSearchClient
 * Provides simplified interface with error handling
 */
export class NaverSearchMCP {
  private client: NaverSearchClient;

  constructor() {
    this.client = NaverSearchClient.getInstance();
  }

  /**
   * Generic search method with error handling
   */
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
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Convenience methods with error handling
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
