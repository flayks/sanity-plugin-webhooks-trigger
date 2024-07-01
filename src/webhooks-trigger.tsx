/* eslint-disable react/jsx-no-bind */
import {AddIcon, ClockIcon, EditIcon, TrashIcon} from '@sanity/icons'
import {TokenIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  ThemeProvider,
} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'
import {customAlphabet} from 'nanoid'
import {ReactElement, useCallback, useEffect, useState} from 'react'
import {useClient} from 'sanity'

import WebhookFormModal from './modal'
import {decryptToken, encryptToken} from './security'
import {Webhook, WebhooksTriggerConfig} from './types'

const theme = buildTheme()
const WEBHOOK_TYPE = 'webhook_triggers'
const defaultText =
  'You can here deploy your static website after finishing content edits by manually calling a webhook that triggers a new build of your site. Or simply run a webhook from Sanity!'

const WebhooksTrigger = ({tool}: WebhooksTriggerConfig): ReactElement => {
  const {options} = tool
  const encryptionSalt = options.encryptionSalt

  const client = useClient({apiVersion: '2021-06-07'})

  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [showModal, setShowModal] = useState(false)
  const [triggeringWebhook, setTriggeringWebhook] = useState<string | null>(null)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [deletingWebhook, setDeletingWebhook] = useState<string | null>(null)

  /**
   * Fetch all Webhooks
   */
  const fetchWebhooks = useCallback(async () => {
    const result = await client.fetch(`*[_type == "${WEBHOOK_TYPE}"]`)
    setWebhooks(result)
  }, [client])

  useEffect(() => {
    fetchWebhooks()
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
        await client.patch(webhook._id).set(webhook).commit()
      } else {
        // Create new webhook
        await client.create({
          _type: WEBHOOK_TYPE,
          _id: `${WEBHOOK_TYPE}.${customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12)()}`,
          ...webhook,
        })
      }

      setShowModal(false)
      setEditingWebhook(null)
      fetchWebhooks()
    },
    [client, fetchWebhooks, encryptionSalt],
  )

  /**
   * Close a modal
   */
  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setEditingWebhook(null)
  }, [])

  /**
   * Handle the Webhook triggering
   */
  const handleTriggerWebhook = useCallback(
    async (webhook: Webhook) => {
      if (webhook.url) {
        setTriggeringWebhook(webhook._id)

        const hostname = new URL(webhook.url).hostname
        const isGithubAction = hostname === 'github.com' || hostname.endsWith('.github.com')

        try {
          const response = await fetch(webhook.url, {
            method: webhook.method,
            headers: {
              ...(webhook.authToken &&
                encryptionSalt && {
                  Authorization: `Bearer ${decryptToken(webhook.authToken, encryptionSalt)}`,
                }),
              ...(isGithubAction && {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
              }),
            },
            body: JSON.stringify({
              ...(isGithubAction && {
                // eslint-disable-next-line camelcase
                event_type: 'webhook-trigger',
              }),
            }),
          })

          await client
            .patch(webhook._id)
            .set({
              lastRunTime: new Date().toISOString(),
              lastRunStatus: response.ok ? 'success' : 'failed',
            })
            .commit()
        } catch (error) {
          console.error('Failed to trigger webhook:', error)

          await client
            .patch(webhook._id)
            .set({
              lastRunTime: new Date().toISOString(),
              lastRunStatus: 'failed',
            })
            .commit()
        }

        // Refresh the list to show updated status
        fetchWebhooks()
        setTriggeringWebhook(null)
      }
    },
    [client, fetchWebhooks, encryptionSalt],
  )

  /**
   * Delete a Webhook
   */
  const handleDeleteWebhook = useCallback(
    async (webhook: Webhook) => {
      setDeletingWebhook(webhook._id)
      try {
        await client.delete(webhook._id)
        fetchWebhooks()
      } catch (error) {
        console.error('Failed to delete webhook:', error)
      } finally {
        setDeletingWebhook(null)
      }
    },
    [client, fetchWebhooks],
  )

  /**
   * Open modal for editing a webhook
   */
  const handleEditWebhook = useCallback((webhook: Webhook) => {
    setEditingWebhook(webhook)
    setShowModal(true)
  }, [])

  /**
   * Open modal for adding a new webhook
   */
  const handleAddWebhook = useCallback(() => {
    setShowModal(true)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container width={2}>
        {/* Intro text */}
        <Box padding={4} marginTop={5}>
          <Flex gap={4} align="flex-start">
            <Stack space={4}>
              <Heading as="h2" size={3}>
                Deploy via Webhooks
              </Heading>
              <Text size={2} style={{maxWidth: '70ch'}}>
                {options.text || defaultText}
              </Text>
            </Stack>

            <Card style={{marginLeft: 'auto'}}>
              <Button icon={AddIcon} text="Add Webhook" tone="primary" onClick={handleAddWebhook} />
            </Card>
          </Flex>

          {/* Has items */}
          {webhooks.length > 0 ? (
            <Stack space={4} marginTop={6}>
              {webhooks.map((webhook) => (
                <Card key={webhook._id} padding={3} radius={2} shadow={1}>
                  <Flex justify="space-between" align="flex-start">
                    <Stack space={1}>
                      <Heading as="h3" size={1} style={{marginBottom: '0.5em'}}>
                        {webhook.name}
                      </Heading>

                      <Flex gap={1} align="center">
                        {webhook.authToken && <TokenIcon fontSize={'1em'} />}
                        <Text size={1} muted>
                          {webhook.url} ({webhook.method})
                        </Text>
                      </Flex>

                      {webhook.lastRunTime && webhook.lastRunStatus && (
                        <Flex gap={1} align="center">
                          <ClockIcon
                            fontSize={'1em'}
                            color={webhook.lastRunStatus === 'success' ? 'green' : 'red'}
                          />
                          <Text size={1} muted>
                            Last {webhook.lastRunStatus === 'success' ? 'successful' : 'failed'}{' '}
                            run: {new Date(webhook.lastRunTime).toLocaleString()}
                          </Text>
                        </Flex>
                      )}
                    </Stack>

                    <Flex>
                      <Button
                        tone="positive"
                        onClick={() => handleTriggerWebhook(webhook)}
                        disabled={triggeringWebhook === webhook._id}
                        style={{marginRight: '8px'}}
                      >
                        {triggeringWebhook === webhook._id ? (
                          <Spinner size={1} />
                        ) : (
                          <Text size={1}>Trigger</Text>
                        )}
                      </Button>
                      <Button
                        icon={EditIcon}
                        tone="default"
                        onClick={() => handleEditWebhook(webhook)}
                        style={{marginRight: '8px'}}
                      />
                      <Button
                        icon={deletingWebhook === webhook._id ? Spinner : TrashIcon}
                        tone="default"
                        onClick={() => handleDeleteWebhook(webhook)}
                        disabled={deletingWebhook === webhook._id}
                      />
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Stack>
          ) : (
            // No items: Show a message with a button
            <Card padding={4} radius={2} shadow={1} marginTop={6}>
              <Flex direction="column" align="center" gap={3}>
                <Card paddingY={5}>
                  <Text>No webhook yet</Text>
                </Card>
                <Button
                  width="fill"
                  icon={AddIcon}
                  text="Add Webhook"
                  tone="primary"
                  onClick={handleAddWebhook}
                />
              </Flex>
            </Card>
          )}
        </Box>

        {showModal && (
          <WebhookFormModal
            webhook={editingWebhook || {}}
            onClose={handleCloseModal}
            onSubmit={handleSubmitWebhook}
            title={editingWebhook ? 'Edit Webhook' : 'Add New Webhook'}
          />
        )}
      </Container>
    </ThemeProvider>
  )
}

export default WebhooksTrigger
