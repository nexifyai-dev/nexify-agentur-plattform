import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="grid min-h-[65vh] place-items-center px-5 text-center"><div><p className="kicker">404</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">Diese Seite wurde nicht gefunden.</h1><p className="mx-auto mt-5 max-w-lg text-white/50">Der Link ist möglicherweise veraltet oder die Seite wurde neu strukturiert.</p><Button asChild className="mt-8"><Link href="/">Zur Startseite</Link></Button></div></main>; }
