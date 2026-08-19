import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildWebhookRequestOptions,
  DEFAULT_GITHUB_EVENT_TYPE,
  isGithubWebhookUrl,
} from '../src/github-dispatch.ts'

/** Narrows the request body to a string before parsing it */
const parseBody = (body: BodyInit | null | undefined): unknown => {
  assert.ok(typeof body === 'string')

  return JSON.parse(body)
}

test('detects GitHub webhook URLs', () => {
  assert.equal(isGithubWebhookUrl('https://api.github.com/repos/acme/repo/dispatches'), true)
  assert.equal(isGithubWebhookUrl('https://example.com/webhook'), false)
  assert.equal(isGithubWebhookUrl('not-a-url'), false)
})

test('uses the provided GitHub event type in the request body', () => {
  const requestOptions = buildWebhookRequestOptions({
    githubEventType: 'webhook-specific',
    method: 'POST',
    url: 'https://api.github.com/repos/acme/repo/dispatches',
  })

  assert.deepEqual(parseBody(requestOptions.body), {
    event_type: 'webhook-specific',
  })
})

test('falls back to the built-in GitHub event type when no event type is provided', () => {
  const requestOptions = buildWebhookRequestOptions({
    method: 'POST',
    url: 'https://api.github.com/repos/acme/repo/dispatches',
  })

  assert.deepEqual(parseBody(requestOptions.body), {
    event_type: DEFAULT_GITHUB_EVENT_TYPE,
  })
})

test('never attaches a body to GET requests', () => {
  const requestOptions = buildWebhookRequestOptions({
    githubEventType: 'webhook-specific',
    method: 'GET',
    url: 'https://api.github.com/repos/acme/repo/dispatches',
  })

  assert.equal(requestOptions.body, undefined)
})

test('does not attach GitHub headers or body to non-GitHub webhooks', () => {
  const requestOptions = buildWebhookRequestOptions({
    authToken: 'secret-token',
    githubEventType: 'webhook-specific',
    method: 'POST',
    url: 'https://example.com/webhook',
  })

  assert.equal(requestOptions.body, undefined)
  assert.deepEqual(requestOptions.headers, {
    Authorization: 'Bearer secret-token',
  })
})
