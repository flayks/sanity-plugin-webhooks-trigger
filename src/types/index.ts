import React from 'react'

export interface WebhooksTriggerOptions {
  name?: string
  icon?: React.ReactNode
  title?: string
  text?: string
  encryptionSalt?: string
  githubEventType?: string
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
  lastRunTime?: string
  lastRunStatus?: 'success' | 'failed'
}

export interface WebhookFormModalProps {
  webhook: Partial<Webhook>
  onClose: () => void
  onSubmit: (webhook: Partial<Webhook>) => void
  title: string
}
