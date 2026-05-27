import type { Metadata } from "next";
import EmployeeLayoutWrapper from "./EmployeeLayoutWrapper";

export const metadata: Metadata = {
  title: "Employee CRM Dashboard",
  description: "Restricted dashboard for Illusory Design Studios employees to manage customer leads, check analytics, and log contracts.",
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployeeLayoutWrapper>{children}</EmployeeLayoutWrapper>;
}
