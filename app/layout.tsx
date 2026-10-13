import type { Metadata } from 'next';
import './globals.css';
import { LiffProvider } from '@/components/LiffProvider';

export const metadata: Metadata = {
  title: '歴たび - 全国パワースポットめぐり & 参拝帳',
  description: '社寺霊場巡礼スタンプラリーと参拝記録手帳',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-shrine-bg min-h-screen">
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}
