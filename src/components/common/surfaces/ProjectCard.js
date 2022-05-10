import clsx from 'clsx';
import * as React from 'react';
import CloudinaryImg from '../images/CloudinaryImg';
import UnstyledLink from '../links/UnstyledLink';
import TechIcons from '../misc/TechIcons';

export default function ProjectCard({ project, className }) {
  return (
    <li
      className={clsx(
        'project-card rounded-md md:w-full',
        'border dark:border-gray-600',
        'scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu',
        'transition duration-100',
        'motion-reduce:hover:scale-100',
        'animate-shadow',
        className
      )}
    >
      <UnstyledLink
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col items-start rounded-md p-4 focus:outline-none focus-visible:ring focus-visible:ring-primary-300"
      >
        <h4>{project.title}</h4>
        <p className="mb-auto text-sm text-gray-700 dark:text-gray-300">
          {project.description}
        </p>
        <div className="mt-2">
          <TechIcons techs={project.techs.split(',')} />
        </div>

        <CloudinaryImg
          className="pointer-events-none mt-3 w-full"
          publicId={`jakeer/project/${project.banner}/main`}
          alt={project.title}
          width={1440}
          height={792}
          preview={false}
        />

        <p className="animated-underline mt-2 inline-block font-medium">
          See more →
        </p>
      </UnstyledLink>
    </li>
  );
}
