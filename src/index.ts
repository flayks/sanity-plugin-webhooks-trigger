import {definePlugin} from 'sanity'
import {route} from 'sanity/router'

import type {WebhooksTriggerOptions} from './types'
import WebhooksTrigger from './webhooks-trigger'

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import { defineConfig } from 'sanity'
 * import { webhooksTrigger } from 'sanity-plugin-webhooks-trigger'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [
 *     webhooksTrigger(),
 *   ],
 * })
 * ```
 */
export const webhooksTrigger = definePlugin<WebhooksTriggerOptions | void>((config) => {
  const {name, title, encryptionSalt, text, githubEventType} = config || {}

  return {
    name: 'sanity-plugin-webhooks-trigger',
    tools: [
      {
        name: name || 'webhooks-trigger',
        title: title || 'Deploy',
        component: WebhooksTrigger,
        options: {
          encryptionSalt,
          text,
          githubEventType: githubEventType || 'webhook-trigger',
        },
        router: route.create('/*'),
      },
    ],
  }
})
