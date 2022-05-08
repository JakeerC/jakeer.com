import { ThemeProvider } from 'next-themes';
import Router from 'next/router';
import nProgress from 'nprogress';
import PropTypes from 'prop-types';
import * as React from 'react';
import '../styles/globals.css';
import '../styles/nprogress.css';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Component {...pageProps} />;
    </ThemeProvider>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.element,
  pageProps: PropTypes.any,
};
