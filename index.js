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
      console.log('About to start loading data...');
      await this.allButterPost(store);
      await this.allButterPages(store);
      await this.allButterCollections(store);
    });
  }

    /****************************************************
    STEP ONE: Get all butter posts
  ****************************************************/
  async allButterPost(store) {
    const post = await this.client.post.list()
    const  { data } = post.data;
    const contentType = store.addContentType({
      typeName: this.createTypeName("posts")
    });
    for (const item of data) {
      contentType.addNode({
        fields: {
          title: item.title,
          url: item.url,
          featured_image: item.featured_image,
          slug: item.slug,
          created: item.created,
          published: item.published,
          summary: item.summary,
          seo_title: item.seo_title,
          body: item.body,
          meta_description: item.meta_description,
          status: item.status,
          author: item.author,
          tags: item.tags,
          categories: item.categories,
        }
      });
    }
  }

   /****************************************************
    STEP TWO: Get all butter pages
  ****************************************************/
  async allButterPages(store) {
    const post = await this.client.page.retrieve('*', 'about')
    const { data } = post;
    console.log(data, '>>>>>>>>>>')
    const contentType = store.addContentType({
      typeName: this.createTypeName('pages')
    });
  }

   /****************************************************
    STEP THREE: Get all butter collections
  ****************************************************/
  async allButterCollections(store) {
    const collection = store.addContentType({
      typeName: this.createTypeName('collection')
    });

    const data = await this.client.content.retrieve(['artists'])
  }

  createTypeName(typeName = '') {
    return camelCase(`${this.options.typeName} ${typeName}`, {
      pascalCase: true
    });
  }
}

module.exports = ButterSource;