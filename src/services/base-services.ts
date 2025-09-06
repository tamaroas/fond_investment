/**
 * Service de base pour effectuer des requêtes HTTP avec fetch
 * Cette classe peut être héritée par d'autres services qui ont besoin de faire des appels API
 */
import cookies from "js-cookie";

export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "https://backend.latrust.fr/api/v1";
console.log(BASE_API_URL);

// Simple flag to prevent infinite refresh loops
let isRefreshing = false;

export class HttpService {
  protected headers: HeadersInit;

  constructor() {
    const accessToken = cookies.get("access_token");
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    };
    if (accessToken) {
      this.setAuthToken(accessToken);
    }
  }

  /**
   * Configure les headers pour les requêtes
   * @param headers Les headers à ajouter ou remplacer
   */
  protected setHeaders(headers: HeadersInit): void {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * Ajoute le token d'authentification aux headers
   * @param token Le token d'authentification
   */
  protected setAuthToken(token: string): void {
    this.setHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Effectue une requête GET
   * @param endpoint L'endpoint de l'API
   * @param params Les paramètres de requête (optionnel)
   * @returns Une promesse avec la réponse
   */
  protected async get<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const request = () =>
      fetch(url, {
        method: "GET",
        credentials: "include",
        headers: this.headers,
      });
    const response = await request();
    return this.handleResponse<T>(response, request);
  }

  /**
   * Effectue une requête POST
   * @param endpoint L'endpoint de l'API
   * @param data Les données à envoyer
   * @returns Une promesse avec la réponse
   */
  protected async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    console.log('POST request to:', url, 'with data:', data);
    const request = () =>
      fetch(url, {
        method: "POST",
        headers: this.headers,
        credentials: "include",
        body: JSON.stringify(data),
      });
    // debugger;
    const response = await request();
    return this.handleResponse<T>(response, request);
  }

  /**
   * Effectue une requête PUT
   * @param endpoint L'endpoint de l'API
   * @param data Les données à envoyer
   * @returns Une promesse avec la réponse
   */
  protected async put<T>(endpoint: string, data: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const request = () =>
      fetch(url, {
        method: "PUT",
        headers: this.headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

    const response = await request();

    return this.handleResponse<T>(response, request);
  }

  protected async logout(): Promise<void> {
    // Clear tokens
    cookies.remove("access_token");
    cookies.remove("refresh_token");
    localStorage.removeItem("user-store");
    // Reset refresh flag
    isRefreshing = false;

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  /**
   * Effectue une requête PATCH
   * @param endpoint L'endpoint de l'API
   * @param data Les données à envoyer
   * @returns Une promesse avec la réponse
   */
  protected async patch<T>(endpoint: string, data: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const request = () =>
      fetch(url, {
        method: "PATCH",
        headers: this.headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

    const response = await request();

    return this.handleResponse<T>(response, request);
  }

  /**
   * Effectue une requête DELETE
   * @param endpoint L'endpoint de l'API
   * @returns Une promesse avec la réponse
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    const request = () =>
      fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: this.headers,
      });

    const response = await request();

    return this.handleResponse<T>(response, request);
  }

  /**
   * Construit l'URL complète avec les paramètres de requête
   * @param endpoint L'endpoint de l'API
   * @param params Les paramètres de requête (optionnel)
   * @returns L'URL complète
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${BASE_API_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Gère la réponse de la requête
   * @param response La réponse de fetch
   * @returns Les données de la réponse
   * @throws Une erreur si la requête a échoué
   */
  private async handleResponse<T>(
    response: Response,
    originalRequest?: () => Promise<Response>
  ): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      // If 401 and refreshToken is available, try to refresh and retry the request
      if (response.status === 401) {
        // If already refreshing, don't try again - prevents infinite loops
        if (isRefreshing) {
          await this.logout();
          throw {
            status: 401,
            statusText: "Unauthorized",
            data: { message: "Session expired. Please log in again." },
          };
        }

        try {
          // Set refreshing flag to true
          isRefreshing = true;

          const { data } = await this.refreshToken();
          this.setAuthToken(data.access_token);

          // Reset refreshing flag
          isRefreshing = false;

          if (originalRequest) {
            const retryResponse = await originalRequest();
            return await this.handleResponse<T>(retryResponse);
          }
        } catch (refreshError) {
          // If refresh fails, logout and redirect to login page
          await this.logout();

          throw {
            status: 401,
            statusText: "Unauthorized",
            data: { message: "Session expired. Please log in again." },
          };
        }
      }

      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };
    }

    // handle empty or non-JSON responses
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  refreshToken = (): Promise<{ data: any; status: number }> => {
    return this.get("/auth/refreshToken");
  };
}
