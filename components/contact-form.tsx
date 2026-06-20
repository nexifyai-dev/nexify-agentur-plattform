"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
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
    <form onSubmit={submit} className="contact-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span>Name *</span><Input required name="name" autoComplete="name" placeholder="Vor- und Nachname" /></label>
        <label><span>Unternehmen *</span><Input required name="company" autoComplete="organization" placeholder="Unternehmen" /></label>
        <label><span>E-Mail *</span><Input required type="email" name="email" autoComplete="email" placeholder="name@unternehmen.de" /></label>
        <label><span>Telefon</span><Input type="tel" name="phone" autoComplete="tel" placeholder="Optional" /></label>
      </div>
      <label><span>Projektart</span><select name="projectType" defaultValue="Website"><option>Landingpage</option><option>Unternehmenswebsite</option><option>Onlineshop</option><option>Web-App</option><option>Mobile App</option><option>Automatisierung</option><option>AI-Agent</option><option>Sonstiges</option></select></label>
      <label><span>Was soll entstehen? *</span><Textarea required name="message" placeholder="Ziel, gewünschte Funktionen, bestehende Systeme und gewünschter Starttermin …" /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="consent"><input required type="checkbox" name="privacy" value="accepted" /><span>Ich habe die <a href="/datenschutz">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der B2B-Anfrage zu.</span></label>
      <Button type="submit" size="lg" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />} Anfrage senden</Button>
      {message && <p role="status" className={status === "success" ? "form-success" : "form-error"}>{status === "success" && <CheckCircle2 className="size-4" />}{message}</p>}
    </form>
  );
}
