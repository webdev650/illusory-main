import type { Metadata } from "next";
import "./globals.css";
import { IntroProvider } from './contexts/IntroContext';
import IllusoryChat from './components/IllusoryChat';
import WhatsAppButton from './components/WhatsAppButton';
import Script from 'next/script';
import {
  Plus_Jakarta_Sans,
  Poppins,
  Merriweather,
  Young_Serif,
} from "next/font/google";
import localFont from 'next/font/local';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
});

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-young-serif",
});

const hostGrotesk = localFont({
  src: [
    {
      path: '../public/fonts/host-grotesk-1.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/host-grotesk-2.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/host-grotesk-3.woff2',
      style: 'italic',
    },
    {
      path: '../public/fonts/host-grotesk-4.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-host-grotesk',
  display: 'swap',
});

const rethinkSans = localFont({
  src: [
    {
      path: '../public/fonts/rethink-sans-1.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/rethink-sans-2.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/rethink-sans-3.woff2',
      style: 'italic',
    },
    {
      path: '../public/fonts/rethink-sans-4.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-rethink-sans',
  display: 'swap',
});

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Illusory Design Studios Pvt. Ltd.",
  "@id": "https://www.illusorydesignstudios.com",
  "url": "https://www.illusorydesignstudios.com",
  "telephone": "+917681842303",
  "email": "business@illusorydesignstudios.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bhubaneswar",
    "addressRegion": "Odisha",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://www.facebook.com/illusorydesignstudios",
    "https://www.instagram.com/illusory.designstudios",
    "https://www.behance.net/illusoryds"
  ],
  "description": "Premier creative agency specializing in bespoke design, digital marketing, branding, and tech solutions."
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.illusorydesignstudios.com"),
  title: {
    default: "Illusory Design Studios | Bespoke Design & Tech Solutions",
    template: "%s | Illusory Design Studios",
  },
  description: "Illusory Design Studios is a premier creative agency specializing in bespoke design, cutting-edge technology, and strategic digital marketing solutions. We craft immersive experiences that inspire imaginations.",
  keywords: ["design studio", "web development", "digital marketing", "branding", "UI/UX design", "tech solutions", "creative agency"],
  openGraph: {
    title: "Illusory Design Studios | Bespoke Design & Tech Solutions",
    description: "Expert design, technology, and digital marketing solutions tailored to your vision. Discover the magic of Illusory.",
    url: "https://www.illusorydesignstudios.com",
    siteName: "Illusory Design Studios",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Illusory Design Studios Logo"
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Illusory Design Studios | Bespoke Design & Tech Solutions",
    description: "Expert design, technology, and digital marketing solutions tailored to your vision.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${merriweather.variable} ${plusJakartaSans.variable} ${poppins.variable} ${rethinkSans.variable} ${youngSerif.variable}`}>
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="bg-black flex justify-center">
        <main className="w-full ">
          <IntroProvider>
            {children}
            <IllusoryChat />
            <WhatsAppButton />
          </IntroProvider>
        </main>
      </body>
    </html>
  );
}