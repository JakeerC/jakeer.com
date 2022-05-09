import clsx from 'clsx';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Tweet } from 'react-twitter-widgets';

export default function TweetCard({ tweetId, className }) {
  const { theme } = useTheme();

  return (
    /** Adding width 99% because iframe cuts border
     * @see https://stackoverflow.com/questions/20039576/show-right-border-on-inner-iframe-which-is-being-cut-off-on-100-width/20039683
     */
    <div className={clsx('not-prose w-[99%]', className)}>
      <Tweet tweetId={tweetId} options={{ theme }} />
    </div>
  );
}
