const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"

export interface ApiError {
    timestamp: string
    status: number
    error: string
    message: string
    fields?: Record<string, string>
}

class ApiClient {
    private getToken(): string | null {
        if (typeof window === "undefined") return null
        return localStorage.getItem("token")
    }

    private async request<T>(
        path: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken()
        const headers: Record<string, string> = {
            ...((options.headers as Record<string, string>) || {}),
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        // Don't set Content-Type for FormData (browser sets it with boundary)
        if (!(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json"
        }

        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers,
        })

        // Handle 401 — clear token and redirect to login
        if (response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("devprofile-storage")
            window.location.href = "/?auth=required"
            throw new Error("Session expired. Please log in again.")
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return undefined as T
        }

        // Try to parse response body
        const contentType = response.headers.get("content-type")
        let body: any

        if (contentType?.includes("application/json")) {
            body = await response.json()
        } else {
            body = await response.text()
        }

        if (!response.ok) {
            const apiError: ApiError = typeof body === "object"
                ? body
                : { timestamp: new Date().toISOString(), status: response.status, error: "Error", message: body || response.statusText }
            throw apiError
        }

        return body as T
    }

    get<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: "GET" })
    }

    post<T>(path: string, body?: unknown): Promise<T> {
        return this.request<T>(path, {
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
    }

    postForm<T>(path: string, formData: FormData): Promise<T> {
        return this.request<T>(path, {
            method: "POST",
            body: formData,
        })
    }

    delete<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: "DELETE" })
    }
}

export const api = new ApiClient()
