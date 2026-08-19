import {Box, Button, Dialog, Grid, Label, Select, Spinner, Stack, Text, TextInput} from '@sanity/ui'
import {ReactElement, useState, type SubmitEvent} from 'react'

import {isGithubWebhookUrl} from './github-dispatch'
import {Webhook, WebhookFormModalProps} from './types'

const WebhookFormModal = ({
  defaultGithubEventType,
  encryptionEnabled,
  webhook,
  onSubmit,
  onClose,
  title,
}: WebhookFormModalProps): ReactElement => {
  const [name, setName] = useState(webhook.name)
  const [url, setUrl] = useState(webhook.url)
  const [method, setMethod] = useState(webhook.method)
  const [githubEventType, setGithubEventType] = useState(webhook.githubEventType)
  // Never prefill: stored token is encrypted, resubmitting would encrypt it twice
  const [authToken, setAuthToken] = useState<Webhook['authToken']>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasStoredToken = Boolean(webhook.authToken)
  const showGithubEventType = isGithubWebhookUrl(url)

  const buttonText = webhook._id ? 'Save changes' : 'Add Webhook'

  /**
   * Handle form submission
   */
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const {authToken: _token, githubEventType: _eventType, ...rest} = webhook

    await onSubmit({
      ...rest,
      name,
      url,
      method,
      ...(authToken && {authToken}),
      ...(githubEventType && {githubEventType}),
    })

    setIsSubmitting(false)
  }

  return (
    <Dialog header={title} id="webhook-form-dialog" onClose={onClose} width={1} zOffset={1000}>
      <Box padding={4}>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Stack gap={3}>
              <Label as="label" htmlFor="webhook-name">
                Name
              </Label>
              <TextInput
                id="webhook-name"
                value={name}
                placeholder="Cloudflare: Development, GH Action: Production…"
                required
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </Stack>

            <Stack gap={3}>
              <Label as="label" htmlFor="webhook-url">
                Webhook URL
              </Label>
              <TextInput
                id="webhook-url"
                type="url"
                value={url}
                placeholder="https://provider.tld/webhook/url"
                required
                onChange={(event) => setUrl(event.currentTarget.value)}
              />
            </Stack>

            <Grid gridTemplateColumns={[1, 1, 2]} gap={4}>
              <Stack gap={3}>
                <Label as="label" htmlFor="webhook-method">
                  Method
                </Label>
                <Select
                  id="webhook-method"
                  value={method}
                  required
                  onChange={(event) => {
                    const {value} = event.currentTarget
                    setMethod(value === 'GET' || value === 'POST' ? value : undefined)
                  }}
                >
                  <option value="" disabled>
                    Select a method
                  </option>
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </Select>
              </Stack>
              <Stack gap={3}>
                <Label as="label" htmlFor="webhook-auth-token">
                  Auth Token (Optional)
                </Label>
                <TextInput
                  id="webhook-auth-token"
                  type="password"
                  value={authToken}
                  placeholder={hasStoredToken ? 'Leave empty to keep current' : 'sk-abc123…'}
                  onChange={(event) => setAuthToken(event.currentTarget.value || undefined)}
                />
                {!encryptionEnabled && (
                  <Text size={1} muted>
                    ⚠️ No <code>encryptionSalt</code> configured: the token is stored unencrypted.
                  </Text>
                )}
              </Stack>
            </Grid>

            {showGithubEventType && (
              <Stack gap={3}>
                <Label as="label" htmlFor="webhook-github-event-type">
                  GitHub Event Type (Optional)
                </Label>
                <TextInput
                  id="webhook-github-event-type"
                  value={githubEventType}
                  placeholder={defaultGithubEventType}
                  onChange={(event) => setGithubEventType(event.currentTarget.value || undefined)}
                />
                <Text size={1} muted>
                  Used for GitHub repository dispatch requests. If omitted, this webhook uses{' '}
                  {defaultGithubEventType}.
                </Text>
              </Stack>
            )}

            <Button
              type="submit"
              text={isSubmitting ? undefined : buttonText}
              textAlign="center"
              justify="center"
              tone="primary"
              icon={isSubmitting ? Spinner : undefined}
              disabled={isSubmitting}
              style={{minHeight: 33}}
            />
          </Stack>
        </form>
      </Box>
    </Dialog>
  )
}

export default WebhookFormModal
