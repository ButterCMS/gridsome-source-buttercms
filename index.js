const ButterCMS = require('buttercms');
const camelCase = require('camelcase');

class ButterSource {
  static defaultOptions() {
    return {
      authToken: 'bd15d8c5fe3c31340ef10a539eb8a8b5a4de9e97',
      contentFields: '',
      pages: '',
      pageTypes: '',
      typeName: 'Butter'
    };
  }

  constructor(api, options = ButterSource.defaultOptions()) {
    this.api = api;
    this.options = options;
    this.client = ButterCMS(options.authToken, false, 20000);
    if (!options.authToken) throw new Error('ButterSource: Missing API Key');

    api.loadSource(async store => {
      console.log('About to start loading data');
      await this.allButterPost(store);
      await this.allButterPages(store);
      await this.allButterCollections(store);
    });
  }

  async allButterPost(store) {
    const posts = store.addContentType({
      typeName: this.createTypeName('posts')
    });
    const data = await this.client.post.list()
    console.log(data.data);
    const item = data.data;
      posts.addNode({
        url: item.url
      })
  }

  async allButterPages(store) {
    const pages = store.addContentType({
      typeName: this.createTypeName('pages')
    });
    const data = await this.client.page.retrieve('*', 'about')
     console.log(data);
  }

  async allButterCollections(store) {
    const collection = store.addContentType({
      typeName: this.createTypeName('collection')
    });

    const data = await this.client.content.retrieve(['artists'])
     console.log(data.data);
  }

  createTypeName(typeName = '') {
    return camelCase(`${this.options.typeName} ${typeName}`, {
      pascalCase: true
    });
  }
}

module.exports = ButterSource;
