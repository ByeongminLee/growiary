import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { APP_INFO } from '@/utils/appInfo';
import RecoilRootProvider from '@/components/RecoilRootProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: APP_INFO.URL,
  applicationName: APP_INFO.NAME,
  title: {
    default: APP_INFO.DEFAULT_TITLE,
    template: APP_INFO.TITLE_TEMPLATE,
  },
  description: APP_INFO.DESCRIPTION,
  icons: {
    icon: '/favicon.png',
  },
  manifest: './manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_INFO.DEFAULT_TITLE,
    // startUpImage: [],
  },
  keywords: ['growth', 'diary', 'ai'],
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_INFO.NAME,
    title: {
      default: APP_INFO.DEFAULT_TITLE,
      template: APP_INFO.TITLE_TEMPLATE,
    },
    description: APP_INFO.DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_INFO.DEFAULT_TITLE,
      template: APP_INFO.TITLE_TEMPLATE,
    },
    description: APP_INFO.DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <RecoilRootProvider>{children}</RecoilRootProvider>
        </Providers>
      </body>
    </html>
  );
}
