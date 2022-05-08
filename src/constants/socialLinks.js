import { FiMail } from 'react-icons/fi';
import { SiGithub, SiLinkedin, SiTwitter } from 'react-icons/si';
import Accent from '../components/Accent';

export const socials = [
  {
    href: 'mailto:jakeerchilakala@gmail.com',
    icon: FiMail,
    id: 'mail',
    text: (
      <>
        <Accent className="font-medium">jakeerchilakala@gmail.com</Accent>
        <br />
        Click on the icon to mail
      </>
    ),
  },
  {
    href: 'https://github.com/JakeerC',
    icon: SiGithub,
    id: 'Github',
    text: (
      <>
        See my projects on <Accent className="font-medium">Github</Accent>
      </>
    ),
  },
  {
    href: '',
    icon: SiLinkedin,
    id: 'Linkedin',
    text: (
      <>
        Find me on <Accent className="font-medium">Linkedin</Accent>
      </>
    ),
  },
  {
    href: '',
    icon: SiTwitter,
    id: 'Twitter',
    text: (
      <>
        I post updates, tips, insight, and sometimes do some talk. Follow me on{' '}
        <Accent className="font-medium">Twitter</Accent>!
      </>
    ),
  },
];
