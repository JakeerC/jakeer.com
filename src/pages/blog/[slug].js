import clsx from 'clsx';
import { format } from 'date-fns';
import { getMDXComponent } from 'mdx-bundler/client';
import * as React from 'react';
import { HiOutlineClock, HiOutlineEye } from 'react-icons/hi';
import { MdHistory } from 'react-icons/md';
import TableOfContents from '../../components/common/dataDisplay/TableOfContents';
import Comment from '../../components/common/feedback/Comment';
import Tooltip from '../../components/common/feedback/Tooltip';
import CustomLink from '../../components/common/links/CustomLink';
import ShareTweetButton from '../../components/common/links/ShareTweetButton';
import UnstyledLink from '../../components/common/links/UnstyledLink';
import CloudinaryImg from '../../components/common/media/CloudinaryImg';
import MDXComponents from '../../components/common/misc/MDXComponents';
import BlogCard from '../../components/common/surfaces/BlogCard';
import Accent from '../../components/common/typography/Accent';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/Seo';
import useContentMeta from '../../hooks/useContentMeta';
import useInjectContentMeta from '../../hooks/useInjectContentMeta';
import useScrollSpy from '../../hooks/useScrollspy';
import { getFileBySlug, getFiles, getRecommendations } from '../../lib/mdx';

export default function SingleBlogPage({ code, frontmatter, recommendations }) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  const populatedRecommendations = useInjectContentMeta(
    'blog',
    recommendations
  );

  //#region  //*=========== Link Constants ===========
  const GITHUB_REPO = `https://github.com/JakeerC/jakeer.com`;
  const COMMIT_HISTORY_LINK = `${GITHUB_REPO}/commits/main/src/contents/blog/${frontmatter.slug}.mdx`;
  const GITHUB_EDIT_LINK = `${GITHUB_REPO}/blob/main/src/contents/blog/${frontmatter.slug}.mdx`;
  const OG_BANNER_LINK = `https://res.cloudinary.com/jakeer/image/upload/f_auto,c_fill,ar_4:5,w_1200/jakeer/blog/${frontmatter.banner}/main`;
  //#endregion  //*======== Link Constants ===========

  // //#region  //*=========== Blog Language ===========
  // const cleanSlug = frontmatter.slug;
  // //#endregion  //*======== Blog Language ===========

  //#region  //*=========== Content Meta ===========
  const contentSlug = `b_${frontmatter.slug}`;
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
        isBlog
        banner={OG_BANNER_LINK}
        date={new Date(
          frontmatter.lastUpdated ?? frontmatter.publishedAt
        ).toISOString()}
      />

      <main>
        {/* <ReloadDevtool /> */}
        <section className="">
          <div className="layout">
            <div className="pb-4 dark:border-gray-600">
              <CloudinaryImg
                publicId={`jakeer/blog/${frontmatter.banner}/main`}
                alt={`Photo from unsplash: ${frontmatter.banner}`}
                width={1200}
                height={(1200 * 2) / 5}
                aspect={{ height: 2, width: 5 }}
              />

              <h1 className="mt-4">{frontmatter.title}</h1>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Written on{' '}
                {format(new Date(frontmatter.publishedAt), 'MMMM dd, yyyy')} by
                Jakeer Chilakala
              </p>
              {frontmatter.lastUpdated && (
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <p>
                    Last updated{' '}
                    {format(new Date(frontmatter.lastUpdated), 'MMMM dd, yyyy')}
                    .
                  </p>
                  <UnstyledLink
                    href={COMMIT_HISTORY_LINK}
                    className={clsx(
                      'inline-flex items-center gap-1 rounded-sm font-medium',
                      'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-primary-300',
                      'focus:outline-none focus-visible:ring focus-visible:ring-primary-300'
                    )}
                  >
                    <MdHistory className="text-lg" />
                    <span>See changes</span>
                  </UnstyledLink>
                </div>
              )}
              <div className="mt-6 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <HiOutlineClock className="inline-block text-base" />
                  <Accent>{frontmatter.readingTime.text}</Accent>
                </div>
                {meta?.devtoViews ? (
                  <Tooltip
                    content={
                      <>
                        {meta.devtoViews} views on{' '}
                        <CustomLink href="https://dev.to/jakeer">
                          dev.to
                        </CustomLink>
                      </>
                    }
                    position="bottom"
                  >
                    <div className="flex items-center gap-1">
                      <HiOutlineEye className="inline-block text-base" />
                      <Accent>{meta?.views ?? '–––'} views</Accent>
                    </div>
                  </Tooltip>
                ) : (
                  meta?.views && (
                    <div className="flex items-center gap-1">
                      <HiOutlineEye className="inline-block text-base" />
                      <Accent>{meta?.views ?? '–––'} views</Accent>
                    </div>
                  )
                )}
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
                  {/* <div className="flex items-center justify-center py-8">
                    <LikeButton slug={contentSlug} />
                  </div> */}
                </div>
              </aside>
            </section>

            <ShareTweetButton
              className="mt-12"
              url={`https://jakeer.vercel.app/blog/${frontmatter.slug}`}
              title={frontmatter.title}
            />

            {populatedRecommendations.length > 0 && (
              <div className="mt-20">
                <h2>
                  <Accent>Other posts that you might like</Accent>
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {populatedRecommendations.map((post, i) => (
                    <BlogCard
                      onClick={() => {}}
                      className={clsx({ 'hidden xl:block': i === 2 })}
                      key={post.slug}
                      post={post}
                    />
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-col items-start gap-4 md:flex-row-reverse md:justify-between">
              <CustomLink href={GITHUB_EDIT_LINK}>
                Edit this on GitHub
              </CustomLink>
              <CustomLink href="/blog">← Back to blog</CustomLink>
            </div>
            <figure className="mt-12">
              <Comment />
            </figure>
          </div>
        </section>
      </main>
    </Layout>
  );
}
export const getStaticPaths = async () => {
  const posts = await getFiles('blog');

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
  const post = await getFileBySlug('blog', params?.slug);

  const recommendations = await getRecommendations(params?.slug);
  const { code, frontmatter } = post;
  return {
    props: { code, frontmatter, recommendations, fallback: false },
  };
};
