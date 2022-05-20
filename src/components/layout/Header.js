import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import CJ from '../CJ';
import UnstyledLink from '../common/links/UnstyledLink';
import Accent from '../common/typograpghy/Accent';

export default function Header({ large = false }) {
  const { theme, setTheme } = useTheme();

  //#region  //*=========== Route Functionality ===========
  const router = useRouter();
  /** Ex: /projects/petrolida-2021 -> ['', 'projects', 'petrolida-2021'] */
  const arrOfRoute = router.route.split('/');
  const baseRoute = '/' + arrOfRoute[1];
  //#endregion  //*======== Route Functionality ===========

  //#region  //*=========== Scroll Shadow ===========
  const [onTop, setOnTop] = React.useState(true);
  React.useEffect(() => {
    const handleScroll = () => {
      setOnTop(window.pageYOffset === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  //#endregion  //*======== Scroll Shadow ===========

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-shadow',
        !onTop && 'shadow-sm'
      )}
    >
      {/* Skip Navigation */}
      <a
        href="#skip-nav"
        className={clsx(
          'rounded-sm p-2 transition',
          'font-medium text-black dark:text-white',
          'bg-slate-100 dark:bg-dark',
          'group dark:hover:text-primary-300',
          'focus:outline-none focus:ring focus:ring-primary-300',
          'absolute top-4 left-4',
          '-translate-y-16 focus:translate-y-0'
        )}
      >
        <Accent>Skip to main content</Accent>
      </a>

      {/* Gradient List */}
      {/* <div className="h-2 bg-gradient-to-tr from-primary-200 via-primary-300 to-primary-400" /> */}

      <div className="bg-slate-100 transition-colors dark:bg-dark dark:text-white">
        <nav
          className={clsx(
            'layout flex items-center justify-between py-4',
            large && 'lg:max-w-[68rem]'
          )}
        >
          <div className="text-xs md:space-x-4 md:text-base">
            <UnstyledLink
              href={'/'}
              className={clsx(
                'rounded-sm py-2 transition-colors',
                'font-medium text-black dark:text-white',
                'group dark:hover:text-primary-300',
                'focus:outline-none focus-visible:ring focus-visible:ring-primary-300'
              )}
            >
              <CJ
                className={clsx(
                  'z-[1132]',
                  'transition-colors',
                  'text-primary-500 dark:text-primary-400'
                )}
                width="50"
                height="30"
              />
            </UnstyledLink>
          </div>
          <ul className="flex  items-center justify-between  text-xs sm:space-x-3 md:space-x-4 md:text-base">
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink
                  href={href}
                  className={clsx(
                    'rounded-sm py-2 transition-colors',
                    'font-medium text-black dark:text-white',
                    'group dark:hover:text-primary-300',
                    'focus:outline-none focus-visible:ring focus-visible:ring-primary-300'
                  )}
                >
                  <span
                    className={clsx(
                      'transition-colors',
                      'rounded-md  px-4 py-2',
                      'bg-primary-300/0  group-hover:bg-primary-300/20 dark:group-hover:bg-primary-300/0',
                      href === baseRoute &&
                        '!bg-primary-300/50 dark:bg-gradient-to-tr dark:from-primary-300 dark:to-primary-400 dark:bg-clip-text dark:text-transparent'
                    )}
                  >
                    {label}
                  </span>
                </UnstyledLink>
              </li>
            ))}
          </ul>
          <button
            className={clsx(
              'rounded-md p-2.5 focus:outline-none',
              'border-none',
              'hover:border-primary-300 hover:text-primary-300 dark:hover:border-primary-300 dark:hover:text-primary-300',
              'focus-visible:border-primary-300 focus-visible:text-primary-300 dark:focus-visible:border-primary-300 dark:focus-visible:text-primary-300'
            )}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/library', label: 'Library' },
  { href: '/about', label: 'About' },
];
