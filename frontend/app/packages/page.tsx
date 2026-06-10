import { Metadata } from 'next';
import PackagesClient from './PackagesClient';

export const metadata: Metadata = {
  title: "Pricing & Packages | Illusory Design Studios",
  description: "View our flexible design and marketing packages tailored for startups and enterprises.",
  openGraph: {
    title: "Pricing & Packages | Illusory Design Studios",
    description: "View our flexible design and marketing packages tailored for startups and enterprises.",
    url: "https://www.illusorydesignstudios.com/packages",
    type: "website",
  }
};

export default function Page() {
  return <PackagesClient />;
}
