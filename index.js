const camelCase = require('camelcase');
const FetchButterCMSData = require('./fetch');

class ButterSource {
  static defaultOptions() {
    return {
      authToken:
        process.env.GRIDSOME_BUTTER_AUTHTOKEN || process.env.BUTTER_AUTHTOKEN,
      collections: [],
      pageTypes: [],
      typeName: 'Butter',
      locales: [],
      preview: false,
      levels: 2,
      page_size: 100
    };
  }

  constructor(api, options = ButterSource.defaultOptions()) {
    this.options = options;
    this.api = api;
    this.fetchButterCMSData = new FetchButterCMSData(this.options);

    api.loadSource(async actions => {
      const promises = [
        this.createNodesForButterPosts(actions),
        this.createNodesForButterPages(actions)
      ];

      if (this.options.collections && this.options.collections.length) {
        promises.push(this.createNodesForButterCollections(actions));
      }

      try {
        await Promise.all(promises);
      } catch (e) {
        console.error('Failed to create all nodes.');
        console.error(e);
      }
    });
  }

  /****************************************************
    STEP ONE: Get all butter posts
  ****************************************************/
  async createNodesForButterPosts(actions) {
    const posts = await this.fetchButterCMSData.getBlogPosts();

    const contentType = actions.addCollection({
      typeName: this.createTypeName('posts')
    });

    posts.forEach(post => contentType.addNode(post));
  }

  /****************************************************
    STEP TWO: Get all butter collections
  ****************************************************/
  async createNodesForButterCollections(actions) {
    const data = await this.fetchButterCMSData.getCollectionsData(
      this.options.collections
    );

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
  createNodesForButterPages(actions) {
    return Promise.all(
      [...this.options.pageTypes, '*'].map(async pageType => {
        const pages = await this.fetchButterCMSData.getPagesWithPageType(
          pageType
        );
        const contentType = actions.addCollection({
          typeName: this.createTypeName(pageType === '*' ? 'pages' : pageType)
        });

        pages.forEach(page => {
          // remove `fields` as a key from page so it doesn't get added to node
          // needs to be renamed to `data` for use
          const { fields: data, ...pageData } = page;
          // create node
          // - by assigning `page_type` explicitly here, we overwrite `pageData.page_type`
          contentType.addNode({
            ...pageData,
            data,
            page_type: page.page_type || '*'
          });
        });
      })
    );
  }

  createTypeName(typeName = '') {
    return camelCase(`${this.options.typeName} ${typeName}`, {
      pascalCase: true
    });
  }
}

module.exports = ButterSource;
