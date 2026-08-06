'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/lang-context';

interface PlanModule { name: string; description: string; days_min: number; days_max: number; }
interface PlanData {
  title: string; summary: string;
  modules: PlanModule[]; structure: string[];
  phases: { name: string; text: string }[]; recommendation: string;
}
interface PlanResult { session_id: string; plan: PlanData; days_min: number; days_max: number; price_min: number; price_max: number; }
interface ChatMessage {
  text: string; align: 'flex-start' | 'flex-end'; bg: string; color: string;
  buttons?: { label: string; href: string }[];
  plan?: PlanResult;
}

const GREETINGS: Record<string, ChatMessage> = {
  de: { text: 'Hallo! Ich bin NeXify AI, die Unternehmens-KI von NeXify. Chat it. Automate it.\n\nSoll ich Ihnen unsere Leistungen zeigen, eine Preisspanne einschätzen oder direkt einen Rückruf vereinbaren?', align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: 'Leistungen ansehen', href: '/leistungen' }, { label: 'Preise & Ablauf', href: '/preise' }, { label: 'Rückruf vereinbaren', href: '/rueckruf' }] },
  en: { text: "Hello! I'm NeXify AI, the corporate AI of NeXify. Chat it. Automate it.\n\nWould you like to see our services, get a price estimate, or book a callback?", align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: 'View Services', href: '/leistungen' }, { label: 'Pricing', href: '/preise' }, { label: 'Book a Call', href: '/rueckruf' }] },
  nl: { text: 'Hallo! Ik ben NeXify AI, de bedrijfs-AI van NeXify. Chat it. Automate it.\n\nWilt u onze diensten zien, een prijsindicatie krijgen of direct een afspraak maken?', align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: 'Diensten bekijken', href: '/leistungen' }, { label: 'Prijzen', href: '/preise' }, { label: 'Afspraak maken', href: '/rueckruf' }] },
};

const KEYFRAMES = `@keyframes nx-pulsering{0%{transform:scale(.85);opacity:1}100%{transform:scale(2.1);opacity:0}}@keyframes nx-bubblein{from{opacity:0;transform:translateY(12px) scale(.9)}to{opacity:1;transform:none}}@keyframes nx-typing{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}`;

const btnStyle: React.CSSProperties = { display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:999,border:'1px solid rgba(200,255,0,0.45)',background:'rgba(200,255,0,0.08)',color:'#C8FF00',fontSize:12.5,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'background .15s',textDecoration:'none' };

const eur = (n: number) => `€ ${n.toLocaleString('de-DE')}`;

const T = {
  de: { offerTitle: 'Angebot per E-Mail anfordern', offerText: 'Wir senden Ihnen den Plan als individuelles Angebot – geprüft von Pascal Courbois.', name: 'Ihr Name *', email: 'Ihre E-Mail *', company: 'Firma (optional)', phone: 'Telefon (optional)', send: 'Angebot anfordern', sending: 'Wird gesendet …', sent: 'Ihr Angebot ist unterwegs! Prüfen Sie Ihr Postfach.', total: 'Richtpreis netto', modules: 'Module', range: 'Spannweite', askName: 'Wie ist Ihr Name?', askEmail: 'Ihre E-Mail-Adresse?', back: '← Zurück' },
  en: { offerTitle: 'Request Offer via Email', offerText: 'We will send you the plan as an individual offer – reviewed by Pascal Courbois.', name: 'Your name *', email: 'Your email *', company: 'Company (optional)', phone: 'Phone (optional)', send: 'Request offer', sending: 'Sending …', sent: 'Your offer is on its way! Check your inbox.', total: 'Guide price net', modules: 'Modules', range: 'Range', askName: 'What is your name?', askEmail: 'Your email address?', back: '← Back' },
  nl: { offerTitle: 'Offerte per e-mail aanvragen', offerText: 'Wij sturen u het plan als offerte – gecontroleerd door Pascal Courbois.', name: 'Uw naam *', email: 'Uw e-mail *', company: 'Bedrijf (optioneel)', phone: 'Telefoon (optioneel)', send: 'Offerte aanvragen', sending: 'Verzenden …', sent: 'Uw offerte is onderweg! Controleer uw inbox.', total: 'Richtprijs netto', modules: 'Modules', range: 'Bereik', askName: 'Wat is uw naam?', askEmail: 'Uw e-mailadres?', back: '← Terug' },
};

export default function ChatWidget({ chatAutoOpen = true }: { chatAutoOpen?: boolean }) {
  const { lang } = useLang();
  const t = T[lang] || T.de;
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETINGS[lang] || GREETINGS.de]);
  const [typing, setTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Offer-Request-Dialog
  const [offerSession, setOfferSession] = useState<string | null>(null);
  const [offerStep, setOfferStep] = useState<'idle' | 'name' | 'email' | 'company' | 'phone' | 'sending' | 'sent' | 'error'>('idle');
  const [offerForm, setOfferForm] = useState({ name: '', email: '', company: '', phone: '' });

  useEffect(() => { const s = document.createElement('style'); s.textContent = KEYFRAMES; document.head.appendChild(s); return () => { s.remove(); }; }, []);
  useEffect(() => { setMessages([GREETINGS[lang] || GREETINGS.de]); }, [lang]);
  useEffect(() => { if (chatAutoOpen !== false) { const t = setTimeout(() => setChatOpen(true), 4200); return () => clearTimeout(t); } }, [chatAutoOpen]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing, offerStep]);

  const sendChatMessage = async () => {
    const text = chatInput.trim(); if (!text) return;
    const userMsg: ChatMessage = { text, align: 'flex-end', bg: 'linear-gradient(120deg,#C8FF00,#eaffb0)', color: '#0A0A0A' };
    setMessages(s => [...s, userMsg]); setChatInput(''); setTyping(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, language: lang }) });
      const data = await res.json(); setTyping(false);
      const msg: ChatMessage = { text: data.reply || '', align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: data.buttons || undefined };
      if (data.type === 'plan' && data.plan) {
        msg.plan = data.plan;
      }
      setMessages(s => [...s, msg]);
    } catch { setTyping(false); setMessages(s => [...s, { text: lang === 'en' ? 'One moment — connecting you with NeXify AI...' : lang === 'nl' ? 'Een moment — ik verbind u met NeXify AI...' : 'Einen Moment — ich verbinde Sie mit NeXify AI...', align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: lang === 'en' ? 'Book a Call' : lang === 'nl' ? 'Afspraak maken' : 'Rückruf buchen', href: '/rueckruf' }] }]); }
  };

  const handleBtn = (href: string) => {
    if (href.startsWith('/angebot?session=')) {
      const sid = new URL(href, window.location.origin).searchParams.get('session');
      if (sid) { setOfferSession(sid); setOfferStep('name'); }
      return;
    }
    href.startsWith('http') ? window.open(href, '_blank', 'noopener') : (window.location.href = href);
  };

  const requestOffer = async () => {
    if (!offerSession || !offerForm.name || !offerForm.email || offerStep === 'sending') return;
    setOfferStep('sending');
    try {
      const res = await fetch('/api/offers/request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: offerSession, name: offerForm.name, email: offerForm.email, company: offerForm.company || null, phone: offerForm.phone || null, language: lang }),
      });
      if (!res.ok) throw new Error('failed');
      setOfferStep('sent');
    } catch { setOfferStep('error'); }
  };

  const planCard = (plan: PlanResult, idx: number) => (
    <div key={`plan-${idx}`} style={{ marginTop: 10, borderRadius: 14, border: '1px solid rgba(200,255,0,0.15)', background: 'rgba(200,255,0,0.04)', padding: '14px 16px', fontSize: 12.5, color: '#d4d4d4' }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>{plan.plan.title}</div>
      <div style={{ lineHeight: 1.5, marginBottom: 10, color: '#a1a1aa' }}>{plan.plan.summary}</div>
      <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C8FF00', marginBottom: 6 }}>{t.modules}</div>
      {plan.plan.modules.slice(0, 6).map((m, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < plan.plan.modules.slice(0,6).length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#e5e5e5' }}>{m.name}</div>
            <div style={{ fontSize: 11, color: '#71717a', marginTop: 1 }}>{m.description.slice(0, 80)}{m.description.length > 80 ? '…' : ''}</div>
          </div>
          <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#a1a1aa', fontSize: 11 }}>{m.days_min === m.days_max ? m.days_min : `${m.days_min}–${m.days_max}`} {lang === 'nl' ? 'dagen' : 'Tage'}</div>
            <div style={{ color: '#C8FF00', fontWeight: 700, fontSize: 12.5 }}>{eur(m.days_min * 449)}{m.days_min !== m.days_max ? ` – ${eur(m.days_max * 449)}` : ''}</div>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(200,255,0,0.2)', fontWeight: 700, color: '#fff' }}>
        <span>{t.total}</span>
        <span style={{ color: '#C8FF00', fontSize: 15 }}>{eur(plan.price_min)} – {eur(plan.price_max)}</span>
      </div>
      <button
        onClick={() => { setOfferSession(plan.session_id); setOfferStep('name'); setOfferForm({ name: '', email: '', company: '', phone: '' }); }}
        style={{ ...btnStyle, marginTop: 12, width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg,#C8FF00,#9ecf00)', color: '#0A0A0A', border: 'none', padding: '12px' }}
      >
        ✉ {t.offerTitle}
      </button>
    </div>
  );

  const offerDialog = () => {
    if (offerStep === 'idle') return null;
    const fields: React.ReactNode[] = [];

    if (offerStep === 'sent') {
      return (
        <div style={{ marginTop: 10, borderRadius: 14, border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)', padding: '14px 18px', fontSize: 13, color: '#6ee7b7', lineHeight: 1.6 }}>
          ✅ {t.sent}
          <button onClick={() => setOfferStep('idle')} style={{ ...btnStyle, marginTop: 10 }}>{t.back}</button>
        </div>
      );
    }

    if (offerStep === 'name' || offerStep === 'email' || offerStep === 'company' || offerStep === 'phone' || offerStep === 'sending' || offerStep === 'error') {
      return (
        <div style={{ marginTop: 10, borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', padding: '14px 18px' }}>
          <div style={{ fontWeight: 600, color: '#fff', fontSize: 13, marginBottom: 2 }}>{t.offerTitle}</div>
          <div style={{ fontSize: 11.5, color: '#71717a', marginBottom: 10 }}>{t.offerText}</div>
          {offerStep === 'name' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input autoFocus type="text" placeholder={t.askName} value={offerForm.name} onChange={e => setOfferForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter' && offerForm.name.trim()) setOfferStep('email'); }}
                style={{ flex: 1, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 14px', fontSize: 13, outline: 'none' }} />
              <button onClick={() => offerForm.name.trim() && setOfferStep('email')} style={{ ...btnStyle, background: '#C8FF00', color: '#0A0A0A', border: 'none' }}>→</button>
            </div>
          )}
          {offerStep === 'email' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input autoFocus type="email" placeholder={t.askEmail} value={offerForm.email} onChange={e => setOfferForm(f => ({ ...f, email: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter' && offerForm.email.trim()) setOfferStep('company'); }}
                style={{ flex: 1, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 14px', fontSize: 13, outline: 'none' }} />
              <button onClick={() => offerForm.email.trim() && setOfferStep('company')} style={{ ...btnStyle, background: '#C8FF00', color: '#0A0A0A', border: 'none' }}>→</button>
            </div>
          )}
          {offerStep === 'company' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder={t.company} value={offerForm.company} onChange={e => setOfferForm(f => ({ ...f, company: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') setOfferStep('phone'); }}
                style={{ flex: 1, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 14px', fontSize: 13, outline: 'none' }} />
              <button onClick={() => setOfferStep('phone')} style={{ ...btnStyle, background: '#C8FF00', color: '#0A0A0A', border: 'none' }}>→</button>
            </div>
          )}
          {offerStep === 'phone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="tel" placeholder={t.phone} value={offerForm.phone} onChange={e => setOfferForm(f => ({ ...f, phone: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') requestOffer(); }}
                style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 14px', fontSize: 13, outline: 'none' }} />
              <button onClick={requestOffer} disabled={offerStep === 'sending'} style={{ ...btnStyle, background: 'linear-gradient(135deg,#C8FF00,#9ecf00)', color: '#0A0A0A', border: 'none', justifyContent: 'center', padding: '12px' }}>
                {offerStep === 'sending' ? '…' : `✉ ${t.send}`}
              </button>
            </div>
          )}
          {offerStep === 'error' && <div style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>Fehler. Bitte versuchen Sie es erneut.</div>}
          <button onClick={() => setOfferStep('idle')} style={{ background: 'none', border: 'none', color: '#71717a', fontSize: 11, marginTop: 8, cursor: 'pointer' }}>{t.back}</button>
        </div>
      );
    }
    return null;
  };

  return (<>
    <div onClick={() => setChatOpen(s => !s)} data-testid="chat-launcher" role="button" aria-label="Chat öffnen" style={{ position:'fixed',right:24,bottom:24,zIndex:60,width:60,height:60,borderRadius:999,border:'1px solid rgba(200,255,0,0.3)',background:'linear-gradient(135deg,#1c1c20,#101013)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 8px 40px rgba(0,0,0,0.6), 0 0 24px rgba(200,255,0,0.12)' }}>
      <span style={{position:'absolute',inset:-5,borderRadius:999,border:'1px solid rgba(200,255,0,0.35)',animation:'nx-pulsering 2.6s cubic-bezier(0.22,1,0.36,1) infinite'}}/>
      <span style={{width:9,height:9,borderRadius:999,background:'#C8FF00',boxShadow:'0 0 10px rgba(200,255,0,0.8)'}}/>
    </div>
    {chatOpen && (<div data-testid="chat-panel" style={{position:'fixed',right:24,bottom:96,zIndex:60,width:'min(420px,calc(100vw - 32px))',height:'min(620px,calc(100vh - 140px))',display:'flex',flexDirection:'column',borderRadius:22,border:'1px solid rgba(200,255,0,0.15)',background:'rgba(14,14,17,0.96)',backdropFilter:'blur(28px)',boxShadow:'0 32px 80px rgba(0,0,0,0.7)',overflow:'hidden',animation:'nx-bubblein .3s cubic-bezier(0.22,1,0.36,1)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:8,height:8,borderRadius:999,background:'#C8FF00',boxShadow:'0 0 8px rgba(200,255,0,0.8)'}}/>
          <div><span style={{fontSize:13,fontWeight:700}}>NeXify AI</span><span style={{display:'block',fontSize:10,color:'#71717a',marginTop:1}}>{lang === 'en' ? 'Real-time answers' : lang === 'nl' ? 'Antwoorden in realtime' : 'Beantwortet in Echtzeit'}</span></div>
        </div>
        <span onClick={() => setChatOpen(false)} style={{cursor:'pointer',color:'#71717a',fontSize:20,lineHeight:1,padding:'0 4px'}}>×</span>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'16px 18px',display:'flex',flexDirection:'column',gap:12}}>
        {messages.map((msg,i) => (
          <div key={i} style={{alignSelf:msg.align,maxWidth:'92%'}}>
            <div style={{padding:'12px 16px',borderRadius:msg.align==='flex-end'?'16px 16px 4px 16px':'16px 16px 16px 4px',fontSize:13.5,lineHeight:1.6,background:msg.bg,color:msg.color,whiteSpace:'pre-wrap'}}>{msg.text}</div>
            {msg.plan && planCard(msg.plan, i)}
            {msg.buttons && msg.buttons.length > 0 && (
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:10}}>
                {msg.buttons.map((btn,j)=>(<a key={j} href={btn.href} onClick={e=>{e.preventDefault();handleBtn(btn.href)}} style={btnStyle}>{btn.label} →</a>))}
              </div>
            )}
          </div>
        ))}
        {offerStep !== 'idle' && offerDialog()}
        {typing && (<div style={{alignSelf:'flex-start',display:'flex',gap:5,padding:'12px 16px'}}><span style={{width:6,height:6,borderRadius:999,background:'#C8FF00',animation:'nx-typing 1.2s infinite'}}/><span style={{width:6,height:6,borderRadius:999,background:'#C8FF00',animation:'nx-typing 1.2s infinite .15s'}}/><span style={{width:6,height:6,borderRadius:999,background:'#C8FF00',animation:'nx-typing 1.2s infinite .3s'}}/></div>)}
        <div ref={messagesEndRef}/>
      </div>
      <div style={{display:'flex',gap:8,padding:'14px 18px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
        <input type="text" placeholder={lang === 'en' ? 'Type your question...' : lang === 'nl' ? 'Stel uw vraag...' : 'Schreiben Sie Ihre Frage...'} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')sendChatMessage()}} data-testid="chat-input" style={{flex:1,border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,background:'rgba(255,255,255,0.04)',color:'#fff',padding:'12px 16px',fontSize:13.5,outline:'none'}}/>
        <button onClick={sendChatMessage} data-testid="chat-send" aria-label="Nachricht senden" style={{display:'flex',alignItems:'center',justifyContent:'center',minWidth:44,height:44,borderRadius:14,border:'none',background:'linear-gradient(135deg,#C8FF00,#9ecf00)',color:'#0A0A0A',fontWeight:700,fontSize:16,cursor:'pointer',flex:'none',padding:'0 16px'}}>{lang === 'en' ? 'Send →' : lang === 'nl' ? 'Stuur →' : 'Senden →'}</button>
      </div>
    </div>)}
  </>);
}

export { ChatWidget };
