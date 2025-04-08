import axios, { AxiosRequestConfig } from "axios";
import {
  NaverSearchType,
  NaverSearchConfig,
  NaverSearchParams,
  NaverSearchResponse,
  DatalabSearchRequest,
  DatalabShoppingResponse,
  NaverWebSearchParams,
  DatalabShoppingCategoryRequest,
  DatalabShoppingDeviceRequest,
  DatalabShoppingGenderRequest,
  DatalabShoppingAgeRequest,
  DatalabShoppingKeywordsRequest,
  DatalabShoppingKeywordRequest,
  NaverDocumentSearchResponse,
} from "./types/naver-search.types.js";

/**
 * NaverSearchClient - A singleton client for interacting with Naver's APIs
 * Handles search, DataLab, and Vision API requests
 */
export class NaverSearchClient {
  private static instance: NaverSearchClient | null = null;
  private readonly searchBaseUrl = "https://openapi.naver.com/v1/search";
  private readonly datalabBaseUrl = "https://openapi.naver.com/v1/datalab";
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
  private getHeaders(
    contentType: string = "application/json"
  ): AxiosRequestConfig {
    if (!this.config) {
      throw new Error(
        "NaverSearchClient is not initialized. Please call initialize() first."
      );
    }
    const headers = {
      "X-Naver-Client-Id": this.config.clientId,
      "X-Naver-Client-Secret": this.config.clientSecret,
      "Content-Type": contentType,
    };
    return { headers };
  }

  /**
   * Generic search method that supports all search types
   */
  async search(
    params: NaverSearchParams & { type: NaverSearchType }
  ): Promise<NaverSearchResponse> {
    const { type, ...searchParams } = params;
    const response = await axios.get<NaverSearchResponse>(
      `${this.searchBaseUrl}/${type}`,
      {
        params: searchParams,
        ...this.getHeaders(),
      }
    );
    return response.data;
  }

  // Convenience methods for specific search types
  async searchNews(
    query: string,
    params?: Omit<NaverSearchParams, "query">
  ): Promise<NaverSearchResponse> {
    return this.search({ type: "news", query, ...params });
  }

  async searchBlog(params: NaverSearchParams) {
    return this.search({ type: "blog", ...params });
  }

  async searchShop(params: NaverSearchParams) {
    return this.search({ type: "shop", ...params });
  }

  async searchImage(params: NaverSearchParams) {
    return this.search({ type: "image", ...params });
  }

  async searchKin(params: NaverSearchParams) {
    return this.search({ type: "kin", ...params });
  }

  async searchBook(params: NaverSearchParams) {
    return this.search({ type: "book", ...params });
  }

  async searchDoc(
    params: NaverSearchParams
  ): Promise<NaverDocumentSearchResponse> {
    return this.search({ type: "doc", ...params });
  }

  async searchWeb(params: NaverWebSearchParams): Promise<NaverSearchResponse> {
    return this.search({ type: "webkr", ...params });
  }

  // DataLab Search API methods
  async searchTrend(params: DatalabSearchRequest): Promise<any> {
    return this.post("datalab", "/search", params);
  }

  // DataLab Shopping API methods
  async datalabShoppingCategory(
    params: DatalabShoppingCategoryRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/categories", params);
  }

  async datalabShoppingByDevice(
    params: DatalabShoppingDeviceRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/category/device", params);
  }

  async datalabShoppingByGender(
    params: DatalabShoppingGenderRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/category/gender", params);
  }

  async datalabShoppingByAge(
    params: DatalabShoppingAgeRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/category/age", params);
  }

  async datalabShoppingKeywords(
    params: DatalabShoppingKeywordsRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/category/keywords", params);
  }

  async datalabShoppingKeywordByDevice(
    params: DatalabShoppingKeywordRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/category/keyword/device", params);
  }

  async datalabShoppingKeywordByGender(
    params: DatalabShoppingKeywordRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/category/keyword/gender", params);
  }

  async datalabShoppingKeywordByAge(
    params: DatalabShoppingKeywordRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post("datalab", "/shopping/category/keyword/age", params);
  }

  /**
   * Generic POST request handler
   * @param apiType - Type of API to use (search, datalab)
   * @param endpoint - API endpoint
   * @param data - Request data
   */
  private async post(
    apiType: "search" | "datalab",
    endpoint: string,
    data: any
  ): Promise<any> {
    if (!this.config) {
      throw new Error(
        "NaverSearchClient is not initialized. Please call initialize() first."
      );
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
