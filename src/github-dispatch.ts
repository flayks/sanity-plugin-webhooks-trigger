import type {Webhook} from './types'

export const DEFAULT_GITHUB_EVENT_TYPE = 'webhook-trigger'

interface BuildWebhookRequestOptionsArgs {
  authToken?: string
  githubEventType?: string
  method?: Webhook['method']
  url?: Webhook['url']
}

export function isGithubWebhookUrl(url?: string): boolean {
  if (!url) return false

  try {
    const hostname = new URL(url).hostname
    return hostname === 'github.com' || hostname.endsWith('.github.com')
  } catch {
    return false
  }
}

export function buildWebhookRequestOptions({
  authToken,
  githubEventType,
  method,
  url,
}: BuildWebhookRequestOptionsArgs): RequestInit {
  const isGithub = isGithubWebhookUrl(url)
  // GET requests cannot carry a body, fetch throws if we attach one
  const hasBody = isGithub && method !== 'GET'
  const headers: Record<string, string> = {}

  if (authToken) headers.Authorization = `Bearer ${authToken}`
  if (isGithub) {
    headers.Accept = 'application/vnd.github+json'
    headers['X-GitHub-Api-Version'] = '2022-11-28'
  }

  return {
    method,
    headers,
    // Endpoints rarely include CORS headers; lets 'no-cors' reach the server without the browser throwing on the response
    ...(isGithub ? {} : {mode: 'no-cors'}),
    ...(hasBody && {
      body: JSON.stringify({event_type: githubEventType || DEFAULT_GITHUB_EVENT_TYPE}),
    }),
  }
}
