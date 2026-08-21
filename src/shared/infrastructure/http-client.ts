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

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Koneksi time out. Periksa jaringan internet Anda.";
        } else if (error.message === "Network Error") {
          errorMessage = "Gagal terhubung ke server. Pastikan backend aktif.";
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
