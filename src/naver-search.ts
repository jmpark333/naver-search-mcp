import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import {
  NaverSearchType,
  NaverSearchConfig,
  NaverSearchParams,
  NaverSearchResponse,
  DatalabSearchRequest,
  DatalabShoppingRequest,
  DatalabShoppingResponse,
  NaverWebSearchParams,
} from "./types/naver-search.types.js";
import fs from "fs";
import path from "path";

// Types for DataLab Shopping API
interface DatalabShoppingCategoryRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: Array<{
    name: string;
    param: string[];
  }>;
  device?: string;
  gender?: string;
  ages?: string[];
}

interface DatalabShoppingKeywordRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  category: string;
  keyword: string;
  device?: string;
  gender?: string;
  ages?: string[];
}

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
  ): Promise<any> {
    return this.post("datalab", "/shopping/categories", params);
  }

  async datalabShoppingCategoryDevice(
    params: DatalabShoppingCategoryRequest
  ): Promise<any> {
    return this.post("datalab", "/shopping/category/device", params);
  }

  async datalabShoppingCategoryGender(
    params: DatalabShoppingCategoryRequest
  ): Promise<any> {
    return this.post("datalab", "/shopping/category/gender", params);
  }

  async datalabShoppingCategoryAge(
    params: DatalabShoppingCategoryRequest
  ): Promise<any> {
    return this.post("datalab", "/shopping/category/age", params);
  }

  async datalabShoppingKeywords(
    params: DatalabShoppingKeywordRequest
  ): Promise<any> {
    // API 요청 형식에 맞게 데이터 변환
    const requestData = {
      startDate: params.startDate,
      endDate: params.endDate,
      timeUnit: params.timeUnit,
      category: params.category,
      keyword: params.keyword,
      device: params.device || "",
      gender: params.gender || "",
      ages: params.ages || [],
    };

    return this.post("datalab", "/shopping/category/keywords", requestData);
  }

  async datalabShoppingKeywordDevice(
    params: DatalabShoppingKeywordRequest
  ): Promise<any> {
    // API 요청 형식에 맞게 데이터 변환
    const requestData = {
      startDate: params.startDate,
      endDate: params.endDate,
      timeUnit: params.timeUnit,
      category: params.category,
      keyword: params.keyword,
      device: params.device || "",
    };

    return this.post(
      "datalab",
      "/shopping/category/keyword/device",
      requestData
    );
  }

  async datalabShoppingKeywordGender(
    params: DatalabShoppingKeywordRequest
  ): Promise<any> {
    // API 요청 형식에 맞게 데이터 변환
    const requestData = {
      startDate: params.startDate,
      endDate: params.endDate,
      timeUnit: params.timeUnit,
      category: params.category,
      keyword: params.keyword,
      gender: params.gender || "",
    };

    return this.post(
      "datalab",
      "/shopping/category/keyword/gender",
      requestData
    );
  }

  async datalabShoppingKeywordAge(
    params: DatalabShoppingKeywordRequest
  ): Promise<any> {
    // API 요청 형식에 맞게 데이터 변환
    const requestData = {
      startDate: params.startDate,
      endDate: params.endDate,
      timeUnit: params.timeUnit,
      category: params.category,
      keyword: params.keyword,
      ages: params.ages || [],
    };

    return this.post("datalab", "/shopping/category/keyword/age", requestData);
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
