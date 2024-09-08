/** *************************************************************
 * Please refer to the Theme Options section in documentation   *
 ****************************************************************/

/**
 * Social Links under the Main Menu
 */

export interface SocialLink {
  name: string;
  url: string;
  Icon: string;
}

export const social: SocialLink[] = [
  {
    name: "Twitter",
    url: "https://www.twitter.com/",
    Icon: "mdi:twitter",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/",
    Icon: "mdi:instagram",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    Icon: "mdi:linkedin",
  },
];

/**
 * General configurations
 */

export interface Config {
  dateLocale: string;
  dateOptions: Intl.DateTimeFormatOptions;
  convertKit: {
    tipUrl: string;
  };
  contactForm: {
    inputs: any;
    recipient: string;
    sender: string;
    subject: string;
  };
}

/**
 * MDX/Markdown configurations
 */

export interface MDXConfig {
  publicDir: string;
  pagesDir: string;
  fileExt: string;
  collections: string[];
  remarkPlugins: any[];
  rehypePlugins: any[];
}

export const mdxConfig: MDXConfig = {
  publicDir: "public",
  pagesDir: "content",
  fileExt: ".md",
  collections: ["/blog", "/projects"],
  remarkPlugins: [],
  rehypePlugins: [],
};

/**
 * Global SEO configuration for next-seo plugin
 * https://github.com/garmeeh/next-seo
 */

export interface siteMetaData {
  siteUrl: string;
  authorName: string;
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  email: string;
  locale: string;
  twitter: {
    handle: string;
    site: string;
    cardType: string;
  };
}

export const siteMetaData: siteMetaData = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000",
  authorName: "John Doe",
  siteName: "John Doe",
  defaultTitle: "John Doe Personal Site",
  titleTemplate: "John Doe | %s",
  description: "A short description goes here.",
  email: "hello@example.com",
  locale: "en_US",
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};
