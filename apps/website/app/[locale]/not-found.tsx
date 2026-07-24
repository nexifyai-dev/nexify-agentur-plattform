import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <p className="font-mono text-[80px] font-bold tracking-[-.08em] text-[var(--text-4)]">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-[var(--text-1)]">Seite nicht gefunden.</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-[var(--text-2)] font-light leading-relaxed">
          Der Link ist möglicherweise veraltet oder die URL enthält einen Tippfehler.
        </p>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/de"><ArrowLeft className="size-4" /> Zur Startseite</Link>
        </Button>
      </div>
    </main>
  );
}
