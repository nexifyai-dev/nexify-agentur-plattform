"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "de";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message ?? "Versand fehlgeschlagen");
      form.reset();
      setStatus("success");
      setMessage(data.message ?? "Ihre Anfrage wurde versendet.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Die Anfrage konnte nicht versendet werden.");
    }
  }

  return (
    <form onSubmit={submit} className="contact-form" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="contact-name"><span>Name *</span><Input required id="contact-name" name="name" autoComplete="name" placeholder="Vor- und Nachname" aria-required="true" /></label>
        <label htmlFor="contact-company"><span>Unternehmen *</span><Input required id="contact-company" name="company" autoComplete="organization" placeholder="Unternehmen" aria-required="true" /></label>
        <label htmlFor="contact-email"><span>E-Mail *</span><Input required id="contact-email" type="email" name="email" autoComplete="email" placeholder="name@unternehmen.de" aria-required="true" /></label>
        <label htmlFor="contact-phone"><span>Telefon</span><Input id="contact-phone" type="tel" name="phone" autoComplete="tel" placeholder="Optional" /></label>
      </div>
      <label htmlFor="contact-type"><span>Projektart</span>
        <select id="contact-type" name="projectType" defaultValue="Website" aria-label="Projektart auswählen">
          <option>Landingpage</option>
          <option>Unternehmenswebsite</option>
          <option>Onlineshop</option>
          <option>Web-App</option>
          <option>Mobile App</option>
          <option>Automatisierung</option>
          <option>AI-Agent</option>
          <option>Sonstiges</option>
        </select>
      </label>
      <label htmlFor="contact-message"><span>Was soll entstehen? *</span>
        <Textarea required id="contact-message" name="message" placeholder="Ziel, gewünschte Funktionen, bestehende Systeme und gewünschter Starttermin …" aria-required="true" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="consent" htmlFor="contact-privacy">
        <input required id="contact-privacy" type="checkbox" name="privacy" value="accepted" aria-required="true" />
        <span>Ich habe die <Link href={`/${locale}/datenschutz`} className="underline underline-offset-3">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der B2B-Anfrage zu.</span>
      </label>
      <Button type="submit" size="lg" disabled={status === "loading"} aria-busy={status === "loading"}>
        {status === "loading" ? <><LoaderCircle className="size-4 animate-spin" /> Wird gesendet …</> : <><Send className="size-4" /> Anfrage senden</>}
      </Button>
      {message && (
        <p role="status" aria-live="polite" className={status === "success" ? "form-success" : "form-error"}>
          {status === "success" && <CheckCircle2 className="size-4" />}{message}
        </p>
      )}
    </form>
  );
}
