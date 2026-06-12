import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: {
    absolute: "Illusory Design Studios | Bespoke Design & Tech Solutions"
  },
  description: "Premier creative agency in Bhubaneswar specializing in bespoke design, digital marketing, branding, and tech solutions.",
  openGraph: {
    title: "Illusory Design Studios | Bespoke Design & Tech Solutions",
    description: "Premier creative agency in Bhubaneswar specializing in bespoke design, digital marketing, branding, and tech solutions.",
    url: "https://www.illusorydesignstudios.com",
    type: "website",
  }
};

export default function Page() {
  return <HomeClient />;
}
