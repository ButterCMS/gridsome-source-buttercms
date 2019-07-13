const ButterCMS = require('buttercms');
const camelCase = require('camelcase');

class ButterSource {
  static defaultOptions() {
    return {
      authToken: '',
      contentFields: [''],
      pages: '',
      pageTypes: '',
      typeName: ''
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
      await this.allButterCollections(store);
      await this.allButterPages(store);
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
    STEP TWO: Get all butter collections
  ****************************************************/
  async allButterCollections(store) {
    const collection = await this.client.content.retrieve(this.options.contentFields)
    const { data } = collection.data;
    const contentType = store.addContentType({
      typeName: this.createTypeName('collection')
    });
    contentType.addNode({
      fields: {
        data
      }
    })

  }

  /****************************************************
    STEP THREE: Get all butter pages
  ****************************************************/
  async allButterPages(store) {
    if (this.options.pages || this.options.pageTypes) {
      if (this.options.pages) {
        const page = await this.client.page.retrieve('*', this.options.pages)
        const { data } = page;
        const contentType = store.addContentType({
          typeName: this.createTypeName('pages')
        });
        contentType.addNode({
          fields: {
            headline: data.headline,
            seo_title: data.seo_title,
            body: data.body,
            hero_image: data.hero_image,
            call_to_action: data.call_to_action,
            customer_logos: data.customer_logos
          }
        })
      }

      if (this.options.pageTypes) {
        const page = await this.client.page.list(this.options.pageTypes)
        const { data } = page;
        console.log(data);
         const contentType = store.addContentType({
          typeName: this.createTypeName('pages')
        });
        contentType.addNode({
          fields: {
            headline: data.headline,
            seo_title: data.seo_title,
            body: data.body,
            hero_image: data.hero_image,
            call_to_action: data.call_to_action,
            customer_logos: data.customer_logos
          }
        })
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