https://www.npmjs.com/package/@dpi/toasty
https://unpkg.com/@dpi/toasty/dist/toasty.js

Build includes Vue and Pusher client library.

Future:

 - less reliance on tailwind classes in markup.
 - build without vue + pusher lib?

## Dev

`npm run watch`

Use `window.PusherConfiguration.toastyDebug = true` in browser to display
JSON stringified messages.

## Build and publish

### Build

 - Test locally first!
 - `npm run build`
 - Then test with integration.

### Publish

 - Do _Build_ above first!, then:
 - Change `package.json` version.
 - `npm publish --access public`

