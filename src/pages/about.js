/* eslint-disable react/no-unescaped-entities */
import clsx from 'clsx';
import * as React from 'react';
import ButtonLink from '../components/common/links/ButtonLink';
import UnstyledLink from '../components/common/links/UnstyledLink';
import Accent from '../components/common/typography/Accent';
import Layout from '../components/layout/Layout';
import Seo from '../components/Seo';
import useLoaded from '../hooks/useLoaded';

export default function AboutPage() {
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo
        templateTitle="About"
        description="Jakeer is a mostly  front-end developer . He write blogs about his on understanding topics in front-end development."
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className="layout min-h-main py-12 sm:py-20">
            <h1 className="mt-1" data-fade="1">
              <Accent>About</Accent>
            </h1>
            <div className="mt-4" data-fade="2">
              <article className="prose dark:prose-invert">
                <p data-fade="3">
                  Hello! I'm <Accent>Jakeer</Accent> from India, working as a
                  Software Engineer professional in Bangalore . I love traveling
                  to remote places and trek.
                </p>
                <p data-fade="4">
                  There are a lot of useful things and technologies to learn . I
                  am motivated to learn as much as possible. I enjoy learning
                  something new and getting feedback to make myself better and
                  improve.
                </p>
                <p data-fade="5">
                  In this website I will be writing some blogs, showcase my
                  projects and add reusable snippets of code. I believe that
                  writing and sharing what I have learned is the best way to
                  remember things .So, this is a small step in that cause and to
                  document what I learned for my future self. So do contact me
                  and I will be very happy to help!
                </p>
              </article>
              <div
                className="mt-8 flex content-center justify-center gap-x-4 md:justify-start"
                data-fade="6"
              >
                <div className="w-22 group relative" data-fade="6">
                  <div
                    className={clsx(
                      'absolute -inset-0.5 animate-tilt rounded blur',
                      'bg-gradient-to-r from-primary-300 to-primary-400',
                      'dark:from-primary-200 dark:via-primary-300',
                      'opacity-75 transition duration-1000 group-hover:opacity-100 group-hover:duration-200'
                    )}
                  />
                  <ButtonLink href="mailto:jakeerchilakala@gmail.com">
                    Hire me
                  </ButtonLink>
                </div>
                <div className="group relative w-24" data-fade="7">
                  <ButtonLink href="/about">Resume</ButtonLink>
                </div>
                <div className="group relative w-24" data-fade="8">
                  <ButtonLink href="#contact">Contact</ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="layout py-6">
            <h2>Contact</h2>
            <article className="prose mt-4 dark:prose-invert">
              <p>
                Do
                <Accent>
                  <UnstyledLink href="mailto:jakeerchilakala@gmail.com">
                    contact
                  </UnstyledLink>
                </Accent>{' '}
                me if you need my opinion or help about web development,
                especially frontend works. I’ll be happy to help!
              </p>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
