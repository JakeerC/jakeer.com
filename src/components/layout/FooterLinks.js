import * as React from 'react';
import { footerLinks } from '../../constants';
import Tooltip from '../common/feedback/Tooltip';
import UnstyledLink from '../common/links/UnstyledLink';

function FooterLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-y-4 gap-x-8">
      {footerLinks.map(({ href, text, tooltip }) => (
        <Tooltip interactive={false} key={href} content={tooltip}>
          <UnstyledLink
            className="animated-underline rounded-sm text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-primary-300 dark:text-gray-200"
            href={href}
            onClick={() => {}}
          >
            {text}
          </UnstyledLink>
        </Tooltip>
      ))}
    </div>
  );
}

export default FooterLinks;
