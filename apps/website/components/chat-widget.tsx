'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PROACTIVE_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: '👋 Hey! Ich bin NeXify AI – dein KI-Agent. Soll ich dir ein unverbindliches Angebot für dein nächstes Webprojekt erstellen?',
  },
];

const QUICK_REPLIES = [
  '💡 Was kostet eine Website?',
  '🤖 Was macht NeXify AI?',
  '📋 Angebot anfordern',
  '🚀 Wie startet man?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(PROACTIVE_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Proactive pop-up after 4 seconds
    const timer = setTimeout(() => {
      setShowInitial(false);
      setOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulated AI response (placeholder until AgentMemory/9Router integration)
    setTimeout(() => {
      const ai: Message = {
        role: 'assistant',
        content:
          'Danke für deine Nachricht! 🎉 Ich leite das an unser Team weiter. In der Zwischenzeit: Eine moderne Business-Website mit KI-Integration startet bei uns ab **449 €/Tag**. Soll ich dir ein detailliertes Angebot per E-Mail schicken?',
      };
      setMessages((prev) => [...prev, ai]);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        data-testid="chat-widget-trigger"
        className={
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full ' +
          'bg-gradient-to-br from-lime-400 to-lime-500 text-black shadow-[0_0_25px_rgba(200,255,0,0.4)] ' +
          'hover:scale-110 transition-transform duration-300 ' +
          (showInitial ? 'animate-pulse' : '')
        }
        aria-label="Chat öffnen"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          data-testid="chat-widget-panel"
          className={
            'fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] ' +
            'rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-2xl ' +
            'shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ' +
            'animate-in slide-in-from-bottom-4 duration-300'
          }
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400/20">
              <Sparkles className="h-5 w-5 text-lime-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">NeXify AI Agent</p>
              <p className="text-xs text-lime-400">Online • antwortet sofort</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[400px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')
                }
              >
                <div
                  className={
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ' +
                    (msg.role === 'user'
                      ? 'bg-lime-400 text-black rounded-br-md'
                      : 'bg-white/5 text-zinc-200 border border-white/10 rounded-bl-md')
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => {
                    setInput(reply);
                  }}
                  data-testid={`chat-quick-reply-${reply.slice(0, 2)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:border-lime-400/50 hover:bg-lime-400/10 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-white/10 px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Schreib eine Nachricht..."
                data-testid="chat-widget-input"
                className="flex-1 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:ring-lime-400"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || loading}
                data-testid="chat-widget-send"
                className="rounded-xl bg-lime-400 text-black hover:bg-lime-300 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Backward compatibility: also export as named export for layout.tsx
export { ChatWidget };
