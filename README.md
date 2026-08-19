<h2 align="center">
  ⚡️ Trigger Webhooks in Sanity ⚡️
</h2>
<p align="center">
  Trigger external webhooks right in your Sanity Studio.<br>
  Useful for rebuilding your website using a static site generator (Astro, SvelteKit, Next.js, Nuxt, 11ty, Jekyll, Hugo, etc).
</p>

![screenshot](https://github.com/flayks/sanity-plugin-webhooks-trigger/assets/273716/7dfdf824-aa87-45a2-9e6c-66919c18081e)

## Motivation

Rebuilding a static site on every single publish is wasteful and noisy, especially when an editor is working through a dozen documents in a row. This plugin gives them one button to press once they are actually done.

For instance, you can trigger a build on [Vercel](https://vercel.com/docs/deployments/deploy-hooks), [Netlify](https://docs.netlify.com/configure-builds/build-hooks/), [Cloudflare Workers/Pages](https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/), [GitHub Actions](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event), or any webhook that accepts a plain GET or POST.

Behind the scenes, it stores a document in your Sanity dataset for each webhook, with its name, URL, method (POST/GET) and the encrypted auth token if needed. It also shows the last run status and date.

Openly –and heavily– inspired from [sanity-plugin-vercel-deploy](https://github.com/ndimatteo/sanity-plugin-vercel-deploy) by [ndimatteo](https://github.com/ndimatteo).

## External webhooks, not Sanity webhooks

This plugin fires the webhooks _you_ own, and has nothing to do with [Sanity's own GROQ-powered webhooks](https://www.sanity.io/docs/content-lake/webhooks). They solve opposite problems:

|            | Sanity webhooks                                 | This plugin                     |
| ---------- | ----------------------------------------------- | ------------------------------- |
| Who fires  | The Content Lake, automatically                 | An editor, by pressing a button |
| When       | On every matching content change                | Only when someone decides to    |
| Configured | In [sanity.io/manage](https://sanity.io/manage) | In the Studio itself            |
| Payload    | The document that changed                       | None, just the request          |

You can use both: Sanity webhooks to react to content, this plugin to let people say "I'm done editing, ship it".

## Installation

```sh
# npm
npm i sanity-plugin-webhooks-trigger

# yarn
yarn install sanity-plugin-webhooks-trigger

# pnpm
pnpm i sanity-plugin-webhooks-trigger

# bun
bun i sanity-plugin-webhooks-trigger
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {webhooksTrigger} from 'sanity-plugin-webhooks-trigger'

export default defineConfig({
  //...
  plugins: [
    webhooksTrigger({
      // title: 'Deploy',
      // text: 'Custom text',
      // encryptionSalt: 'replace-me-with-a-strong-string',
      // /** Default event type for GitHub repository dispatch webhooks */
      // githubEventType: 'webhook-trigger',
      // /** Disable the "Trigger All" button when there are multiple webhooks */
      // triggerAll: false,
    }),
  ],
})
```

### GitHub repository dispatch

Webhooks pointing at `api.github.com` get a **GitHub Event Type** field, which has to match your workflow's `types` — otherwise GitHub accepts the request and silently starts nothing. It falls back to the plugin-level `githubEventType`, then to `webhook-trigger`.

```yaml
on:
  repository_dispatch:
    types: [deploy-website]
```

The token needs the **Contents: read and write** permission. For an organisation repository, create the fine-grained token with the organisation as resource owner and have an admin approve it.

## Auth tokens

Webhook documents are created with a `.` in their `_id`, which [keeps them readable only by authenticated users](https://www.sanity.io/docs/ids). Set an `encryptionSalt` to also encrypt the token at rest — generate one with `openssl rand -hex 64`. Without it, tokens are stored in plain text.

⚠️ The salt ships in your Studio bundle, so encryption protects against a dataset dump, not against someone who can log into your Studio — [storing secrets in an app is never really safe](https://medium.com/poka-techblog/the-best-way-to-store-secrets-in-your-app-is-not-to-store-secrets-in-your-app-308a6807d3ed). Prefer the least powerful token that does the job: a deploy hook URL needs none at all, while a GitHub PAT for `repository_dispatch` requires `Contents: read and write`, which also allows pushing code.

Changing the salt later makes saved tokens undecryptable: runs fail with an explicit error and you have to re-enter each token.

## License

[MIT](LICENSE) © Félix Péault (Flayks)

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
