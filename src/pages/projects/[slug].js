import { getMDXComponent } from 'mdx-bundler/client';
import * as React from 'react';
import { HiLink, HiOutlineEye, HiPlay, HiUser } from 'react-icons/hi';
import { SiGithub } from 'react-icons/si';
import TableOfContents from '../../components/common/dataDisplay/TableOfContents';
import Comment from '../../components/common/feedback/Comment';
import LikeButton from '../../components/common/inputs/LikeButton';
import CustomLink from '../../components/common/links/CustomLink';
import CloudinaryImg from '../../components/common/media/CloudinaryImg';
import MDXComponents from '../../components/common/misc/MDXComponents';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/Seo';
import useContentMeta from '../../hooks/useContentMeta';
import useScrollSpy from '../../hooks/useScrollspy';
import { getFileBySlug, getFiles } from '../../lib/mdx';

export default function SingleProjectPage({ code, frontmatter }) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  //#region  //*=========== Content Meta ===========
  const contentSlug = `p_${frontmatter.slug}`;
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
        date={new Date(frontmatter.publishedAt).toISOString()}
      />

      <main>
        <section className="">
          <div className="layout">
            <CloudinaryImg
              publicId={`theodorusclarence/${frontmatter.banner}`}
              alt={frontmatter.title}
              width={1440}
              height={792}
            />

            <h1 className="mt-4">{frontmatter.title}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {frontmatter.description}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-start gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
              {meta?.views && (
                <div className="flex items-center gap-1">
                  <HiOutlineEye className="inline-block text-base" />
                  {meta?.views ?? '–––'} views
                </div>
              )}
              {(frontmatter.github ||
                frontmatter.youtube ||
                frontmatter.link) &&
                ' - '}
              {frontmatter.github && (
                <div className="inline-flex items-center gap-2">
                  <SiGithub className="text-lg text-gray-800 dark:text-white" />
                  <CustomLink href={frontmatter.github} className="mt-1">
                    Repository
                  </CustomLink>
                </div>
              )}
              {frontmatter.github &&
                (frontmatter.youtube || frontmatter.link) &&
                ' - '}
              {frontmatter.youtube && (
                <div className="inline-flex items-center gap-2">
                  <HiPlay className="text-xl text-gray-800 dark:text-white" />
                  <CustomLink href={frontmatter.youtube} className="mt-1">
                    Demo Video
                  </CustomLink>
                </div>
              )}
              {frontmatter.youtube && frontmatter.link && ' - '}
              {frontmatter.link && (
                <div className="inline-flex items-center gap-2">
                  <HiLink className="text-lg text-gray-800 dark:text-white" />
                  <CustomLink href={frontmatter.link} className="mt-1">
                    Open Live Site
                  </CustomLink>
                </div>
              )}
            </div>

            {frontmatter.category && (
              <p className="mt-2 flex items-center justify-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <HiUser className="text-lg text-gray-800 dark:text-white" />{' '}
                {frontmatter.category}
              </p>
            )}

            <hr className="mt-4 dark:border-gray-600" />

            <section className="lg:grid lg:grid-cols-[auto,250px] lg:gap-8">
              <article className="mdx projects prose mx-auto w-full transition-colors dark:prose-invert">
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
                href={`https://github.com/jakeerc/jakeer.com/blob/main/src/contents/projects/${frontmatter.slug}.mdx`}
              >
                Edit this on GitHub
              </CustomLink>
              <CustomLink href="/projects">← Back to projects</CustomLink>
            </div>
          </div>
          <figure className="mt-12">
            <Comment />
          </figure>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const posts = await getFiles('projects');

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
  const post = await getFileBySlug('projects', params?.slug);

  return {
    props: { ...post },
  };
};
