export function pickContentMeta(data, type) {
  return (
    data
      ?.filter(item => item.slug.startsWith(type.slice(0, 1)))
      .map(item => ({ ...item, slug: item.slug.slice(2) })) ?? []
  );
}
