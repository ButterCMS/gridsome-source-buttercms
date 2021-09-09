const postMock = {
  status: 'published',
  created: '2021-07-07T10:15:22.739030Z',
  updated: '2021-07-07T10:16:59.101050Z',
  published: '2021-07-07T10:15:00Z',
  title: 'The best post ever',
  slug: 'copy-another-example-post',
  body: 'Post body',
  summary: 'This is an example blog post. Pretty neat huh?',
  seo_title: 'Example Post SEO Optimized Title',
  meta_description:
    'This is our example blog posts SEO optimized meta description.',
  featured_image_alt: '',
  url: 'copy-another-example-post',
  featured_image: null,
  author: {
    bio: 'I launch rockets into space!!!',
    slug: 'orly-knop',
    email: 'orly+nextjs@buttercms.com',
    title: '',
    last_name: 'Knop',
    first_name: 'Orly',
    facebook_url: '',
    linkedin_url: '',
    instagram_url: '',
    pinterest_url: '',
    profile_image: 'https://cdn.buttercms.com/JXSQZMuZRJKzngeKYxfe',
    twitter_handle: ''
  },
  tags: [
    {
      name: 'Example Tag',
      slug: 'example-tag'
    }
  ],
  categories: [
    {
      name: 'Example Category',
      slug: 'example-category'
    }
  ]
};

const singlePagesMocks = [
  {
    slug: 'single-1',
    name: 'single 1',
    published: null,
    updated: '2021-08-18T14:15:58.152159Z',
    page_type: null,
    fields: {
      single_page_field: 'single 1'
    }
  },
  {
    slug: 'single-2',
    name: 'single 2',
    published: null,
    updated: '2021-08-18T14:16:02.725316Z',
    page_type: null,
    fields: {
      single_page_field: 'single 1'
    }
  },
  {
    slug: 'single-4',
    name: 'single 4',
    published: null,
    updated: '2021-08-18T14:16:38.510437Z',
    page_type: null,
    fields: {
      single_page_field: 'single 1'
    }
  },
  {
    slug: 'sample-page',
    name: 'My Sample Page',
    published: '2021-08-18T12:55:31.211940Z',
    updated: '2021-08-18T12:55:31.211940Z',
    page_type: null,
    fields: {
      readme: '',
      seo: {
        title: '',
        meta_description: ''
      },
      twitter_card: {
        title: '',
        Description: '',
        image: ''
      },
      open_graph: {
        title: '',
        image: '',
        Description: ''
      },
      sections: []
    }
  }
];

const articlePagesMocks = [
  {
    slug: 'article-1',
    name: 'Article 1',
    published: null,
    updated: '2021-08-19T11:28:31.788342Z',
    page_type: 'article',
    fields: {
      title: 'Article 1'
    }
  },
  {
    slug: 'article-2',
    name: 'Article 2',
    published: '2021-08-19T11:28:31.788342Z',
    updated: '2021-08-19T11:28:31.788342Z',
    page_type: 'article',
    fields: {
      title: 'Article 2'
    }
  }
];

const collectionsItemsMocks = {
  main_navigation_links: [
    {
      meta: {
        id: 82363
      },
      text: 'Contact',
      link: '/#contact-form'
    },
    {
      meta: {
        id: 82364
      },
      text: 'Terms',
      link: '/terms'
    }
  ],
  categories: [
    {
      meta: {
        id: 82367
      },
      name: 'Toys',
      slug: 'toys'
    }
  ]
};

function mockPagination(
  objects,
  page = 1,
  pageSize = 10,
  wrapperProperty = null
) {
  const arrayChunks = (array, chunk_size) =>
    Array(Math.ceil(array.length / chunk_size))
      .fill()
      .map((_, index) => index * chunk_size)
      .map(begin => array.slice(begin, begin + chunk_size));

  const paginatedObjects = arrayChunks(objects, pageSize);
  return Promise.resolve({
    data: {
      meta: {
        next_page: paginatedObjects.length > page ? page + 1 : null,
        previous_page: page > 1 ? page - 1 : null,
        count: objects.length
      },
      data: wrapperProperty
        ? { [wrapperProperty]: paginatedObjects[page - 1] || [] }
        : paginatedObjects[page - 1] || []
    }
  });
}

function getLocalizedObjectsVersionsMock(items, locales) {
  // create "translated" versions for each page in pages for each locale in locales
  return locales.map(locale => items.map(item => ({ ...item, locale }))).flat();
}

function getLocalizedCollectionDataVersionsMock(collectionsData, locales) {
  return Object.fromEntries(
    Object.entries(collectionsData).map(([key, items]) => [
      key,
      getLocalizedObjectsVersionsMock(items, locales)
    ])
  );
}

module.exports = {
  articlePagesMocks,
  collectionsItemsMocks,
  getLocalizedCollectionDataVersionsMock,
  getLocalizedObjectsVersionsMock,
  postMock,
  singlePagesMocks,
  mockPagination
};
