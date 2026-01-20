module.exports = {
  siteUrl: 'https://instad.pastex.online',
  generateRobotsTxt: true,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    };
  },
};
