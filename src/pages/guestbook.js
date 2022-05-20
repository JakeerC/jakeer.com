import * as React from 'react';
import Comment from '../components/common/feedback/Comment';
import CustomLink from '../components/common/links/CustomLink';
import Accent from '../components/common/typography/Accent';
import Layout from '../components/layout/Layout';
import Seo from '../components/Seo';

export default function GuestbookPage() {
  return (
    <Layout>
      <Seo
        templateTitle="Guestbook"
        description="Leave whatever you like to say—message, appreciation, suggestions."
      />

      <main>
        <section className="">
          <div className="layout py-20">
            <h1>
              <Accent>Guestbook</Accent>
            </h1>
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              Leave whatever you like to say—message, appreciation, suggestions.
              If you got some questions, you can leave them on the{' '}
              <CustomLink href="https://github.com/JakeerC/jakeer.com/discussions">
                AMA discussion
              </CustomLink>
            </p>
            <figure className="mt-12">
              <Comment />
            </figure>
          </div>
        </section>
      </main>
    </Layout>
  );
}
