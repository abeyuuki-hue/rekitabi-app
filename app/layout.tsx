import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LiffProvider } from '@/components/LiffProvider';

export const metadata: Metadata = {
  title: '歴旅 - 神社参拝・御朱印巡り',
  description: '全国の神社仏閣を巡るデジタル御朱印帳と参拝ガイド',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-shrine-bg min-h-screen text-stone-800 antialiased selection:bg-red-100 selection:text-shrine-darkred">
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}
