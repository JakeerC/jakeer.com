export const domain =
  process.env.NODE_ENV === 'production'
    ? 'https://jakeer.vercel.app'
    : 'http://localhost:3000/';

export const footerLinks = [
  {
    href: 'https://github.com/JakeerC/jakeer.com',
    text: 'Source Code',
    tooltip: (
      <>
        This website is <strong>open source</strong>!
      </>
    ),
  },
  {
    href: '/docs',
    text: 'Docs',
    tooltip: 'Personal documentation about my best practices on development',
  },

  {
    href: '/guestbook',
    text: 'Guestbook',
    tooltip:
      'Leave whatever you like to say—message, appreciation, suggestions',
  },
  {
    href: '/subscribe',
    text: 'Subscribe',
    tooltip: 'Get an email whenever I post, no spam',
  },
  {
    href: `${domain}/rss.xml`,
    text: 'RSS',
    tooltip: 'Add theodorusclarence.com blog to your feeds',
  },
];
