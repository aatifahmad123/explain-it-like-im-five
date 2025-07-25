'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load the gtag.js script */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-LTSPT7X0V9"
        strategy="afterInteractive"
      />
      {/* Inline config script */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LTSPT7X0V9');
          `,
        }}
      />
    </>
  );
}
