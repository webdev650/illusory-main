import type { Metadata } from "next";
import "./globals.css";
import { IntroProvider } from './contexts/IntroContext';
import IllusoryChat from './components/IllusoryChat';
import WhatsAppButton from './components/WhatsAppButton';

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
    <html lang="en">
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