import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Konto",
};

export default function KontoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
