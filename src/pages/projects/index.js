import clsx from 'clsx';
import * as React from 'react';
import ProjectCard from '../../components/common/surfaces/ProjectCard';
import Accent from '../../components/common/typograpghy/Accent';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/Seo';
import useLoaded from '../../hooks/useLoaded';
import { getAllFilesFrontmatter } from '../../lib/mdx';
import { sortByDate } from '../../lib/mdx-client';

export default function ProjectsPage({ projects }) {
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo
        templateTitle="Projects"
        description="Showcase of my projects on front-end development that I'm proud of."
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className="layout py-12">
            <h1 className="text-3xl md:text-5xl" data-fade="0">
              <Accent>Projects</Accent>
            </h1>
            <p data-fade="1" className="mt-2 text-gray-600 dark:text-gray-300">
              Showcase of my works on frontend development.
            </p>

            <ul
              data-fade="2"
              className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {projects.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = await getAllFilesFrontmatter('projects');
  const projects = sortByDate(files);

  return { props: { projects } };
}
