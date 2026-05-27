import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Package Estimator",
  description: "Get dynamic estimates and deliverables for social media marketing, content creation, and digital branding packages tailored to your state, district, and industry.",
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
