'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/lang-context';

interface ChatMessage { text: string; align: 'flex-start' | 'flex-end'; bg: string; color: string; buttons?: { label: string; href: string }[]; }

const GREETINGS: Record<string, ChatMessage> = {
  de: { text: 'Hallo! Ich bin Pascal\'s KI-Berater. Wie kann ich Ihnen helfen?\n\nSoll ich Ihnen unsere Leistungen zeigen, eine Preisspanne einschätzen oder direkt einen Rückruf vereinbaren?', align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: 'Leistungen ansehen', href: '/leistungen' }, { label: 'Preise & Ablauf', href: '/preise' }, { label: 'Rückruf vereinbaren', href: '/rueckruf' }] },
  en: { text: "Hello! I'm Pascal's AI advisor. How can I help you today?\n\nWould you like to see our services, get a price estimate, or book a callback?", align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: 'View Services', href: '/leistungen' }, { label: 'Pricing', href: '/preise' }, { label: 'Book a Call', href: '/rueckruf' }] },
  nl: { text: 'Hallo! Ik ben Pascal\'s AI-adviseur. Hoe kan ik u helpen?\n\nWilt u onze diensten zien, een prijsindicatie krijgen of direct een afspraak maken?', align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: 'Diensten bekijken', href: '/leistungen' }, { label: 'Prijzen', href: '/preise' }, { label: 'Afspraak maken', href: '/rueckruf' }] },
};

const KEYFRAMES = `@keyframes nx-pulsering{0%{transform:scale(.85);opacity:1}100%{transform:scale(2.1);opacity:0}}@keyframes nx-bubblein{from{opacity:0;transform:translateY(12px) scale(.9)}to{opacity:1;transform:none}}@keyframes nx-typing{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}`;

const btnStyle: React.CSSProperties = { display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:999,border:'1px solid rgba(200,255,0,0.45)',background:'rgba(200,255,0,0.08)',color:'#C8FF00',fontSize:12.5,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'background .15s',textDecoration:'none' };

export default function ChatWidget({ chatAutoOpen = true }: { chatAutoOpen?: boolean }) {
  const { lang } = useLang();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETINGS[lang] || GREETINGS.de]);
  const [typing, setTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const s = document.createElement('style'); s.textContent = KEYFRAMES; document.head.appendChild(s); return () => { s.remove(); }; }, []);

  useEffect(() => {
    setMessages([GREETINGS[lang] || GREETINGS.de]);
  }, [lang]);

  useEffect(() => { if (chatAutoOpen !== false) { const t = setTimeout(() => setChatOpen(true), 4200); return () => clearTimeout(t); } }, [chatAutoOpen]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const sendChatMessage = async () => {
    const text = chatInput.trim(); if (!text) return;
    const userMsg: ChatMessage = { text, align: 'flex-end', bg: 'linear-gradient(120deg,#C8FF00,#eaffb0)', color: '#0A0A0A' };
    setMessages(s => [...s, userMsg]); setChatInput(''); setTyping(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, language: lang }) });
      const data = await res.json(); setTyping(false);
      setMessages(s => [...s, { text: data.reply, align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: data.buttons || undefined }]);
    } catch { setTyping(false); setMessages(s => [...s, { text: lang === 'en' ? 'One moment — connecting you with Pascal...' : lang === 'nl' ? 'Een moment — ik verbind u met Pascal...' : 'Einen Moment — ich verbinde Sie mit Pascal...', align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5', buttons: [{ label: lang === 'en' ? 'Book a Call' : lang === 'nl' ? 'Afspraak maken' : 'Rückruf buchen', href: '/rueckruf' }] }]); }
  };

  const handleBtn = (href: string) => { href.startsWith('http') ? window.open(href, '_blank', 'noopener') : (window.location.href = href); };

  return (<>
    <div onClick={() => setChatOpen(s => !s)} data-testid="chat-launcher" role="button" aria-label="Chat öffnen" style={{ position:'fixed',right:24,bottom:24,zIndex:60,width:60,height:60,borderRadius:999,border:'1px solid rgba(200,255,0,0.3)',background:'linear-gradient(135deg,#1c1c20,#101013)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 8px 40px rgba(0,0,0,0.6), 0 0 24px rgba(200,255,0,0.12)' }}>
      <span style={{position:'absolute',inset:-5,borderRadius:999,border:'1px solid rgba(200,255,0,0.35)',animation:'nx-pulsering 2.6s cubic-bezier(0.22,1,0.36,1) infinite'}}/>
      <span style={{width:9,height:9,borderRadius:999,background:'#C8FF00',boxShadow:'0 0 10px rgba(200,255,0,0.8)'}}/>
    </div>
    {chatOpen && (<div data-testid="chat-panel" style={{position:'fixed',right:24,bottom:96,zIndex:60,width:'min(400px,calc(100vw - 32px))',height:'min(560px,calc(100vh - 140px))',display:'flex',flexDirection:'column',borderRadius:22,border:'1px solid rgba(200,255,0,0.15)',background:'rgba(14,14,17,0.96)',backdropFilter:'blur(28px)',boxShadow:'0 32px 80px rgba(0,0,0,0.7)',overflow:'hidden',animation:'nx-bubblein .3s cubic-bezier(0.22,1,0.36,1)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:8,height:8,borderRadius:999,background:'#C8FF00',boxShadow:'0 0 8px rgba(200,255,0,0.8)'}}/>
          <div><span style={{fontSize:13,fontWeight:700}}>{lang === 'en' ? "Pascal's AI Advisor" : lang === 'nl' ? "Pascal's AI-Adviseur" : "Pascal's KI-Berater"}</span><span style={{display:'block',fontSize:10,color:'#71717a',marginTop:1}}>{lang === 'en' ? 'Real-time answers to your questions' : lang === 'nl' ? 'Antwoorden op uw vragen in realtime' : 'Beantwortet Ihre Fragen in Echtzeit'}</span></div>
        </div>
        <span onClick={() => setChatOpen(false)} style={{cursor:'pointer',color:'#71717a',fontSize:20,lineHeight:1,padding:'0 4px'}}>×</span>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'16px 18px',display:'flex',flexDirection:'column',gap:12}}>
        {messages.map((msg,i) => (<div key={i} style={{alignSelf:msg.align,maxWidth:'90%'}}><div style={{padding:'12px 16px',borderRadius:msg.align==='flex-end'?'16px 16px 4px 16px':'16px 16px 16px 4px',fontSize:13.5,lineHeight:1.6,background:msg.bg,color:msg.color,whiteSpace:'pre-wrap'}}>{msg.text}</div>{msg.buttons && msg.buttons.length > 0 && (<div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:10}}>{msg.buttons.map((btn,j)=>(<a key={j} href={btn.href} onClick={e=>{e.preventDefault();handleBtn(btn.href)}} style={btnStyle}>{btn.label} →</a>))}</div>)}</div>))}
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
