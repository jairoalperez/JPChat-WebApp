'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Send, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Msg = { role: 'user' | 'assistant'; content: string; createdAt?: number };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (ms?: number) => {
    const d = ms ? new Date(ms) : new Date();
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const next = [...messages, { role: 'user', content: text, createdAt: Date.now() } as Msg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => 'Request failed');
        throw new Error(msg);
      }

      const data = await res.json();
      const reply = (data?.reply ?? '').toString();

      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content:
            "Oops, I couldn't reply right now. Please try again in a moment.",
          createdAt: Date.now(),
        },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--fg)] p-4">
      {/* Main Chat Card */}
      <div className="max-w-2xl w-full rounded-2xl border border-white/10 bg-[var(--card-bg)] shadow-xl p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">JPChat</h1>
          <p className="text-sm text-[var(--text-secondary)]">AI-powered conversations about movies</p>
        </div>

        {/* Messages */}
        <div className="h-[50vh] sm:h-[60vh] overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-[hsla(var(--primary),0.15)] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--primary))]" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Welcome to JPChat</h2>
              <p className="text-[var(--text-secondary)] text-sm">Start a conversation by typing a message below</p>
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 animate-fade-in ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Assistant avatar */}
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-7 h-7 rounded-full bg-[hsla(var(--primary),0.20)] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--primary))]" />
                  </div>
                </div>
              )}

              {/* Bubble */}
              <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
                <div
                  className={`px-4 py-3 rounded-2xl leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[hsla(var(--primary),0.10)] text-white border border-white/5'
                      : 'bg-[var(--message-bg)] text-[var(--text-primary)] border border-white/5'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-invert max-w-none text-sm prose-p:my-1 prose-pre:my-2 prose-code:before:content-[''] prose-code:after:content-['']">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <div
                  className={`text-xs text-[var(--text-muted)] mt-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </div>
              </div>

              {/* User avatar */}
              {message.role === 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-white/80" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="flex-shrink-0 mt-1">
                <div className="w-7 h-7 rounded-full bg-[hsla(var(--primary),0.20)] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                </div>
              </div>
              <div className="bg-[var(--message-bg)] border border-white/5 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 pt-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[var(--message-bg)] border border-white/10 rounded-full 
                         text-white placeholder-[var(--text-muted)] text-sm
                         focus:outline-none focus:ring-2 focus:ring-[hsla(var(--primary),0.50)] focus:border-[hsla(var(--primary),0.30)]
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 sm:px-6 py-3 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] active:bg-[hsl(var(--primary-active))]
                         text-white rounded-full font-medium text-sm
                         focus:outline-none focus:ring-2 focus:ring-[hsla(var(--primary),0.50)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2
                         hover:shadow-lg hover:shadow-[hsla(var(--primary),0.25)]"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
