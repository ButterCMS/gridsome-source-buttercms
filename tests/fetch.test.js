const buttercmsMock = require('buttercms');

const Fetch = require('../fetch');
const Mocks = require('./mocks');

jest.mock('buttercms');


const pagesListMock = jest.fn((pageSlug, params = {}) => {
  let pages = [];
  if (pageSlug === '*') {
    pages = Mocks.singlePagesMocks
  }
  else if (pageSlug === 'article') {
    pages = Mocks.articlePagesMocks
  }

  return Mocks.mockPagination(pages, params.page, params.page_size);
});

const postsListMock = jest.fn((params = {}) =>
  Mocks.mockPagination(
    [Mocks.postMock, Mocks.postMock, Mocks.postMock, Mocks.postMock],
    params.page,
    params.page_size
  )
);

const contentRetrieveMock = jest.fn((collectionSlugs, params = {}) => {
  const collectionDataMock =
    collectionSlugs.length == 1 &&
    Mocks.collectionsItemsMocks[collectionSlugs[0]]
      ? Mocks.collectionsItemsMocks[collectionSlugs[0]]
      : [];

  return Mocks.mockPagination(
    collectionDataMock,
    params.page,
    params.page_size,
    collectionSlugs
  );
});

buttercmsMock.mockImplementation(() => {
  return {
    page: {
      list: pagesListMock
    },
    post: {
      list: postsListMock
    },
    content: {
      retrieve: contentRetrieveMock
    }
  };
});

describe('No locales set in options', () => {
  test('should throw error when authToken is missing', () => {
    expect(() => new Fetch({})).toThrow(
      'ButterSource: Missing API Key'
    );
  });

  it.each`
    collectionsSlugs                           | params              | expectedResponse
    ${['categories', 'main_navigation_links']} | ${{ pageSize: 2 }}  | ${Mocks.collectionsItemsMocks}
    ${['categories']}                          | ${{ pageSize: 2 }}  | ${{ categories: Mocks.collectionsItemsMocks.categories }}
    ${['main_navigation_links']}               | ${{ pageSize: 2 }}  | ${{ main_navigation_links: Mocks.collectionsItemsMocks.main_navigation_links }}
    ${['categories', 'main_navigation_links']} | ${{ pageSize: 10 }} | ${Mocks.collectionsItemsMocks}
    ${['categories']}                          | ${{ pageSize: 10 }} | ${{ categories: Mocks.collectionsItemsMocks.categories }}
    ${['main_navigation_links']}               | ${{ pageSize: 10 }} | ${{ main_navigation_links: Mocks.collectionsItemsMocks.main_navigation_links }}
    ${['categories', 'main_navigation_links']} | ${{}}               | ${Mocks.collectionsItemsMocks}
    ${['categories']}                          | ${{}}               | ${{ categories: Mocks.collectionsItemsMocks.categories }}
    ${['main_navigation_links']}               | ${{}}               | ${{ main_navigation_links: Mocks.collectionsItemsMocks.main_navigation_links }}
  `(
    "should return all collections items '$collectionsSlugs' and params $params",
    async ({ collectionsSlugs, params, expectedResponse }) => {
      const fetch = new Fetch({
        authToken: 'auth-token123',
        ...params
      });
      expect(await fetch.getCollectionsData(collectionsSlugs)).toEqual(
        expectedResponse
      );
    }
  );

  it.each`
    pageType     | params              | expectedResponse
    ${'*'}       | ${{ pageSize: 2 }}  | ${Mocks.singlePagesMocks}
    ${'article'} | ${{ pageSize: 2 }}  | ${Mocks.articlePagesMocks}
    ${'*'}       | ${{ pageSize: 10 }} | ${Mocks.singlePagesMocks}
    ${'article'} | ${{ pageSize: 10 }} | ${Mocks.articlePagesMocks}
    ${'*'}       | ${{}}               | ${Mocks.singlePagesMocks}
    ${'article'} | ${{}}               | ${Mocks.articlePagesMocks}
  `(
    "should return all pages with page type '$pageType' and params $params",
    async ({ pageType, params, expectedResponse }) => {
      const fetch = new Fetch({
        authToken: 'auth-token123',
        ...params
      });

      expect(await fetch.getPagesWithPageType(pageType)).toEqual(
        expectedResponse
      );
    }
  );

  it.each`
    params
    ${{ pageSize: 2 }}
    ${{ pageSize: 2 }}
    ${{ pageSize: 10 }}
    ${{ pageSize: 10 }}
    ${{}}
  `('should return all posts with params $params', async ({ params }) => {
    const fetch = new Fetch({
      authToken: 'auth-token123',
      ...params
    });

    expect(await fetch.getBlogPosts()).toEqual([
      Mocks.postMock,
      Mocks.postMock,
      Mocks.postMock,
      Mocks.postMock
    ]);
  });
});

describe('Locales are set in options', () => {
  it.each`
    collectionsSlugs                           | params                                     | expectedResponse
    ${['categories', 'main_navigation_links']} | ${{ pageSize: 2, locales: ['en', 'es'] }}  | ${Mocks.getLocalizedCollectionDataVersionsMock(Mocks.collectionsItemsMocks, ['en', 'es'])}
    ${['categories']}                          | ${{ pageSize: 2, locales: ['en', 'es'] }}  | ${Mocks.getLocalizedCollectionDataVersionsMock({ categories: Mocks.collectionsItemsMocks.categories }, ['en', 'es'])}
    ${['categories', 'main_navigation_links']} | ${{ pageSize: 2, locales: ['en'] }}        | ${Mocks.getLocalizedCollectionDataVersionsMock(Mocks.collectionsItemsMocks, ['en'])}
    ${['categories']}                          | ${{ pageSize: 2, locales: ['en'] }}        | ${Mocks.getLocalizedCollectionDataVersionsMock({ categories: Mocks.collectionsItemsMocks.categories }, ['en'])}
    ${['categories', 'main_navigation_links']} | ${{ pageSize: 2, locales: [] }}            | ${Mocks.collectionsItemsMocks}
    ${['categories']}                          | ${{ pageSize: 2, locales: [] }}            | ${{ categories: Mocks.collectionsItemsMocks.categories }}
    ${['categories', 'main_navigation_links']} | ${{ pageSize: 10, locales: ['en', 'es'] }} | ${Mocks.getLocalizedCollectionDataVersionsMock(Mocks.collectionsItemsMocks, ['en', 'es'])}
    ${['categories']}                          | ${{ pageSize: 10, locales: ['en', 'es'] }} | ${Mocks.getLocalizedCollectionDataVersionsMock({ categories: Mocks.collectionsItemsMocks.categories }, ['en', 'es'])}
    ${['categories', 'main_navigation_links']} | ${{ locales: ['en', 'es'] }}               | ${Mocks.getLocalizedCollectionDataVersionsMock(Mocks.collectionsItemsMocks, ['en', 'es'])}
    ${['categories']}                          | ${{ locales: ['en', 'es'] }}               | ${Mocks.getLocalizedCollectionDataVersionsMock({ categories: Mocks.collectionsItemsMocks.categories }, ['en', 'es'])}
  `(
    "should return all collections items '$collectionsSlugs' and params $params",
    async ({ collectionsSlugs, params, expectedResponse }) => {
      const fetch = new Fetch({
        authToken: 'auth-token123',
        ...params
      });
      expect(await fetch.getCollectionsData(collectionsSlugs)).toEqual(
        expectedResponse
      );
    }
  );

  it.each`
    pageType     | params                                     | expectedResponse
    ${'*'}       | ${{ pageSize: 2, locales: ['en', 'es'] }}  | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.singlePagesMocks, ['en', 'es'])}
    ${'article'} | ${{ pageSize: 2, locales: ['en', 'es'] }}  | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.articlePagesMocks, ['en', 'es'])}
    ${'*'}       | ${{ pageSize: 2, locales: ['en'] }}        | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.singlePagesMocks, ['en'])}
    ${'article'} | ${{ pageSize: 2, locales: ['en'] }}        | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.articlePagesMocks, ['en'])}
    ${'*'}       | ${{ pageSize: 2, locales: [] }}            | ${Mocks.singlePagesMocks}
    ${'article'} | ${{ pageSize: 2, locales: [] }}            | ${Mocks.articlePagesMocks}
    ${'*'}       | ${{ pageSize: 10, locales: ['en', 'es'] }} | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.singlePagesMocks, ['en', 'es'])}
    ${'article'} | ${{ pageSize: 10, locales: ['en', 'es'] }} | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.articlePagesMocks, ['en', 'es'])}
    ${'*'}       | ${{ locales: ['en', 'es'] }}               | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.singlePagesMocks, ['en', 'es'])}
    ${'article'} | ${{ locales: ['en', 'es'] }}               | ${Mocks.getLocalizedObjectsVersionsMock(Mocks.articlePagesMocks, ['en', 'es'])}
  `(
    "should return all pages with version for each locale with page type '$pageType' and params $params",
    async ({ pageType, params, expectedResponse }) => {
      const fetch = new Fetch({
        authToken: 'auth-token123',
        ...params
      });
      expect(await fetch.getPagesWithPageType(pageType)).toEqual(
        expectedResponse
      );
    }
  );

  it.each`
    params
    ${{ pageSize: 2 }}
    ${{ pageSize: 2 }}
    ${{ pageSize: 10 }}
    ${{ pageSize: 10 }}
    ${{}}
  `('should return all posts with params $params', async ({ params }) => {
    const fetch = new Fetch({
      authToken: 'auth-token123',
      ...params
    });

    expect(await fetch.getBlogPosts()).toEqual([
      Mocks.postMock,
      Mocks.postMock,
      Mocks.postMock,
      Mocks.postMock
    ]);
  });
});
