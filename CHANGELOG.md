## [1.0.1](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v1.0.0...v1.0.1) (2026-08-19)


### Bug Fixes

* **build:** restore the browserslist config ([9be9697](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/9be96976c4f1ba848f6d038679e05195c68724ca))

# [1.0.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.9.0...v1.0.0) (2026-08-19)


* chore!: drop the Studio v2 compatibility shim ([ecb6079](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/ecb6079c755262826486bbbb07ff2d9d7bfa81b9))
* chore(deps)!: upgrade to Sanity Studio v6 ([63814c7](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/63814c7d428d1bb388d02843ff5bd414c9d4c1e8))


### Bug Fixes

* **build:** compile JSX in dist instead of shipping it raw ([3c47414](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/3c4741427990699e921cc358962e8bd11bec9ccf))
* **config:** forward every plugin option to the tool ([804536f](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/804536f6dc5d77221fa07e0c9add7087b20c9d35))
* **github:** never attach a request body to GET requests ([552575e](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/552575e678ff8630fc36ec7b6d314a8d44c61ec6))
* **modal:** stop re-encrypting the stored auth token on edit ([e1c1a1a](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/e1c1a1a80e08c7f0aa6868f6ce82d7d79232f624))
* **security:** throw when the auth token cannot be decrypted ([b4f0268](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/b4f02686ecc1ef27b74721af31dc641c3e27586d))


### Features

* **ui:** show why a run failed, confirm deletes, trigger in parallel ([7cb5db2](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/7cb5db266a3a5e31b007b42d4c2263a267e3730e))


### BREAKING CHANGES

* no Studio v2 incompatibility dialog.
* requires Sanity Studio v6 and React 19.

# [0.9.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.8.1...v0.9.0) (2026-06-11)


### Features

* support sanity v6 peer dependency ([9254dc7](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/9254dc7afef181fea28f177eb2e5d797e4db4f98))

# [0.9.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.8.1...v0.9.0) (2026-06-11)


### Features

* support sanity v6 peer dependency ([9254dc7](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/9254dc7afef181fea28f177eb2e5d797e4db4f98))

## [0.8.1](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.8.0...v0.8.1) (2026-05-04)


### Bug Fixes

* handle CORS-restricted webhook endpoints gracefully ([54785b9](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/54785b9aa9a7ee265de7315b0229b6f0184e4c94))

# [0.8.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.7.0...v0.8.0) (2026-04-26)


### Bug Fixes

* allow to remove a custom githubEventType if empty ([434d835](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/434d835551ab9f9b1d71f3b016c17ee2d4488c43))


### Features

* allow for the event type to be specified on the individual webhook config ([7b11f01](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/7b11f01c790b7c5de636cb7fed0dfb521f4bf5dd))

# Changelog

## [0.7.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.6.0...v0.7.0) (2025-12-16)


### Features

* downgrade minimum node version ([9744b41](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/9744b4161732e9e9f1b8e553f38fa097607470d8))
* downgrade minimum node version ([2c804fe](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/2c804fe3e5ae505fd14a6c63166e50482ee8bac2))

## [0.6.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.5.0...v0.6.0) (2025-12-16)


### Features

* add ability to trigger all webhooks ([dce2eab](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/dce2eab82ac36d4336dacd05665b1264f385ea47))

## [0.5.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.4.1...v0.5.0) (2025-08-16)


### Features

* improve responsive styling ([ecd907f](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/ecd907fc7ed39dbcecaafed09efa18c300c72905))
* update deps + upgrade to sanity 4 ([143d3f0](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/143d3f0feb687ea75b5e22ac191ceed9a93ad557))

## [0.4.1](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.4.0...v0.4.1) (2025-05-22)


### Bug Fixes

* downgrade some packages for compat issues ([706acc3](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/706acc383c34fd07c220246228d2106223901314))
* downgrade some packages for compat issues ([2bf8ec0](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/2bf8ec0a5b7d0a700980dc805c4903337610984c))

## [0.4.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.3.1...v0.4.0) (2025-05-22)


### Features

* update deps + upgrade to react 19 ([2e37bd5](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/2e37bd5c52c890661e37464334bb1e90cb1c305d))

## [0.3.1](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.3.0...v0.3.1) (2024-08-22)


### Bug Fixes

* use event_type as key for GH action ([42c9dd7](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/42c9dd7f10e1493571a4db52914b2688cf2b184e))

## [0.3.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.2.4...v0.3.0) (2024-08-22)


### Features

* add option to customize Github event type name ([7a50c15](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/7a50c158d34a53f3180083231ca25c925240d43a)), closes [#3](https://github.com/flayks/sanity-plugin-webhooks-trigger/issues/3)

## [0.2.3](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.2.2...v0.2.3) (2024-07-01)


### Bug Fixes

* check for Github hostname instead of string includes ([901b87f](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/901b87f35951973975a39c6631c4d1936bd156b1))

## [0.2.2](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/v0.2.0...v0.2.2) (2024-06-28)


### Bug Fixes

* make types for plugin config ([dab3f34](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/dab3f34ac4bbecf2d35296a2844444a0fda03eb2))



## [0.2.0](https://github.com/flayks/sanity-plugin-webhooks-trigger/compare/a9390cf4feacc4fa3faf8ac04a17feeaedc4934f...v0.2.0) (2024-06-28)


### Features

* encrypt auth token if existing ([4e1f0c6](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/4e1f0c6f8afd712c02e2dc7d303cb753da411d58))
* replace processing button with Spinner ([a9390cf](https://github.com/flayks/sanity-plugin-webhooks-trigger/commit/a9390cf4feacc4fa3faf8ac04a17feeaedc4934f))
