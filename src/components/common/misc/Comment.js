import { Giscus } from '@giscus/react';
import { useTheme } from 'next-themes';
import { commentFlag } from '../../../constants/env';

export default function Comment() {
  const { theme } = useTheme();

  return commentFlag ? (
    <Giscus
      key={theme}
      repo=""
      repoId=""
      category="General"
      categoryId=""
      mapping="pathname"
      reactionsEnabled="0"
      emitMetadata="0"
      theme={theme}
    />
  ) : null;
}
