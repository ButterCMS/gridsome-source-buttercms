const ButterCMS = require('buttercms');
const camelCase = require('camelcase');

class ButterSource {
  static defaultOptions() {
    return {
      authToken: '',
      contentFields: [''],
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

    api.loadSource(async actions => {
      console.log('Processing data...');
      await this.allButterPosts(actions);
      await this.allButterCollections(actions);
      await this.allButterPages(actions);
    });
  }

    /****************************************************
    STEP ONE: Get all butter posts
  ****************************************************/
  async allButterPosts(actions) {
    const post = await this.client.post.list()
    const  { data } = post.data;
    const contentType = actions.addCollection({
      typeName: this.createTypeName("posts")
    });
    for (const item of data) {
      contentType.addNode({
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
      });
    }
  }

  /****************************************************
    STEP TWO: Get all butter collections
  ****************************************************/
  async allButterCollections(actions) {
    const collection = await this.client.content.retrieve(this.options.contentFields)
    const { data } = collection.data;
    const contentType = actions.addCollection({
      typeName: this.createTypeName('collection')
    });
    contentType.addNode({
      data
    })
  }

  /****************************************************
    STEP THREE: Get all butter pages
  ****************************************************/
  async allButterPages(actions) {
    if (this.options.pages || this.options.pageTypes) {
      if (this.options.pages) {
        const page = await this.client.page.retrieve('*', this.options.pages)
        const { data } = page.data;
        const contentType = actions.addCollection({
          typeName: this.createTypeName('pages')
        });
        contentType.addNode({
          slug: data.slug,
          page_type: data.page_type,
          data: data.fields
        })
      }
      if (this.options.pageTypes) {
        const page = await this.client.page.list(this.options.pageTypes)
        const { data } = page.data;
         const contentType = actions.addCollection({
          typeName: this.createTypeName('pages')
        });
        for (const item of data) {
          contentType.addNode({
            slug: item.slug,
            page_type: item.page_type,
            data: item.fields
          })
        }
      }
    }
  }

  createTypeName(typeName = '') {
    return camelCase(`${this.options.typeName} ${typeName}`, {
      pascalCase: true
    });
  }
}

module.exports = ButterSource;