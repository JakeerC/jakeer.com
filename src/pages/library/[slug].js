import { getMDXComponent } from 'mdx-bundler/client';
import * as React from 'react';
import { HiOutlineEye } from 'react-icons/hi';
import TableOfContents from '../../components/common/dataDisplay/TableOfContents';
import TechIcons from '../../components/common/dataDisplay/TechIcons';
import LikeButton from '../../components/common/inputs/LikeButton';
import CustomLink from '../../components/common/links/CustomLink';
import MDXComponents from '../../components/common/misc/MDXComponents';
import Accent from '../../components/common/typograpghy/Accent';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/Seo';
import useContentMeta from '../../hooks/useContentMeta';
import useScrollSpy from '../../hooks/useScrollspy';
import { getFileBySlug, getFiles } from '../../lib/mdx';

export default function SingleLibraryPage({ code, frontmatter }) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  //#region  //*=========== Content Meta ===========
  const contentSlug = `l_${frontmatter.slug}`;
  const meta = useContentMeta(contentSlug, { runIncrement: true });
  //#endregion  //*======== Content Meta ===========

  //#region  //*=========== Scrollspy ===========
  const activeSection = useScrollSpy();

  const [toc, setToc] = React.useState();
  const minLevel =
    toc?.reduce((min, item) => (item.level < min ? item.level : min), 10) ?? 0;

  React.useEffect(() => {
    const headings = document.querySelectorAll('.mdx h1, .mdx h2, .mdx h3');

    const headingArr = [];
    headings.forEach(heading => {
      const id = heading.id;
      const level = +heading.tagName.replace('H', '');
      const text = heading.textContent + '';

      headingArr.push({ id, level, text });
    });

    setToc(headingArr);
  }, [frontmatter.slug]);
  //#endregion  //*======== Scrollspy ===========

  return (
    <Layout>
      <Seo
        templateTitle={frontmatter.title}
        description={frontmatter.description}
      />

      <main>
        <section className="">
          <div className="layout">
            <div className="border-b-thin pb-4 dark:border-gray-600">
              <h1 className="mt-4">{frontmatter.title}</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {frontmatter.description}
              </p>
              <div className="mt-2 flex items-center justify-start gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <HiOutlineEye className="inline-block text-base" />
                  <Accent>{meta?.views ?? '–––'} views</Accent>
                </div>
                <span>•</span>
                <TechIcons techs={frontmatter.tags.split(',')} />
              </div>
            </div>

            <hr className="dark:border-gray-600" />

            <section className="lg:grid lg:grid-cols-[auto,250px] lg:gap-8">
              <article className="mdx prose mx-auto mt-4 w-full transition-colors dark:prose-invert">
                <Component
                  components={{
                    ...MDXComponents,
                  }}
                />
              </article>

              <aside className="py-4">
                <div className="sticky top-36">
                  <TableOfContents
                    toc={toc}
                    minLevel={minLevel}
                    activeSection={activeSection}
                  />
                  <div className="flex items-center justify-center py-8">
                    <LikeButton slug={contentSlug} />
                  </div>
                </div>
              </aside>
            </section>

            <div className="mt-8 flex flex-col items-start gap-4 md:flex-row-reverse md:justify-between">
              <CustomLink
                href={`https://github.com/theodorusclarence/theodorusclarence.com/blob/main/src/contents/library/${frontmatter.slug}.mdx`}
              >
                Edit this on GitHub
              </CustomLink>
              <CustomLink href="/library">← Back to library</CustomLink>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const posts = await getFiles('library');

  return {
    paths: posts.map(p => ({
      params: {
        slug: p.replace(/\.mdx/, ''),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const post = await getFileBySlug('library', params?.slug);

  return {
    props: { ...post },
  };
};
