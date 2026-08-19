import type {ReactNode} from 'react'

export interface WebhooksTriggerOptions {
  name?: string
  icon?: ReactNode
  title?: string
  text?: string
  encryptionSalt?: string
  githubEventType?: string
  triggerAll?: boolean
}

export interface WebhooksTriggerConfig {
  tool: {
    options: WebhooksTriggerOptions
  }
}

export interface Webhook {
  _id: string
  name: string | undefined
  url: string | undefined
  method: 'GET' | 'POST' | undefined
  authToken?: string
  githubEventType?: string
  lastRunTime?: string
  lastRunStatus?: 'success' | 'failed' | 'triggered'
  lastRunMessage?: string
}

export type RunResult = Pick<Webhook, 'lastRunStatus' | 'lastRunMessage'>

export interface WebhookFormModalProps {
  defaultGithubEventType: string
  encryptionEnabled: boolean
  webhook: Partial<Webhook>
  onClose: () => void
  onSubmit: (webhook: Partial<Webhook>) => Promise<void>
  title: string
}
