import clsx from 'clsx';
import { IoNewspaperSharp } from 'react-icons/io5';
import { SiGithub } from 'react-icons/si';
import CJ from '../components/CJ';
import ButtonLink from '../components/common/links/ButtonLink';
import UnstyledLink from '../components/common/links/UnstyledLink';
import Accent from '../components/common/typograpghy/Accent';
import Layout from '../components/layout/Layout';
import Seo from '../components/Seo';
import useLoaded from '../hooks/useLoaded';

export default function Home() {
  const isLoaded = useLoaded();
  return (
    <Layout>
      <Seo />

      <main>
        <section
          className={clsx(
            'min-h-main  -mt-20 mb-20 flex flex-col justify-center ',
            isLoaded && 'fade-in-start'
          )}
        >
          <article className="layout">
            <h2 className="text-2xl md:text-4xl 2xl:text-5xl" data-fade="1">
              Hi!
            </h2>
            <h1
              className="mt-1 text-3xl md:text-5xl 2xl:text-6xl"
              data-fade="2"
            >
              {"I'm "}
              <Accent>Jakeer</Accent>
            </h1>
            <p
              className={clsx(
                'mt-4 max-w-4xl text-gray-700 dark:text-gray-200 md:mt-6',
                'md:text-lg 2xl:text-xl'
              )}
              data-fade="3"
            >
              {/**
               * @TODO add intro
               */}
            </p>

            <div
              data-fade="5"
              className="mt-8 flex flex-wrap gap-4 md:!text-lg"
            >
              <div className="group relative">
                <div
                  className={clsx(
                    'absolute -inset-0.5 animate-tilt rounded blur',
                    'bg-gradient-to-r from-primary-300 to-primary-400',
                    'dark:from-primary-200 dark:via-primary-300',
                    'opacity-75 transition duration-1000 group-hover:opacity-100 group-hover:duration-200'
                  )}
                />
                <ButtonLink href="/blog">Read my blog</ButtonLink>
              </div>
              <div className="group relative">
                <div
                  className={clsx(
                    'absolute -inset-0.5 animate-tilt rounded blur',
                    'bg-gradient-to-r from-primary-300 to-primary-400',
                    'dark:from-primary-200 dark:via-primary-300',
                    'opacity-75 transition duration-1000 group-hover:opacity-100 group-hover:duration-200'
                  )}
                />
                <ButtonLink href="/about">Learn more about me</ButtonLink>
              </div>
            </div>
            <div
              data-fade="6"
              className="mt-8 flex flex-wrap gap-4 gap-y-2 md:mt-8 "
            >
              <UnstyledLink
                href="#resume"
                className={clsx(
                  'inline-flex items-center gap-1 text-sm font-medium md:text-base',
                  'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white',
                  'focus:outline-none focus-visible:ring focus-visible:ring-primary-300',
                  'transition-colors'
                )}
              >
                <IoNewspaperSharp className="shrink-0" />
                <span>Resume</span>
              </UnstyledLink>

              <UnstyledLink
                href="https://github.com/jakeerc"
                className={clsx(
                  'inline-flex items-center gap-1 text-sm font-medium md:text-base',
                  'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white',
                  'focus:outline-none focus-visible:ring focus-visible:ring-primary-300',
                  'transition-colors'
                )}
              >
                <SiGithub className="shrink-0" />
                <span>JakeerC</span>
              </UnstyledLink>
            </div>
          </article>
          {/* <UnstyledLink
            href="#intro"
            className={clsx(
              'absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-10',
              'cursor-pointer rounded-md transition-colors',
              'hover:text-primary-300 focus-visible:text-primary-300'
            )}
          >
            <IoArrowDownOutline className="h-8 w-8 animate-bounce md:h-10 md:w-10" />
          </UnstyledLink> */}

          <CJ
            className={clsx(
              'absolute bottom-[40%] right-6',
              'translate-y-[37%] transform-gpu',
              'w-[calc(100%-3rem)] md:w-[600px] 2xl:w-[900px]',
              'z-[-1] opacity-70 dark:opacity-30',
              'text-gray-400 dark:text-gray-300/40'
            )}
          />
        </section>
      </main>
    </Layout>
  );
}
