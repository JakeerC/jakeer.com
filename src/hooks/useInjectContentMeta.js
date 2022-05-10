import * as React from 'react';
import useSWR from 'swr';
import { contentMetaFlag } from '../constants/env';
import { pickContentMeta } from '../lib/contentMeta';

export default function useInjectContentMeta(type, frontmatter) {
  const { data: contentMeta, error } = useSWR(
    contentMetaFlag ? '/api/content' : null
  );
  const isLoading = !error && !contentMeta;
  const meta = React.useMemo(
    () => pickContentMeta(contentMeta, type),
    [contentMeta, type]
  );

  const [populatedContent, setPopulatedContent] = React.useState(() => [
    ...frontmatter,
  ]);

  React.useEffect(() => {
    if (meta) {
      const mapped = frontmatter.map(fm => {
        const views = meta.find(meta => meta.slug === fm.slug)?.views;
        const likes = meta.find(meta => meta.slug === fm.slug)?.likes;
        return { ...fm, views, likes };
      });

      setPopulatedContent(mapped);
    }
  }, [meta, isLoading, frontmatter]);

  return populatedContent;
}
