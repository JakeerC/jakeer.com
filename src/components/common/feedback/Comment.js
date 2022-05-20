import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { commentFlag } from '../../../constants/env';

export default function Comment() {
  const { theme } = useTheme();

  return commentFlag ? (
    <Giscus
      key={theme}
      repo="JakeerC/jakeer.com"
      repoId="489557090"
      category="General"
      categoryId="DIC_kwDOE66rZ84B--B0"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      theme={theme === 'light' ? 'light_protanopia' : 'transparent_dark'}
    />
  ) : null;
}
