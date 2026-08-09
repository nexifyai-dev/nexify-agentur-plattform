import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Konto | NeXify AI",
};

export default function KontoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
