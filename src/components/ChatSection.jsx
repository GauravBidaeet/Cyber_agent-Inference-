import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiTrash, HiCpuChip, HiAdjustmentsHorizontal } from 'react-icons/hi2';
import useChat from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatSection() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [maxNewTokens, setMaxNewTokens] = useState(100);
  const [temperature, setTemperature] = useState(0.1);
  const [topK, setTopK] = useState(50);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* ── Auto-scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* ── Auto-resize textarea ── */
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const maxRows = 5;
    const lineHeight = 24;
    const maxHeight = lineHeight * maxRows;
    ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  /* ── Send handler ── */
  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage(input, {
      max_new_tokens: Number(maxNewTokens),
      temperature: Number(temperature),
      top_k: Number(topK),
    });
    setInput('');
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    }, 0);
  }, [input, isLoading, sendMessage, maxNewTokens, temperature, topK]);

  /* ── Keyboard: Enter to send, Shift+Enter for newline ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <section id="chat-section" className="py-24 max-w-4xl mx-auto px-4">

      {/* ── Chat Container ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="glass rounded-3xl min-h-[600px] flex flex-col overflow-hidden"
      >
        {/* ── Messages Area ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !isLoading ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full min-h-[450px] text-center select-none">
              <div className="w-20 h-20 rounded-full bg-cyber-green/5 border border-cyber-green/20 flex items-center justify-center mb-6">
                <HiCpuChip className="w-10 h-10 text-cyber-green/40" />
              </div>
              <p className="text-cyber-text-secondary text-lg font-medium">
                Ask CyberLM anything about cybersecurity...
              </p>
              <p className="text-cyber-text-secondary/60 text-sm mt-2 max-w-sm">
                Malware analysis, CVE research, threat hunting, incident
                response, and more.
              </p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Area ── */}
        <div className="border-t border-cyber-border p-4 glass-strong">
          {/* Controls: Clear Chat */}
          <div className="flex justify-end items-center mb-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 text-xs text-cyber-text-secondary
                           hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded-md
                           hover:bg-red-400/10"
              >
                <HiTrash className="w-3.5 h-3.5" />
                Clear Chat
              </button>
            )}
          </div>

          <div className="mb-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-cyber-surface border border-cyber-border/50">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-cyber-text-secondary flex justify-between">
                      <span>Max Tokens</span>
                      <span className="text-cyber-green font-mono">{maxNewTokens}</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="2000"
                      step="10"
                      value={maxNewTokens}
                      onChange={(e) => setMaxNewTokens(e.target.value)}
                      className="accent-cyber-green cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-cyber-text-secondary flex justify-between">
                      <span>Temperature</span>
                      <span className="text-cyber-green font-mono">{temperature}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="accent-cyber-green cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-cyber-text-secondary flex justify-between">
                      <span>Top K</span>
                      <span className="text-cyber-green font-mono">{topK}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={topK}
                      onChange={(e) => setTopK(e.target.value)}
                      className="accent-cyber-green cursor-pointer"
                    />
              </div>
            </div>
          </div>

          {/* Input row */}
          <div className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about malware analysis, CVEs, threat hunting..."
              rows={1}
              className="w-full resize-none bg-cyber-surface text-cyber-text placeholder:text-cyber-text-secondary/50
                         rounded-2xl border border-cyber-border px-4 py-3 pr-14 text-[0.935rem]
                         leading-6 outline-none transition-all duration-200
                         focus:border-cyber-green focus:shadow-[0_0_15px_rgba(0,255,136,0.12)]
                         font-display"
            />

            {/* Send button */}
            <motion.button
              onClick={handleSend}
              disabled={!canSend}
              whileTap={canSend ? { scale: 0.88 } : {}}
              className={`absolute right-2 bottom-2 w-10 h-10 rounded-full flex items-center
                          justify-center transition-all duration-200 ${
                            canSend
                              ? 'bg-cyber-green text-cyber-bg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] cursor-pointer'
                              : 'bg-cyber-border text-cyber-text-secondary/40 cursor-not-allowed'
                          }`}
              aria-label="Send message"
            >
              <HiPaperAirplane className="w-4.5 h-4.5" />
            </motion.button>
          </div>

          <p className="text-[11px] text-cyber-text-secondary/40 mt-2 text-center select-none">
            Press <kbd className="px-1 py-0.5 rounded bg-cyber-surface text-cyber-text-secondary/60 text-[10px] font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-cyber-surface text-cyber-text-secondary/60 text-[10px] font-mono">Shift + Enter</kbd> for new line
          </p>
        </div>
      </motion.div>
    </section>
  );
}
