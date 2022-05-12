import clsx from 'clsx';
import * as React from 'react';
import { GiTechnoHeart } from 'react-icons/gi';
import UnstyledLink from '../links/UnstyledLink';
import TechIcons from '../misc/TechIcons';
import Accent from '../typograpghy/Accent';

export default function LibraryCard({ className, snippet }) {
  return (
    <li
      className={clsx(
        'ring-vis-0 h-full rounded-md border bg-slate-100 dark:border-gray-600 dark:bg-dark',
        'scale-100 hover:scale-[1.04] active:scale-[0.97] motion-safe:transform-gpu',
        'transition duration-100',
        'motion-reduce:hover:scale-100',
        'animate-shadow',
        className
      )}
    >
      <UnstyledLink
        href={`/library/${snippet.slug}`}
        className="block h-full rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-300"
      >
        <div className="p-4">
          <h4 className="text-gray-800 dark:text-gray-100">{snippet.title}</h4>

          <div className="mt-1 flex items-center justify-start gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <GiTechnoHeart className="inline-block text-base" />
              <Accent>{snippet?.likes ?? '–––'} likes</Accent>
            </div>
            <span>•</span>
            <TechIcons techs={snippet.tags.split(',')} />
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            {snippet.description}
          </p>
        </div>
      </UnstyledLink>
    </li>
  );
}
