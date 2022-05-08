export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function openGraph({
  siteName,
  templateTitle,
  description,
  banner,
  logo = 'https://jakeer.vercel.app/favicon/large-og.jpeg',
  isBlog = false,
}) {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  if (isBlog) {
    const ogBanner = banner ? encodeURIComponent(banner.trim()) : undefined;
    /**
     * @TODO return proper URL
     */

    return `https://og.thcl.dev/api/blog?templateTitle=${ogTemplateTitle}&banner=${ogBanner}`;
  }

  /**
   * @TODO return proper URL
   */
  return `https://og.thcl.dev/api/gradient?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
}

/**
 * Remove `id-` prefix
 */
export const cleanBlogPrefix = slug => {
  if (slug.slice(0, 3) === 'id-') {
    return slug.slice(3);
  } else {
    return slug;
  }
};

/**
 * Access session storage on browser
 */
export function getFromSessionStorage(key) {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export function getFromLocalStorage(key) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}
