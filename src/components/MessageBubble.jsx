import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { HiUser, HiCpuChip } from 'react-icons/hi2';
import CodeBlock from './CodeBlock';

function formatTimestamp(iso) {
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function MessageBubble({ message }) {
  const { role, content, timestamp } = message;
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-green/20 flex items-center justify-center mt-1">
          <HiUser className="w-4 h-4 text-cyber-green" />
        </div>
      ) : (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-surface border border-cyber-green/30 flex items-center justify-center mt-1">
          <HiCpuChip className="w-4 h-4 text-cyber-green" />
        </div>
      )}

      {/* Content */}
      <div
        className={`flex flex-col max-w-[85%] md:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Bubble */}
        <div
          className={`px-4 py-3 text-[0.935rem] leading-relaxed ${
            isUser
              ? 'bg-cyber-user-bubble text-cyber-text rounded-2xl rounded-br-sm border border-cyber-green/10'
              : 'bg-cyber-assistant-bubble text-cyber-text rounded-2xl rounded-bl-sm border border-white/[0.04]'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{content}</p>
          ) : (
            <div className="chat-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{ code: CodeBlock }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span
            className={`text-xs text-cyber-text-secondary mt-1.5 px-1 ${
              isUser ? 'text-right' : 'text-left'
            }`}
          >
            {formatTimestamp(timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
