import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Base API Configuration
 * In local environment, maps to Neocentra Bank Customer Service Backend (Port 8085)
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8085";

class HttpClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  private setupInterceptors() {
    // Request Interceptor: Attach JWT Bearer Token if exists
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Normalize API errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string; error?: string }>) => {
        let errorMessage = "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.";

        let errorData: any = error.response?.data;
        if (
          errorData instanceof ArrayBuffer ||
          (errorData && errorData.byteLength !== undefined)
        ) {
          try {
            const text = new TextDecoder().decode(new Uint8Array(errorData));
            errorData = JSON.parse(text);
          } catch {
            // Biarkan jika gagal parse
          }
        }

        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Koneksi time out. Periksa jaringan internet Anda.";
        } else if (error.message === "Network Error") {
          errorMessage = "Gagal terhubung ke server. Pastikan backend aktif.";
        }

        // 401 Unauthorized handling (token expired / invalid)
        if (error.response?.status === 401) {
          try {
            const { useAuthStore } = require("@/modules/auth/application/store/useAuthStore");
            useAuthStore.getState().logout();
          } catch {
            // Ignore circular require errors
          }
        }

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  public get instance(): AxiosInstance {
    return this.client;
  }
}

export const httpClient = new HttpClient();
export const api = httpClient.instance;
