import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Registrieren",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
