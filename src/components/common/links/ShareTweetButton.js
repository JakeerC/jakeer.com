import clsx from 'clsx';
import * as React from 'react';
import { SiTwitter } from 'react-icons/si';
import ButtonLink from './ButtonLink';

export default function ShareTweetButton({ url, title, className, ...rest }) {
  const text = `I just read an article about ${title} by @th_clarence.`;
  const intentUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(text)}%0A%0A`;

  return (
    <ButtonLink
      {...rest}
      href={intentUrl}
      className={clsx('items-center gap-2', className)}
    >
      <SiTwitter className="text-[1.2em] text-[#1da1f2]" />
      Tweet this article
    </ButtonLink>
  );
}
