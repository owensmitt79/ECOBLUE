import type { Metadata } from 'next';
import '@/styles/variables.css';
import '@/styles/main.css';
import '@/styles/components.css';
import '@/styles/admin.css';

import { ToastProvider } from '@/components/Toast';
import { ModalProvider } from '@/context/ModalContext';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: 'EcoBlue Environmental Services Ltd. | Waste Management & Sustainability Port Harcourt',
  description: 'EcoBlue Environmental Services Ltd. is a premier waste management, recycling, and environmental solutions provider headquartered in Port Harcourt, Rivers State, Nigeria.',
  keywords: [
    'Waste Management Port Harcourt',
    'Recycling Services Rivers State',
    'EcoBlue Environmental Services Ltd.',
    'Hydraulic Compactor Trucks Port Harcourt',
    'Environmental Sanitation Nigeria'
  ],
  authors: [{ name: 'EcoBlue Environmental Services Ltd.' }],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WasteManagementService",
              "name": "EcoBlue Environmental Services Ltd.",
              "description": "Professional, reliable, and sustainable waste management solutions across Port Harcourt and Rivers State.",
              "url": "https://ecoblueenvironmental.com",
              "logo": "https://ecoblueenvironmental.com/images/logo.png",
              "telephone": "+2348061193218",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Port Harcourt",
                "addressRegion": "Rivers State",
                "addressCountry": "Nigeria"
              },
              "areaServed": ["Port Harcourt", "Rivers State", "Nigeria"],
              "serviceType": [
                "Waste Collection & Disposal",
                "Recycling Services",
                "Environmental Sanitation & Consultancy",
                "Logistics & Skip Containers"
              ]
            })
          }}
        />
      </head>
      <body>
        <ToastProvider>
          <ModalProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
