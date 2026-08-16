export const SITE_CONFIG = {
  name: 'Tools by Vineet',
  shortName: 'Tools',
  tagline: 'A growing collection of practical tools I\'ve built to make everyday work a little easier.',
  description: 'Tools by Vineet — A curated collection of useful software tools built by Vineet Sansare, starting with JD2CV (AI-powered CV Tailoring).',
  siteUrl: 'https://toolsby.vineetsansare.com',
  portfolioUrl: 'https://vineetsansare.com',
  githubUrl: 'https://github.com/vineetsansare',
  author: 'Vineet Sansare',
  
  // External Tool URLs
  // Easily override via environment variable VITE_JD2CV_URL if deployed to a custom subdomain/URL
  jd2cvUrl: import.meta.env.VITE_JD2CV_URL || 'https://toolsby.vineetsansare.com/jd2cv/',
};
