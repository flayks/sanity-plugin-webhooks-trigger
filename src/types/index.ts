import React from 'react'

export interface WebhooksTriggerPluginTool {
  options: {
    text: string
    encryptionSalt: string
  }
}

export interface WebhooksTriggerConfig {
  name?: string
  icon?: React.ReactNode
  title?: string
  tool?: WebhooksTriggerPluginTool
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
