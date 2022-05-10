import clsx from 'clsx';
import * as React from 'react';
import { HiCalendar, HiEye } from 'react-icons/hi';
import Tag, { SkipNavTag } from '../../components/common/dataDisplay/Tag';
import ContentPlaceholder from '../../components/common/feedback/ContentPlaceholder';
import StyledInput from '../../components/common/inputs/StyledInput';
import SortListbox from '../../components/common/misc/SortListbox';
import BlogCard from '../../components/common/surfaces/BlogCard';
import Accent from '../../components/common/typograpghy/Accent';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/Seo';
import useInjectContentMeta from '../../hooks/useInjectContentMeta';
import useLoaded from '../../hooks/useLoaded';
import { getFromSessionStorage } from '../../lib/helper';
import { getAllFilesFrontmatter } from '../../lib/mdx';
import { getTags, sortByDate, sortDateFn } from '../../lib/mdx-client';

const sortOptions = [
  {
    id: 'date',
    name: 'Sort by date',
    icon: HiCalendar,
  },
  {
    id: 'views',
    name: 'Sort by views',
    icon: HiEye,
  },
];

export default function IndexPage({ posts, tags }) {
  /** Lazy init from session storage to preserve preference on revisit */
  const [sortOrder, setSortOrder] = React.useState(
    () => sortOptions[Number(getFromSessionStorage('blog-sort')) || 0]
  );
  // const [isEnglish, setIsEnglish] = React.useState(true);
  const isLoaded = useLoaded();

  const populatedPosts = useInjectContentMeta('blog', posts);

  //#region  //*=========== Search ===========
  const [search, setSearch] = React.useState('');
  const [filteredPosts, setFilteredPosts] = React.useState(() => [...posts]);

  const handleSearch = e => {
    setSearch(e.target.value);
  };
  // const clearSearch = () => setSearch('');

  React.useEffect(() => {
    const results = populatedPosts.filter(
      post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()) ||
        // Check if splitted search contained in tag
        search
          .toLowerCase()
          .split(' ')
          .every(tag => post.tags.includes(tag))
    );

    if (sortOrder.id === 'date') {
      results.sort(sortDateFn);
      sessionStorage.setItem('blog-sort', '0');
    } else if (sortOrder.id === 'views') {
      results.sort((a, b) => (b?.views ?? 0) - (a?.views ?? 0));
      sessionStorage.setItem('blog-sort', '1');
    }

    setFilteredPosts(results);
  }, [search, sortOrder.id, populatedPosts]);
  //#endregion  //*======== Search ===========

  //#region  //*=========== Post Language Splitter ===========
  const englishPosts = filteredPosts.filter(p => !p.slug.startsWith('id-'));
  const currentPosts = englishPosts;
  //#endregion  //*======== Post Language Splitter ===========

  //#region  //*=========== Tag ===========
  const toggleTag = tag => {
    // If tag is already there, then remove
    if (search.includes(tag)) {
      setSearch(s =>
        s
          .split(' ')
          .filter(t => t !== tag)
          ?.join(' ')
      );
    } else {
      // append tag
      setSearch(s => (s !== '' ? `${s.trim()} ${tag}` : tag));
    }
  };

  /** Currently available tags based on filtered posts */
  const filteredTags = getTags(currentPosts);

  /** Show accent if not disabled and selected  */
  const checkTagged = tag =>
    filteredTags.includes(tag) && search.toLowerCase().split(' ').includes(tag);
  //#endregion  //*======== Tag ===========

  return (
    <Layout>
      <Seo
        templateTitle="Blog"
        description="Thoughts, mental models, and tutorials about front-end development. Rebuild your mental model so front-end development can be predictable."
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className="layout py-12">
            <h1 className="text-3xl md:text-5xl" data-fade="0">
              <Accent>Blog </Accent>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300" data-fade="1">
              Thoughts, mental models, and tutorials about front-end
              development.
            </p>
            <StyledInput
              data-fade="2"
              className="mt-4"
              placeholder="Search..."
              onChange={handleSearch}
              value={search}
              type="text"
            />
            <div
              className="mt-2 flex flex-wrap items-baseline justify-start gap-2 text-sm text-gray-600 dark:text-gray-300"
              data-fade="3"
            >
              <span className="font-medium">Choose topic:</span>
              <SkipNavTag>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    disabled={!filteredTags.includes(tag)}
                  >
                    {checkTagged(tag) ? <Accent>{tag}</Accent> : tag}
                  </Tag>
                ))}
              </SkipNavTag>
            </div>
            <div
              className="relative z-10 mt-6 flex flex-col items-end gap-4 text-gray-600 dark:text-gray-300 md:flex-row md:items-center md:justify-between"
              data-fade="4"
            >
              <SortListbox
                selected={sortOrder}
                setSelected={setSortOrder}
                options={sortOptions}
              />
            </div>
            <ul
              className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              data-fade="5"
            >
              {currentPosts.length > 0 ? (
                currentPosts.map(post => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    checkTagged={checkTagged}
                  />
                ))
              ) : (
                <ContentPlaceholder />
              )}
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = await getAllFilesFrontmatter('blog');
  const posts = sortByDate(files);

  // Accumulate tags and remove duplicate
  const tags = getTags(posts);

  return { props: { posts, tags } };
}
