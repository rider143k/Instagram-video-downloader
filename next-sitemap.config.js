/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://instad.pastex.online',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
