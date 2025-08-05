// import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

import "@/styles/globals.css";

import Head from "next/head";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";

// import { Toaster } from "react-hot-toast";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/images/favicon.png"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/admin.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />

        <link rel="stylesheet" href="/assets/css/custome.css" />
        <link rel="stylesheet" href="/assets/css/validnavs.css" />

        <link rel="stylesheet" href="/assets//css/responsive.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Round"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
        <link href="/assets/css/font-awesome.min.css" rel="stylesheet" />
        <link href="/assets/css/magnific-popup.css" rel="stylesheet" />
        <link href="/assets/css/flaticon-set.css" rel="stylesheet" />
        <link href="/assets/css/swiper-bundle.min.css" rel="stylesheet" />
        <link href="/assets/css/animate.min.css" rel="stylesheet" />
        <link href="/assets/css/validnavs.css" rel="stylesheet" />
        <link href="/assets/css/helper.css" rel="stylesheet" />
        <link href="/assets/css/unit-test.css" rel="stylesheet" />

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />

        <title>Payroll - Admin Panel</title>
      </Head>
      {/* Non-Critical Scripts */}
      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
        strategy="lazyOnload"
      />
      <Script src="/assets/js/jquery-3.6.0.min.js" defer></Script>
      {/* <Script src="/assets/js/jquery.appear.js" defer></Script> */}
      {/* <Script src="/assets/js/swiper-bundle.min.js" defer></Script> */}
      {/* <Script src="/assets/js/progress-bar.min.js" defer></Script> */}
      {/* <Script src="/assets/js/circle-progress.js" defer></Script> */}
      {/* <Script src="/assets/js/isotope.pkgd.min.js" defer></Script> */}
      {/* <Script src="/assets/js/imagesloaded.pkgd.min.js" defer></Script> */}
      {/* <Script src="/assets/js/magnific-popup.min.js" defer></Script> */}
      {/* <Script src="/assets/js/count-to.js" defer></Script> */}
      {/* <Script src="/assets/js/jquery.scrolla.min.js" defer></Script> */}
      {/* <Script src="/assets/js/validnavs.js" defer></Script> */}
      {/* <Script src="/assets/js/gsap.js" defer></Script> */}
      {/* <Script src="/assets/js/ScrollTrigger.min.js" defer></Script> */}
      {/* <Script src="/assets/js/horizontal-accordion-init.js" defer></Script> */}
      {/* <Script src="/assets/js/main.js" defer></Script> */}
      <Script src="/assets/js/bootstrap.bundle.min.js" defer></Script>

      {/* <Script src="/assets/js/ScrollSmoother.min.js" defer></Script>
      <Script src="/assets/js/scrollTriger-init.js" defer></Script>
      <Script src="/assets/js/cursol-hover.js" defer></Script> */}

      {/* <Toaster position="top-right" /> */}

      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
