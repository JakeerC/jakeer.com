import * as React from 'react';
import { authorName } from '../../constants';
import FooterLinks from './FooterLinks';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="mt-4 pb-2">
      <main className="layout flex flex-col items-center border-t pt-6 dark:border-gray-600">
        <FooterLinks />

        <p className="mt-12 font-medium text-gray-600 dark:text-gray-300">
          Reach me out
        </p>
        <SocialLinks />

        <p className="mt-8 text-sm text-gray-600 dark:text-gray-300">
          © {authorName} {new Date().getFullYear()} •{' '}
          <button className="rounded-sm hover:text-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-primary-300 dark:hover:text-gray-100">
            Got any feedback?
          </button>
        </p>
      </main>
    </footer>
  );
}
