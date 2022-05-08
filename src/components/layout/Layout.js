import * as React from 'react';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div id="skip-nav">{children}</div>
      <Footer />
    </>
  );
}
