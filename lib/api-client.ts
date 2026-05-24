const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"

export interface ApiError {
    timestamp: string
    status: number
    error: string
    message: string
    fields?: Record<string, string>
}

/**
 * HTTP client that talks to the Spring backend.
 *
 * Auth model:
 *   - The JWT lives in an httpOnly cookie set by POST /api/auth/login. We
 *     never see the token in JavaScript — that's the whole point: XSS-injected
 *     scripts can't exfiltrate it. We just need `credentials: "include"` so
 *     the browser attaches the cookie on every cross-origin request.
 *   - The login response body contains a CSRF token (embedded as a claim in
 *     the JWT). The frontend stores it in memory and echoes it as
 *     `X-CSRF-Token` on every mutating request; the backend's CsrfFilter
 *     compares it to the JWT's `csrf` claim in constant time.
 *
 * The CSRF token is set imperatively via {@link setCsrfToken} from the auth
 * store on login / bootstrap / logout.
 */
class ApiClient {

    private csrfToken: string | null = null

    setCsrfToken(token: string | null): void {
        this.csrfToken = token
    }

    private async request<T>(
        path: string,
        options: RequestInit = {}
    ): Promise<T> {
        const method = (options.method ?? "GET").toUpperCase()
        const headers: Record<string, string> = {
            ...((options.headers as Record<string, string>) || {}),
        }

        // Don't set Content-Type for FormData (browser sets it with boundary)
        if (!(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json"
        }

        // Attach the CSRF token on mutating requests. Auth endpoints don't need it.
        if (this.csrfToken
                && (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE")
                && !path.startsWith("/api/auth/")) {
            headers["X-CSRF-Token"] = this.csrfToken
        }

        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            credentials: "include",
            headers,
        })

        // 401 → not logged in (or cookie expired). Clear local state and bounce to landing.
        // Skip the redirect when calling /api/user/me from the layout — it's a probe and
        // a 401 just means "no session yet", not "session expired."
        if (response.status === 401) {
            if (!path.endsWith("/api/user/me")) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("devprofile-storage")
                    // Broadcast logout to other tabs.
                    localStorage.setItem("logout-event", String(Date.now()))
                    window.location.href = "/?auth=required"
                }
            }
            throw {
                timestamp: new Date().toISOString(),
                status: 401,
                error: "Unauthorized",
                message: "Session expired. Please log in again."
            } as ApiError
        }

        // 204 No Content
        if (response.status === 204) {
            return undefined as T
        }

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

    put<T>(path: string, body?: unknown): Promise<T> {
        return this.request<T>(path, {
            method: "PUT",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
    }

    delete<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: "DELETE" })
    }
}

export const api = new ApiClient()
