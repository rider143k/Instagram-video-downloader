module.exports = {
  siteUrl: 'https://instad.pastex.online',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
