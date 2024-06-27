/* eslint-disable react/jsx-no-bind */
import {Box, Button, Dialog, Grid, Label, Select, Spinner, Stack, TextInput} from '@sanity/ui'
import {FormEvent, ReactElement, useCallback, useState} from 'react'

import {Webhook, WebhookFormModalProps} from './types'

const WebhookFormModal = ({
  webhook,
  onSubmit,
  onClose,
  title,
}: WebhookFormModalProps): ReactElement => {
  const [name, setName] = useState<Webhook['name']>(webhook.name || undefined)
  const [url, setUrl] = useState<Webhook['url']>(webhook.url || undefined)
  const [method, setMethod] = useState<Webhook['method']>(webhook.method || undefined)
  const [authToken, setAuthToken] = useState<Webhook['authToken']>(webhook.authToken || undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()

      setIsSubmitting(true)

      const updatedWebhook = {...webhook, name, url, method}
      if (authToken) {
        updatedWebhook.authToken = authToken
      }

      await onSubmit(updatedWebhook)

      setIsSubmitting(false)
    },
    [name, url, method, authToken, onSubmit, webhook],
  )

  return (
    <Dialog header={title} id="webhook-form-dialog" onClose={onClose} width={1} zOffset={1000}>
      <Box padding={4}>
        <form onSubmit={handleSubmit}>
          <Stack space={4}>
            <Stack space={3}>
              <Label htmlFor="webhook-name">Name</Label>
              <TextInput
                id="webhook-name"
                value={name}
                placeholder="Cloudflare: Development, GH Action: Production…"
                required
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </Stack>

            <Stack space={3}>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <TextInput
                id="webhook-url"
                type="url"
                value={url}
                placeholder="https://provider.tld/webhook/url"
                required
                onChange={(event) => setUrl(event.currentTarget.value)}
              />
            </Stack>

            <Grid columns={2} gap={3}>
              <Stack space={3}>
                <Label htmlFor="webhook-method">Method</Label>
                <Select
                  id="webhook-method"
                  value={method}
                  required
                  onChange={(event) => setMethod(event.currentTarget.value as 'GET' | 'POST')}
                >
                  <option value="" />
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </Select>
              </Stack>
              <Stack width="50%" space={3}>
                <Label htmlFor="webhook-auth-token">Auth Token (Optional)</Label>
                <TextInput
                  id="webhook-auth-token"
                  type="password"
                  value={authToken}
                  placeholder="sk-abc123…"
                  onChange={(event) => setAuthToken(event.currentTarget.value)}
                />
              </Stack>
            </Grid>

            <Button
              textAlign="center"
              text={webhook._id ? 'Save changes' : 'Add Webhook'}
              tone="primary"
              type="submit"
              disabled={isSubmitting}
              icon={isSubmitting ? Spinner : undefined}
            />
          </Stack>
        </form>
      </Box>
    </Dialog>
  )
}

export default WebhookFormModal
