import { motion } from 'framer-motion';
import { HiCpuChip } from 'react-icons/hi2';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-3"
    >
      {/* Assistant avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-surface border border-cyber-green/30 flex items-center justify-center mt-1">
        <HiCpuChip className="w-4 h-4 text-cyber-green" />
      </div>

      {/* Bubble */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-cyber-text-secondary font-medium tracking-wide">
          CyberLM is thinking...
        </span>

        <div className="bg-cyber-assistant-bubble rounded-2xl rounded-bl-sm px-5 py-3.5 inline-flex items-center gap-1.5 border border-white/[0.04]">
          <span className="typing-dot w-2 h-2 rounded-full bg-cyber-green" />
          <span className="typing-dot w-2 h-2 rounded-full bg-cyber-green" />
          <span className="typing-dot w-2 h-2 rounded-full bg-cyber-green" />
        </div>
      </div>
    </motion.div>
  );
}
