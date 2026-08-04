'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/lang-context';

/**
 * Proaktiver KI-Chat exakt nach Anhang "NeXify Homepage.dc.html" (PR47 Luxury Dark).
 * VERBOTEN laut design_guidelines.json: lucide-icons, Emojis, Quick-Replies, "Online"-Statuszeile, Sparkles.
 * Backend: POST /api/chat (SSE: delta / offer_ready / done) — Fallback: lokale Anhang-Antwort.
 */

interface ChatMessage {
  text: string;
  align: 'flex-start' | 'flex-end';
  bg: string;
  color: string;
}

const GREETINGS = {
  de: 'Hallo! Ich sehe, Sie schauen sich unsere Leistungen an, soll ich Ihnen direkt eine erste Einschätzung für Ihr Projekt erstellen?',
  en: 'Hello! I see you are looking at our services — shall I give you a first assessment for your project right away?',
  nl: 'Hallo! Ik zie dat u naar onze diensten kijkt — zal ik direct een eerste inschatting voor uw project maken?',
} as const;

const FALLBACK_REPLIES = {
  de: 'Danke! Ein Berater meldet sich innerhalb eines Werktags mit einer konkreten Einschätzung und einem Terminvorschlag.',
  en: 'Thank you! An advisor will get back to you within one business day with a concrete assessment and a meeting proposal.',
  nl: 'Dank u! Een adviseur neemt binnen één werkdag contact op met een concrete inschatting en een voorstel voor een afspraak.',
} as const;

const KEYFRAMES = `
  @keyframes nx-pulsering { 0% { transform: scale(0.85); opacity: 1; } 100% { transform: scale(2.1); opacity: 0; } }
  @keyframes nx-bubblein { from { opacity: 0; transform: translateY(12px) scale(0.9); } to { opacity: 1; transform: none; } }
  @keyframes nx-typing { 0%, 60%, 100% { opacity: 0.25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
`;

export default function ChatWidget({ chatAutoOpen = true }: { chatAutoOpen?: boolean }) {
  const { lang } = useLang();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Begrüßung je Sprache (initial einmal, danach bleibt die Konversation bestehen)
  useEffect(() => {
    setMessages([
      {
        text: GREETINGS[lang],
        align: 'flex-start',
        bg: 'rgba(255,255,255,0.06)',
        color: '#e5e5e5',
      },
    ]);
  }, [lang]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (chatAutoOpen !== false) {
      const timer = setTimeout(() => setChatOpen(true), 4200);
      return () => clearTimeout(timer);
    }
  }, [chatAutoOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || typing) return;
    const userMsg: ChatMessage = {
      text,
      align: 'flex-end',
      bg: 'linear-gradient(120deg,#C8FF00,#eaffb0)',
      color: '#0A0A0A',
    };
    setMessages((s) => [...s, userMsg]);
    setChatInput('');
    setTyping(true);

    try {
      // Backend /api/chat (SSE) — wie im Bestand; language aus i18n
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language: lang }),
      });
      if (!res.ok || !res.body) throw new Error('chat failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.type === 'delta') botText += payload.content;
          if (payload.type === 'done') break;
        }
      }
      setTyping(false);
      setMessages((s) => [
        ...s,
        { text: botText || FALLBACK_REPLIES[lang], align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5' },
      ]);
    } catch {
      setTyping(false);
      setMessages((s) => [
        ...s,
        { text: FALLBACK_REPLIES[lang], align: 'flex-start', bg: 'rgba(255,255,255,0.06)', color: '#e5e5e5' },
      ]);
    }
  };

  return (
    <>
      {/* Launcher: exakt Anhang — 60px rund, Lime-Punkt + Puls-Ring, KEIN Icon */}
      <div
        onClick={() => setChatOpen((s) => !s)}
        data-testid="chat-launcher"
        role="button"
        aria-label="Chat öffnen"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 60,
          width: 60,
          height: 60,
          borderRadius: 999,
          border: '1px solid rgba(200,255,0,0.3)',
          background: 'linear-gradient(135deg,#1c1c20,#101013)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 24px rgba(200,255,0,0.12)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: -5,
            borderRadius: 999,
            border: '1px solid rgba(200,255,0,0.35)',
            animation: 'nx-pulsering 2.6s cubic-bezier(0.22,1,0.36,1) infinite',
          }}
        />
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            background: '#C8FF00',
            boxShadow: '0 0 10px rgba(200,255,0,0.8)',
          }}
        />
      </div>

      {/* Panel: exakt Anhang */}
      {chatOpen && (
        <div
          data-testid="chat-panel"
          style={{
            position: 'fixed',
            right: 24,
            bottom: 96,
            zIndex: 60,
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(520px, calc(100vh - 140px))',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 22,
            border: '1px solid rgba(200,255,0,0.15)',
            background: 'rgba(14,14,17,0.94)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            animation: 'nx-bubblein 0.3s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Header: 8px Punkt + "NeXify KI Berater", Close × */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: '#C8FF00',
                  boxShadow: '0 0 8px rgba(200,255,0,0.8)',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700 }}>NeXify KI Berater</span>
            </div>
            <span
              onClick={() => setChatOpen(false)}
              style={{ cursor: 'pointer', color: '#71717a', fontSize: 18, lineHeight: 1 }}
            >
              ×
            </span>
          </div>

          {/* Nachrichten */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.align,
                  maxWidth: '82%',
                  padding: '12px 15px',
                  borderRadius: 14,
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  background: msg.bg,
                  color: msg.color,
                }}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '12px 15px' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: '#a1a1aa', animation: 'nx-typing 1.2s infinite' }} />
                <span style={{ width: 6, height: 6, borderRadius: 999, background: '#a1a1aa', animation: 'nx-typing 1.2s infinite 0.15s' }} />
                <span style={{ width: 6, height: 6, borderRadius: 999, background: '#a1a1aa', animation: 'nx-typing 1.2s infinite 0.3s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input + Send "→" */}
          <div style={{ display: 'flex', gap: 10, padding: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              type="text"
              placeholder="Ihre Nachricht..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendChatMessage();
              }}
              data-testid="chat-input"
              style={{
                flex: 1,
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                color: '#fff',
                padding: '11px 14px',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <span
              onClick={sendChatMessage}
              data-testid="chat-send"
              role="button"
              aria-label="Nachricht senden"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: 12,
                background: '#C8FF00',
                color: '#0A0A0A',
                fontWeight: 700,
                cursor: 'pointer',
                flex: 'none',
              }}
            >
              →
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// Backward compatibility: named export für layout.tsx
export { ChatWidget };
