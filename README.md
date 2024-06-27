## sanity-plugin-trigger-webhook

This Sanity v3 plugin allows you to manually trigger Webhooks right from your Studio. That is particularly useful when you want to trigger a build on your static site generator (Astro, SvelteKit, Next.js, Elenty, etc) when you are done editing content in Sanity.  

For instance, you can trigger a build on [Vercel](https://vercel.com/docs/deployments/deploy-hooks), [Netlify](https://docs.netlify.com/configure-builds/build-hooks/), [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/deploy-hooks/), [Github Actions](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) or even any other Webhook or your choice.

Behind the scenes, it stores a document for each Webhook in Sanity's dataset, with its name, URL, method (POST/GET) and auth token if needed. It also shows its last run status and date.

Openly –and heavily– inspired from [sanity-plugin-vercel-deploy](https://github.com/ndimatteo/sanity-plugin-vercel-deploy) by [ndimatteo](https://github.com/ndimatteo).

## Installation

```sh
# npm
npm i sanity-plugin-trigger-webhook

# yarn
yarn install sanity-plugin-trigger-webhook

# pnpm 
pnpm i sanity-plugin-trigger-webhook

# bun 
bun i sanity-plugin-trigger-webhook
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import { defineConfig } from 'sanity'
import { webhooksTrigger } from 'sanity-plugin-trigger-webhook'

export default defineConfig({
  //...
  plugins: [
    webhooksTrigger({
      title: 'Deploy', // Default value
      text: '', // TODO
    })
  ],
})
```

## License

[MIT](LICENSE) © Félix Péault (Flayks)

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
