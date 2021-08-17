const ButterCMS = require('buttercms');
const camelCase = require('camelcase');

class ButterSource {
  static defaultOptions() {
    return {
      authToken:
        process.env.GRIDSOME_BUTTER_AUTHTOKEN || process.env.BUTTER_AUTHTOKEN,
      collections: [''],
      pageTypes: [],
      typeName: 'Butter',
      locales: [],
      preview: false,
      levels: 2
    };
  }

  constructor(api, options = ButterSource.defaultOptions()) {
    if (!options.authToken) throw new Error('ButterSource: Missing API Key');
    this.options = options;

    this.api = api;
    this.client = ButterCMS(options.authToken, false, 20000);
    this.params = {
      preview: this.options.preview ? 1 : 0,
      levels: this.options.levels
    };

    api.loadSource(async actions => {
      console.log('Processing data...');
      try {
        await Promise.all([
          this.allButterPosts(actions),
          this.allButterCollections(actions),
          this.allButterPages(actions)
        ]);
      } catch (e) {
        console.error('Failed to create all nodes.');
        console.error(e);
      }
    });
  }

  /****************************************************
    STEP ONE: Get all butter posts
  ****************************************************/
  async allButterPosts(actions) {
    const post = await this.client.post.list();
    const { data } = post.data;
    const contentType = actions.addCollection({
      typeName: this.createTypeName('posts')
    });
    for (const item of data) {
      contentType.addNode({
        ...item
      });
    }
  }

  /****************************************************
    STEP TWO: Get all butter collections
  ****************************************************/
  async allButterCollections(actions) {
    const collection = await this.client.content.retrieve(
      this.options.collections
    );
    const { data } = collection.data;
    const contentType = actions.addCollection({
      typeName: this.createTypeName('collection')
    });
    contentType.addNode({
      data
    });
  }

  /****************************************************
    STEP THREE: Get all butter pages
  ****************************************************/
  allButterPages(actions) {
    const promises = [];
    for (const locale of this.options.locales || []) {
      promises.push(this.createNodesForSinglePages(actions, locale));
      promises.push(this.createNodesForPagesWithPageType(actions, locale));
    }
    return Promise.all(promises);
  }

  async createNodesForSinglePages(actions, locale) {
    const params = {
      ...this.params,
      ...(locale && { locale })
    };

    const singlePages = await this.client.page.list('*', params);
    const { data } = singlePages.data;
    const contentType = actions.addCollection({
      typeName: this.createTypeName('pages')
    });
    for (const page of data) {
      this.addPageNode(page, contentType, locale);
    }
  }

  async createNodesForPagesWithPageType(actions, locale) {
    const params = {
      ...this.params,
      ...(locale && { locale })
    };
    const pageTypesPages = (this.options.pageTypes || []).map(pageType =>
      this.client.page.list(pageType, params)
    );
    const pageTypesPagesData = await Promise.all(pageTypesPages);

    for (const pageTypePages of pageTypesPagesData) {
      const { data } = pageTypePages.data;
      if (data.length) {
        const contentType = actions.addCollection({
          typeName: this.createTypeName(data[0].page_type)
        });
        for (const page of data) {
          this.addPageNode(page, contentType, locale);
        }
      }
    }
  }

  createTypeName(typeName = '') {
    return camelCase(`${this.options.typeName} ${typeName}`, {
      pascalCase: true
    });
  }

  addPageNode(page, contentType, locale) {
    const { fields: data, ...pageData } = page;
    contentType.addNode({
      ...pageData,
      data: page.fields,
      locale
    });
  }
}

module.exports = ButterSource;
