import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: "Design, Marketing & Production Services",
  description: "Graphic design, UI/UX, video production, photography, event management, and digital marketing services.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Design, Marketing & Production Services",
    description: "Graphic design, UI/UX, video production, photography, event management, and digital marketing services.",
    url: "https://www.illusorydesignstudios.com/services",
    type: "website",
  }
};

export default function Page() {
  return <ServicesClient />;
}
