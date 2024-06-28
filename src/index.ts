import {definePlugin} from 'sanity'
import {route} from 'sanity/router'

import type {WebhooksTriggerConfig} from './types'
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
export const webhooksTrigger = definePlugin<WebhooksTriggerConfig | void>((options = {}) => {
  const {name, title, ...config} = options || {}

  return {
    name: 'sanity-plugin-webhooks-trigger',
    tools: [
      {
        name: name || 'webhooks-trigger',
        title: title || 'Deploy',
        component: WebhooksTrigger,
        options: config,
        router: route.create('/*'),
      },
    ],
  }
})
