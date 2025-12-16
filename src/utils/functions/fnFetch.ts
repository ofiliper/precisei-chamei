import { APP_CONFIG } from "@/constants/app-config"

interface IOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  query?: Record<string, any>
  headers?: Record<string, string>
  httpRef?: string
  contentType?: string
  responseType?: 'json' | 'text'
}

const defaultUrl =
  process.env.NODE_ENV === 'development'
    ? APP_CONFIG.api.development
    : APP_CONFIG.api.production

export const fnFetch = async <TResponse = any>({
  url,
  method = 'POST',
  body,
  query,
  headers: customHeaders = {},
  httpRef = defaultUrl,
  contentType = 'application/json',
  responseType = 'json',
}: IOptions): Promise<fnFetch.FetchResponse<TResponse>> => {
  const urlObject = new URL(url, httpRef)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObject.searchParams.append(key, String(value))
      }
    })
  }

  const fullUrl = urlObject.href

  let requestBody: BodyInit | undefined
  const requestHeaders: HeadersInit = { ...customHeaders }

  // Check for multipart content type
  if (contentType === 'multipart/form-data' && body) {
    const formData = new FormData()

    Object.entries(body).forEach(([key, value]) => {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value)
      } else if (value) {
        formData.append(key, String(value))
      }
    })

    requestBody = formData
    delete requestHeaders['Content-Type']
  } else {
    requestBody = body && method !== 'GET' ? JSON.stringify(body) : undefined
    requestHeaders['Content-Type'] = contentType
  }

  const requestOptions: RequestInit = {
    method,
    headers: new Headers(requestHeaders),
    body: requestBody,
  }

  try {
    const response = await fetch(fullUrl, requestOptions)

    const responseData: TResponse =
      responseType === 'json' ? await response.json() : await response.text()

    if (!response.ok) {
      const errorDetails = responseData || (await response.text())
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'dev')
        console.error('Error Details:', errorDetails)

      return Promise.reject({
        ok: false,
        message: `Request failed with status ${response.status}`,
        details: errorDetails,
      })
    }

    return { ok: true, data: responseData }
  } catch (error) {
    return Promise.reject({
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

export namespace fnFetch {
  export interface FetchResponse<TResponse> {
    ok: boolean
    data: TResponse
    message?: string
    details?: {
      message: string
      method: string
      path: string
      statusCode: number
      timestamptz: Date
    }
  }
}
