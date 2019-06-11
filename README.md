# gridsome-source-buttercms

Source plugin for pulling blog posts, authors, categories, tags, and content fields into [Gridsome](https://gridsome.org) from [ButterCMS](ttps://buttercms.com).

## Install

```
yarn add gridsome-source-buttercms

npm install gridsome-source-buttercms
```

## Usage

Add the plugin to your gridsome.config.js file

Configuration Example

```js
module.exports = {
  plugins: [
    {
      use: "gridsome-source-buttercms",
      options: {
        authToken: 'your_api_token',
        // optional fields follows
      }
    }
  ]
}
```