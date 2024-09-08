import { Html, Head, Main, NextScript } from "next/document";
import dynamic from "next/dynamic";
import { THEME_KEY } from "@/stores/dashboard";

const GoogleAnalytics = dynamic(
  () => import("@/components/elements/addons/GoogleAnalytics"),
  {
    ssr: false,
  }
);
const FacebookPixel = dynamic(
  () => import("@/components/elements/addons/FacebookPixel"),
  {
    ssr: false,
  }
);

const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "system";
const darkmodeInitScript = `(function () {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const setting = localStorage.getItem('${THEME_KEY}') || '${defaultTheme}'
  if (setting === 'dark' || (prefersDark && setting !== 'light')) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})()`;

export default function Document() {
  return (
    <Html suppressHydrationWarning={true}>
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: darkmodeInitScript }}
        ></script>
        <GoogleAnalytics />
        <FacebookPixel />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="portal-root"></div>
      </body>
    </Html>
  );
}
