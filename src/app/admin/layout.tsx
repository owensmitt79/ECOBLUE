import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff Operations Portal | EcoBlue Environmental Services Ltd.',
  description: 'Internal administration and waste dispatch console.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
