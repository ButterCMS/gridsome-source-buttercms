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
      levels: this.options.levels,
      page_size: 100
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
    if ((this.options.locales || []).length) {
      return Promise.all(
        (this.options.locales || []).map(locale =>
          this.createNodesForPages(actions, locale)
        )
      );
    }

    return this.createNodesForPages(actions, null);
  }

  async createNodesForPages(actions, locale) {
    await Promise.all(
      [...this.options.pageTypes, '*'].map(pageType =>
        this.createNodesForPagesWithPageType(actions, pageType, locale)
      )
    );
  }

  async createNodesForPagesWithPageType(actions, pageType, locale) {
    const params = {
      ...this.params,
      ...(locale && { locale })
    };
    let page = 1;

    while (page) {
      const pages = await this.client.page.list(pageType, {
        ...params,
        page
      });
      const {
        data,
        meta: { next_page: nextPage }
      } = pages.data;
      const contentType = actions.addCollection({
        typeName: this.createTypeName(pageType === '*' ? 'pages' : pageType)
      });

      for (const page of data) {
        this.addPageNode(page, contentType, locale);
      }

      page = nextPage;
    }
  }

  createTypeName(typeName = '') {
    return camelCase(`${this.options.typeName} ${typeName}`, {
      pascalCase: true
    });
  }

  addPageNode(page, contentType, locale) {
    const { fields: data, page_type: pageType, ...pageData } = page;
    contentType.addNode({
      ...pageData,
      data: page.fields,
      locale,
      page_type: pageType || '*'
    });
  }
}

module.exports = ButterSource;
