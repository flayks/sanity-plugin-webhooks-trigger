<h2 align="center">
  ⚡️ Trigger Webhooks in Sanity ⚡️
</h2>
<p align="center">
  Manually trigger Webhooks right from your Studio.<br/ >
  Useful for rebuilding your website using static site generator (Astro, SvelteKit, Next.js, 11ty, Jekyll, Hugo, etc).  
</p>

![screenshot](https://github.com/flayks/sanity-plugin-webhooks-trigger/assets/273716/7dfdf824-aa87-45a2-9e6c-66919c18081e)


## Motivation

Instead of rebuilding your site every single time a document is published using the GROQ-powered webhooks, just do it when you are (or your client is) done editing content!

For instance, you can trigger a build on [Vercel](https://vercel.com/docs/deployments/deploy-hooks), [Netlify](https://docs.netlify.com/configure-builds/build-hooks/), [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/deploy-hooks/), [Github Actions](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) or even any other Webhook or your choice.

Behind the scenes, it stores a document in your Sanity's dataset for each Webhook, with its name, URL, method (POST/GET) and the encrypted auth token if needed. It also shows the last run status and date.

Openly –and heavily– inspired from [sanity-plugin-vercel-deploy](https://github.com/ndimatteo/sanity-plugin-vercel-deploy) by [ndimatteo](https://github.com/ndimatteo).

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
import { defineConfig } from 'sanity'
import { webhooksTrigger } from 'sanity-plugin-webhooks-trigger'

export default defineConfig({
  //...
  plugins: [
    webhooksTrigger({
      // title: 'Deploy',
      // text: 'Custom text',
      // encryptionSalt: 'replace-me-with-a-strong-string',
      // /** You can customize the event type name to trigger on your Github workflows */
      // githubEventType: 'webhook-trigger',
    })
  ],
})
```

⚠️ If you are using an auth token with your Webhook, it is strongy recommended to use an encryption salt, or it could be [subject to be exposed](https://medium.com/poka-techblog/the-best-way-to-store-secrets-in-your-app-is-not-to-store-secrets-in-your-app-308a6807d3ed)!   
You can generate one using `openssl rand -hex 64` or any other method.

## License

[MIT](LICENSE) © Félix Péault (Flayks)

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
