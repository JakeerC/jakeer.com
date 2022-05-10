import axios from 'axios';

export async function getViewsFromDevto() {
  try {
    const res = await axios.get('https://dev.to/api/articles/me', {
      headers: {
        'api-key': process.env.DEVTO_KEY,
      },
    });

    return res.data
      .filter(d => d.canonical_url.includes('https://jakeer.vercel.app/blog'))
      .map(d => ({
        slug: d.canonical_url.slice(35),
        views: d.page_views_count,
      }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
