const ButterCMS = require('buttercms');

class FetchButterCMSData {
  constructor({ authToken, levels, locales, pageSize, preview } = {}) {
    if (!authToken) throw new Error('ButterSource: Missing API Key');

    this.params = {
      levels: levels || 2,
      page_size: pageSize || 100,
      preview: preview ? 1 : 0
    };
    this.locales = locales || [];

    this.client = ButterCMS(authToken);
  }

  async getPagesWithPageType(pageType) {
    if (this.locales.length) {
      return (await Promise.all(
        this.locales.map(locale =>
          this.getLocalizedPagesWithPageType(pageType, locale)
        )
      )).flat();
    }

    return this.getLocalizedPagesWithPageType(pageType, null);
  }

  async getBlogPosts() {
    let allPosts = [];
    let page = 1;

    while (page) {
      const posts = await this.client.post.list({ ...this.params, page });
      const {
        data,
        meta: { next_page: nextPage }
      } = posts.data;
      allPosts = allPosts.concat(data);
      page = nextPage;
    }

    return allPosts;
  }

  getCollectionsData(collectionsSlugs) {
    return collectionsSlugs.reduce(async (resPromise, collectionSlug) => {
      const res = await resPromise;
      let allItems = [];
      if (this.locales.length) {
        allItems = (await Promise.all(
          this.locales.map(async locale => {
            const items = await this.getCollectionData(collectionSlug, locale);
            // each collection item should have locale
            return items.map(item => ({ ...item, locale }));
          })
        )).flat();
      } else {
        allItems = await this.getCollectionData(collectionSlug, null);
      }

      return { ...res, [collectionSlug]: allItems };
    }, Promise.resolve({}));
  }

  async getLocalizedPagesWithPageType(pageType, locale) {
    const pagesWithPageType = [];
    let page = 1;
    const localLocale = locale ? { locale } : {};

    while (page) {
      const pages = await this.client.page.list(pageType, {
        ...this.params,
        ...localLocale,
        page
      });
      const {
        data,
        meta: { next_page: nextPage }
      } = pages.data;

      data.forEach(item => {
        pagesWithPageType.push({
          ...item,
          ...localLocale
        });
      });

      page = nextPage;
    }

    return pagesWithPageType;
  }

  async getCollectionData(collectionSlug, locale) {
    const allCollectionsData = [];
    const localLocale = locale ? { locale } : {};
    let page = 1;

    while (page) {
      const collection = await this.client.content.retrieve([collectionSlug], {
        ...this.params,
        page,
        ...localLocale
      });
      const {
        data,
        meta: { next_page: nextPage }
      } = collection.data;
      allCollectionsData.push(...data[collectionSlug]);
      page = nextPage;
    }
    return allCollectionsData;
  }
}
module.exports = FetchButterCMSData;
