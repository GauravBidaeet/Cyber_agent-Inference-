import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClipboard, HiCheck } from 'react-icons/hi2';

export default function CodeBlock({ children, className, node, ...rest }) {
  const [copied, setCopied] = useState(false);

  const isInline = !className && typeof children === 'string' && !children.includes('\n');

  const languageMatch = className?.match(/language-(\w+)/);
  const language = languageMatch ? languageMatch[1] : '';

  const getCodeText = useCallback(() => {
    const extractText = (child) => {
      if (typeof child === 'string') return child;
      if (Array.isArray(child)) return child.map(extractText).join('');
      if (child?.props?.children) return extractText(child.props.children);
      return '';
    };
    return extractText(children);
  }, [children]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getCodeText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = getCodeText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getCodeText]);

  if (isInline) {
    return (
      <code
        className="bg-cyber-green-soft text-cyber-green px-1.5 py-0.5 rounded font-mono text-[0.85em]"
        {...rest}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-white/[0.06] bg-cyber-surface">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0d] border-b border-white/[0.06]">
        <span className="text-xs font-mono text-cyber-text-secondary tracking-wide uppercase">
          {language || 'code'}
        </span>

        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md
                     text-cyber-text-secondary hover:text-cyber-green
                     hover:bg-cyber-green-soft transition-colors duration-200"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1 text-cyber-green"
              >
                <HiCheck className="w-3.5 h-3.5" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1"
              >
                <HiClipboard className="w-3.5 h-3.5" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Code content — rehype-highlight applies syntax classes to children */}
      <code className={`${className || ''} block px-5 py-4 font-mono text-[0.82rem] leading-relaxed overflow-x-auto bg-transparent`} {...rest}>
        {children}
      </code>
    </div>
  );
}
