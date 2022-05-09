import { socials } from '../../constants';
import Tooltip from '../common/feedback/Tooltip';
import UnstyledLink from '../common/links/UnstyledLink';

function SocialLinks() {
  return (
    <div className="mt-2 flex space-x-4">
      <div className="flex items-center justify-center"></div>
      {socials.map(social => (
        <Tooltip interactive={false} key={social.href} content={social.text}>
          <UnstyledLink
            className="inline-flex items-center justify-center rounded-sm focus:outline-none focus-visible:ring focus-visible:ring-primary-300"
            href={social.href}
            onClick={() => {}}
          >
            <social.icon className="my-auto h-6 w-6 align-middle text-gray-600 transition-colors hover:text-primary-300 dark:text-gray-300 dark:hover:text-primary-300" />
          </UnstyledLink>
        </Tooltip>
      ))}
    </div>
  );
}

export default SocialLinks;
