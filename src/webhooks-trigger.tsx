import {AddIcon} from '@sanity/icons/Add'
import {ClockIcon} from '@sanity/icons/Clock'
import {EditIcon} from '@sanity/icons/Edit'
import {TokenIcon} from '@sanity/icons/Token'
import {TrashIcon} from '@sanity/icons/Trash'
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  ThemeProvider,
} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'
import {Tooltip} from '@sanity/ui/tooltip'
import {customAlphabet} from 'nanoid'
import {useCallback, useEffect, useState, type ReactElement} from 'react'
import {useClient} from 'sanity'

import {
  buildWebhookRequestOptions,
  DEFAULT_GITHUB_EVENT_TYPE,
  isGithubWebhookUrl,
} from './github-dispatch'
import WebhookFormModal from './modal'
import {decryptToken, encryptToken} from './security'
import {RunResult, Webhook, WebhooksTriggerConfig} from './types'

const theme = buildTheme()
const WEBHOOK_TYPE = 'webhook_triggers'
const generateId = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  12,
)
const defaultText =
  'Trigger webhooks right from Sanity, whether you need to rebuild a static website after content edits or run any other automated process.'

const RUN_STATUS_CONFIG = {
  success: {color: 'green', label: 'successful'},
  triggered: {color: 'orange', label: 'triggered'},
  failed: {color: 'red', label: 'failed'},
} as const

/**
 * Pull the API error out of a failed response, so it shows up in the UI instead of the console
 */
const readErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => null)
  const detail = body?.message || response.statusText

  return detail ? `${response.status}: ${detail}` : `${response.status}`
}

/**
 * Last run date, with the error behind a tooltip when the run failed
 */
const LastRun = ({webhook}: {webhook: Webhook}): ReactElement | null => {
  const {lastRunTime, lastRunStatus, lastRunMessage} = webhook
  if (!lastRunTime || !lastRunStatus) return null

  const {color, label} = RUN_STATUS_CONFIG[lastRunStatus]
  const line = (
    <Flex gap={1} align="center" style={lastRunMessage ? {cursor: 'help'} : undefined}>
      <ClockIcon fontSize={'1em'} color={color} style={{flexShrink: 0}} />
      <Text size={1} muted>
        Last {label} run: {new Date(lastRunTime).toLocaleString()}
      </Text>
    </Flex>
  )

  if (!lastRunMessage) return line

  return (
    <Tooltip
      content={
        <Box style={{maxWidth: 320}}>
          <Text size={1}>{lastRunMessage}</Text>
        </Box>
      }
      padding={2}
      placement="top"
      portal
      delay={{open: 200}}
    >
      {line}
    </Tooltip>
  )
}

const WebhooksTrigger = ({tool}: WebhooksTriggerConfig): ReactElement => {
  const {options} = tool
  const {encryptionSalt, text, githubEventType, triggerAll} = options
  const defaultGithubEventType = githubEventType || DEFAULT_GITHUB_EVENT_TYPE

  const client = useClient({apiVersion: '2026-08-19'})

  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  // Holds the webhook being edited, or an empty object when adding a new one
  const [modalWebhook, setModalWebhook] = useState<Partial<Webhook> | null>(null)
  const [triggeringWebhook, setTriggeringWebhook] = useState<string | null>(null)
  const [triggeringAll, setTriggeringAll] = useState(false)
  const [deletingWebhook, setDeletingWebhook] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState<Webhook | null>(null)

  /**
   * Fetch all Webhooks
   */
  const fetchWebhooks = useCallback(async () => {
    setWebhooks(await client.fetch(`*[_type == "${WEBHOOK_TYPE}"] | order(_createdAt asc)`))
  }, [client])

  useEffect(() => {
    // Loading the list is exactly the external-system sync an effect is for
    // oxlint-disable-next-line react/set-state-in-effect
    void fetchWebhooks()
  }, [fetchWebhooks])

  /**
   * Handle the Webhook form submission
   */
  const handleSubmitWebhook = useCallback(
    async (webhook: Partial<Webhook>) => {
      if (!webhook.name || !webhook.url || !webhook.method) return

      if (webhook.authToken && encryptionSalt) {
        webhook.authToken = encryptToken(webhook.authToken, encryptionSalt)
      }

      if (webhook._id) {
        // Edit webhook
        let patch = client.patch(webhook._id).set(webhook)
        if (!webhook.githubEventType) patch = patch.unset(['githubEventType'])
        await patch.commit()
      } else {
        // Create new webhook
        await client.create({
          ...webhook,
          _type: WEBHOOK_TYPE,
          // The dot keeps the document private: it needs an authenticated read
          _id: `${WEBHOOK_TYPE}.${generateId()}`,
        })
      }

      setModalWebhook(null)
      await fetchWebhooks()
    },
    [client, fetchWebhooks, encryptionSalt],
  )

  /**
   * Send a webhook request and report how it went, without touching the document
   */
  const runWebhook = useCallback(
    async (webhook: Webhook): Promise<RunResult> => {
      if (!webhook.url) return {lastRunStatus: 'failed', lastRunMessage: 'This webhook has no URL.'}

      try {
        const authToken =
          webhook.authToken && encryptionSalt
            ? decryptToken(webhook.authToken, encryptionSalt)
            : undefined

        // Non-GitHub endpoints rarely support CORS. buildWebhookRequestOptions
        // handles it with mode: 'no-cors', making the response opaque — so we
        // mark those as 'triggered' (sent successfully, outcome unknown).
        const isGithub = isGithubWebhookUrl(webhook.url)
        const response = await fetch(
          webhook.url,
          buildWebhookRequestOptions({
            authToken,
            githubEventType: webhook.githubEventType || defaultGithubEventType,
            method: webhook.method,
            url: webhook.url,
          }),
        )

        if (!isGithub) return {lastRunStatus: 'triggered'}
        if (response.ok) return {lastRunStatus: 'success'}

        return {lastRunStatus: 'failed', lastRunMessage: await readErrorMessage(response)}
      } catch (error) {
        console.error('Failed to trigger webhook:', error)

        return {
          lastRunStatus: 'failed',
          lastRunMessage: error instanceof Error ? error.message : String(error),
        }
      }
    },
    [defaultGithubEventType, encryptionSalt],
  )

  /**
   * Fire every request in parallel, then record all results in a single transaction
   */
  const triggerWebhooks = useCallback(
    async (targets: Webhook[]) => {
      if (!targets.length) return

      const results = await Promise.all(targets.map(runWebhook))
      const transaction = targets.reduce((tx, webhook, index) => {
        const {lastRunStatus, lastRunMessage} = results[index]
        const patch = client
          .patch(webhook._id)
          .set({lastRunTime: new Date().toISOString(), lastRunStatus})

        return tx.patch(
          lastRunMessage ? patch.set({lastRunMessage}) : patch.unset(['lastRunMessage']),
        )
      }, client.transaction())

      await transaction.commit()
      await fetchWebhooks()
    },
    [client, fetchWebhooks, runWebhook],
  )

  /**
   * Trigger a single webhook and record its status
   */
  const handleTriggerWebhook = useCallback(
    async (webhook: Webhook) => {
      setTriggeringWebhook(webhook._id)
      await triggerWebhooks([webhook])
      setTriggeringWebhook(null)
    },
    [triggerWebhooks],
  )

  /**
   * Handle triggering all webhooks
   */
  const handleTriggerAllWebhooks = useCallback(async () => {
    setTriggeringAll(true)
    await triggerWebhooks(webhooks)
    setTriggeringAll(false)
  }, [triggerWebhooks, webhooks])

  /**
   * Delete a Webhook
   */
  const handleDeleteWebhook = useCallback(
    async (webhook: Webhook) => {
      setConfirmingDelete(null)
      setDeletingWebhook(webhook._id)
      try {
        await client.delete(webhook._id)
        await fetchWebhooks()
      } catch (error) {
        console.error('Failed to delete webhook:', error)
      } finally {
        setDeletingWebhook(null)
      }
    },
    [client, fetchWebhooks],
  )

  return (
    <ThemeProvider theme={theme}>
      <Container width={2}>
        {/* Intro text */}
        <Box padding={4} marginTop={5}>
          <Flex
            gap={4}
            align="flex-start"
            direction={['column', 'column', 'row']}
            justify={['flex-start', 'flex-start', 'space-between']}
          >
            <Stack gap={4} style={{flex: 1, minWidth: 0}}>
              <Heading as="h2" size={3}>
                Deploy via Webhooks
              </Heading>
              <Text size={2} style={{maxWidth: '70ch'}}>
                {text || defaultText}
              </Text>
            </Stack>

            <Box style={{flexShrink: 0}}>
              <Button
                icon={AddIcon}
                text="Add Webhook"
                tone="primary"
                onClick={() => setModalWebhook({})}
              />
            </Box>
          </Flex>

          {/* Has items */}
          {webhooks.length > 0 ? (
            <>
              <Stack gap={4} marginTop={[5, 5, 6]}>
                {webhooks.map((webhook) => {
                  const isTriggering = triggeringAll || triggeringWebhook === webhook._id

                  return (
                    <Card key={webhook._id} padding={3} radius={2} shadow={1}>
                      <Flex
                        align="flex-start"
                        direction={['column', 'column', 'row']}
                        justify={['flex-start', 'flex-start', 'space-between']}
                      >
                        <Stack gap={1}>
                          <Heading as="h3" size={1} style={{marginBottom: '0.5em'}}>
                            {webhook.name}
                          </Heading>

                          <Box
                            style={{
                              display: 'grid',
                              gridTemplateColumns: `${webhook.authToken ? 'auto ' : ''}minmax(0, 1fr) auto`,
                              alignItems: 'center',
                              columnGap: 4,
                              width: '100%',
                            }}
                          >
                            {webhook.authToken && <TokenIcon fontSize={'1em'} />}
                            <Text size={1} muted title={webhook.url} textOverflow="ellipsis">
                              {webhook.url}
                            </Text>
                            <Text size={1} muted style={{whiteSpace: 'nowrap'}}>
                              ({webhook.method})
                            </Text>
                          </Box>

                          {isGithubWebhookUrl(webhook.url) && webhook.githubEventType && (
                            <Text size={1} muted>
                              GitHub event type: {webhook.githubEventType}
                            </Text>
                          )}

                          <LastRun webhook={webhook} />
                        </Stack>

                        <Box marginTop={[3, 3, 0]}>
                          <Flex
                            gap={2}
                            wrap="wrap"
                            justify={['flex-start', 'flex-start', 'flex-end']}
                          >
                            <Button
                              tone="positive"
                              onClick={() => handleTriggerWebhook(webhook)}
                              disabled={isTriggering}
                              text={isTriggering ? undefined : 'Trigger'}
                              icon={isTriggering ? Spinner : undefined}
                            />
                            <Button
                              icon={EditIcon}
                              mode="bleed"
                              onClick={() => setModalWebhook(webhook)}
                            />
                            <Button
                              icon={deletingWebhook === webhook._id ? Spinner : TrashIcon}
                              mode="bleed"
                              onClick={() => setConfirmingDelete(webhook)}
                              disabled={deletingWebhook === webhook._id}
                            />
                          </Flex>
                        </Box>
                      </Flex>
                    </Card>
                  )
                })}
              </Stack>

              {triggerAll !== false && webhooks.length > 1 && (
                <Flex marginTop={4} justify="flex-end">
                  <Button
                    tone="positive"
                    onClick={handleTriggerAllWebhooks}
                    disabled={triggeringAll || triggeringWebhook !== null}
                    text={triggeringAll ? undefined : 'Trigger All'}
                    icon={triggeringAll ? Spinner : undefined}
                  />
                </Flex>
              )}
            </>
          ) : (
            // No items: Show a message with a button
            <Card padding={4} radius={2} shadow={1} marginTop={[5, 5, 6]}>
              <Flex direction="column" align="center" gap={3}>
                <Card paddingY={5}>
                  <Text>No webhook yet</Text>
                </Card>
                <Button
                  width="fill"
                  icon={AddIcon}
                  text="Add Webhook"
                  tone="primary"
                  onClick={() => setModalWebhook({})}
                />
              </Flex>
            </Card>
          )}
        </Box>

        {modalWebhook && (
          <WebhookFormModal
            defaultGithubEventType={defaultGithubEventType}
            encryptionEnabled={Boolean(encryptionSalt)}
            webhook={modalWebhook}
            onClose={() => setModalWebhook(null)}
            onSubmit={handleSubmitWebhook}
            title={modalWebhook._id ? 'Edit Webhook' : 'Add New Webhook'}
          />
        )}

        {confirmingDelete && (
          <Dialog
            header="Delete Webhook"
            id="webhook-delete-dialog"
            onClose={() => setConfirmingDelete(null)}
            onClickOutside={() => setConfirmingDelete(null)}
            width={0}
            zOffset={1000}
            footer={
              <Flex gap={2} justify="flex-end" padding={3}>
                <Button text="Cancel" mode="bleed" onClick={() => setConfirmingDelete(null)} />
                <Button
                  text="Delete"
                  tone="critical"
                  onClick={() => handleDeleteWebhook(confirmingDelete)}
                />
              </Flex>
            }
          >
            <Box padding={4}>
              <Text>
                Delete <strong>{confirmingDelete.name}</strong>? This cannot be undone.
              </Text>
            </Box>
          </Dialog>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default WebhooksTrigger
