import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Authentication",
  description: "Secure login portal for Illusory Design Studios employees.",
};

export default function EmployeeLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
