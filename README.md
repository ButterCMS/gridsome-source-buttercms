# The Case for ButterCMS and Gridsome

So connecting ButterCMS to Gridsome is easy, thanks to a new npm module. That's nice - but so what? If you're an overwhelmed developer tasks with internal requests to put all sorts of information online, and you're sick of the maintenance hassles of WordPress - read on.

[ButterCMS](https://buttercms.com/) is one of the new "headless" Content Management Systems that has been launched in the last few years as more and more companies seek a better solution than WordPress for getting content on the web.

![dev productivity](/images/undraw_dev_productivity_umsq.svg)


## What is ButterCMS?

ButterCMS decouples storage of information from its presentation. With ButterCMS, you can use just about any tech stack you want: React, Gatsby, Vue, Angular, Svelte, Rails, Django, PHP, Node, Gridsome and so on. If your tech stack can consume a REST API or GraphQL, ButterCMS can deliver content.

ButterCMS lets your non-developer users enter their content into the pages you've built, and lets them tweak that content to their heart's content. They don't have to know HTML or PHP: they use a WYSIWYG editor, drop in images and other media assets, and arrange their content as they want within the framework you create. All online, secure, and multiuser from the start.

Meanwhile, when you build out the pages you want to use in your ButterCMS, you can open up those pages to your internal staff so they can create content themselves. Whether its text, images or anything behind a URL, ButterCMS can store it.

## Meet Gridsome

So that's ButterCMS; what's Gridsome? Gridsome is a Vue website development framework for creating extremely fast and secure sites. It comes with plugins for adding everything from SEO markup to search, to your favorite headlessCMS (hopefully ButterCMS), all organized into a set of folders that simply make sense. Gridsome uses file-based and dynamic routing against a GraphQL data layer, with automatic code splitting.

![](images/gridsome.png)

When you're ready, you can deploy your project to any number of services that serve static assets like [Netlify](https://gridsome.org/docs/deploy-to-netlify/), [AWS Amplify](https://gridsome.org/docs/deploy-to-amplify/), [ZEIT Now](https://gridsome.org/docs/deploy-to-zeit-now/), [GitLab Pages](https://gridsome.org/docs/deploy-to-gitlab/), [GitHub Pages](https://gridsome.org/docs/deploy-to-github/). And since you're serving static pages and assets your site is extremely secure against those who might want to deface or hack into your site.

When you put Gridsome and ButterCMS together, you have a powerful workflow for defining and serving pages extremely fast. Let me walk you through a typical ButterCMS/Gridsome project and show you what I mean.

## Give me an Example

![Diesel Parts](images/negative-space-industrial-gears-machine.jpg)

Let's say you're a newly hired developer for **Acme Diesel Parts**, a seller and manufacturer of diesel parts. The Marketing VP goes to your manager and says they need a custom site for the upcoming **International Diesel Parts Show** in New York. It has be ultra fast, faster than competitors, attractive and well designed. And you have all of two weeks to pull everything together.

Now, since you already have a ButterCMS and you know Gridsome, here's your **Plan of Action**:

![Plan of Action](images/undraw_master_plan_95wa.svg)

1. First off, you create in ButterCMS a template for the Parts marketing wants to showcase: Caterpillar,Detroit Diesel, and John Deere. The sales and marketing people can then populate those records with the text and images they want. As the marketing people realize they need to make changes in the template, you can step in and make those on the fly.
2. You already have in ButterCMS the boilerplate every Acme Diesel Parts site has to include like the satisfaction guarantee page, the privacy page and the terms of use page, as well as a contact form.
3. In gridsome, you start a project, and you install into the `gridsome.config.js` file the plugins you expect to need:

	- [sitemap](https://gridsome.org/plugins/@gridsome/plugin-sitemap)
	- [Google Tag Manager support](https://gridsome.org/plugins/gridsome-plugin-gtm),
	- [Algolia](https://gridsome.org/plugins/gridsome-plugin-algolia),
	- [Twitter](https://gridsome.org/plugins/gridsome-plugin-remark-twitter), for those live tweets from the show,
	- [TailwindCSS](https://gridsome.org/plugins/gridsome-plugin-tailwind) for creating great looking non-Bootstrap CSS,
	- [PurgeCSS](https://gridsome.org/plugins/gridsome-plugin-purgecss) to cut out the unnecessary parts of Tailwind CSS when you're done,
	- and of course [ButterCMS](https://gridsome.org/plugins/gridsome-source-buttercms). All you need is the [Gridsome ButterCMS plugin](https://gridsome.org/plugins/gridsome-source-buttercms).

4. Of course, you are doing all your coding in a repo and following best practices such as Pull Requests in GitHub.
4. Next you build out the home page, the various static pages like the privacy policy and the sitemap and push the site to your favorite [JAMstack](https://jamstack.org/) service [Netlify](https://www.netlify.com/), where it can live for the time being behind a default https URL like `adorable-bigparts-e45b.netlify.com`. When it's time to launch, you can add a custom URM to your deploy and you're good to go.

Your manager is happy because the entire project could be done by one developer (you), the graphic artist/web designer is ecstatic because you're able to produce HTML landing pages that actually looks like what they did in Adobe Illustrator, and the sales and marketing people are jumping up and down because unlike their competitor's WordPress site, our site renders lightning fast on their iPhones.

## Then the CEO sees the site
![CEO](images/undraw_designer_mindset_7fhu.svg)

Then the CEO of the company reviews the site for the first time and decides the site looks so good, Acme Diesel Parts [Shopify](images/https://www.shopify.com/) pages should be part of the site too. *And the event starts in 3 days.* **Gulp!**

It usually is at this point the IT manager has a meltdown, more developers get added to the project because adding more developers makes the project go faster, and no developer are going to sleep until somehow those damn Shopify pages are part of the site.

Fortunately for your sanity, Gridsome also supports adding in [Shopify](https://gridsome.org/plugins/gridsome-source-shopify) -  and with a few hours tweaking and adjusting layouts, Shopify pages are now part of the the site too.

Of course, just because the CEO wants Shopify doesn't mean the marketing people don't want more pages, especially for the big-ticket parts they get commissions on. So they continue to churn out new pages in ButterCMS using the template you set. Of course, they forget to tell you about the new pages.

## Decoupling Content Creation from Presentation is a Good Thing

The beauty of decoupling your data entry from your site definition and display functions is that marketing can continue doing their thing without either creating wacky WordPress pages that take 15 seconds to load, or bothering your eight times an hour with copy changes in Microsoft that absolutely have to be made to the site this instant. Gridsome ingests ButterCMS content as part of the build process, so those changes get made without developer intervention.

You can focus on the presentation layer once you wire up the site, knowing that ButterCMS can handle whatever content organization you need for this project. And since you're using a Static Site Generator like Gridsome, or for that matter React-based Gatsby, your pages are static, and nearly hack-proof.

## A Happy Ending
![A Happy ending](images/undraw_success_factors_fay0.svg)

Thanks to using ButterCMS and Gridsome, the site for the show is awesomely fast and totally up to date. The marketing team praises you to the heavens because the site you built looks great and loads in a blink of an eye, unlike the sites of their competitors.

What's more, you now have a set of awesome tools in your toolbox and workflow when it comes to creating fast sites in a hurry. The time you invest into the ButterCMS/Gridsome combo is time not wasted trying to squeeze decent performance from bloated WordPress installs that can go belly up when someone decides to add a new emoji plugin.

ButterCMS and Gridsome are a great combination within the larger ecosphere of the JAMStack and having them in your IT Solution box provides your users with a better solution than traditional CMS systems. Check them out and reduce your stress level the next time the VP for Marketing comes calling.
