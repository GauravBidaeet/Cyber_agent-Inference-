import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import worldImage from '../assets/world.png';

const floatingOrbs = [
  { size: 'w-72 h-72', top: '10%', left: '-5%', delay: 0, duration: 8 },
  { size: 'w-96 h-96', top: '60%', right: '-10%', delay: 2, duration: 10 },
  { size: 'w-64 h-64', bottom: '5%', left: '20%', delay: 4, duration: 9 },
  { size: 'w-48 h-48', top: '25%', right: '15%', delay: 1, duration: 7 },
  { size: 'w-56 h-56', bottom: '20%', right: '30%', delay: 3, duration: 11 },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function HeroSection() {
  const handleScrollToChat = () => {
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-cyber-bg px-4">
      {/* ── World globe background — fills the entire hero, semi-transparent ── */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Pulsing green glow behind the globe */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-cyber-green/10 blur-[100px]"
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
        <img
          src={worldImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain opacity-25 mix-blend-screen drop-shadow-[0_0_80px_rgba(0,255,136,0.2)]"
          style={{
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
        />
      </motion.div>

      {/* Floating green orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.size} rounded-full bg-cyber-green opacity-[0.06] blur-3xl pointer-events-none`}
          style={{
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.08, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* ── Content — sits on top of the globe ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyber-green/40 bg-cyber-green/[0.06] px-5 py-2 text-xs font-medium tracking-widest uppercase text-cyber-green backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-green" />
            </span>
            Cybersecurity AI Platform
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-7xl md:text-8xl lg:text-9xl font-black text-cyber-green text-glow leading-none tracking-tight"
        >
          CyberLM
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-cyber-green/80 font-light tracking-wide"
        >
          The Cybersecurity Intelligence Model
        </motion.p>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="max-w-3xl text-center text-base md:text-lg text-cyber-green/60 leading-relaxed"
        >
          Specialized Large Language Model for Malware Analysis, Reverse Engineering,
          Threat Intelligence, Secure Coding, CVE Analysis and Offensive Security.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          onClick={handleScrollToChat}
          className="group relative inline-flex items-center gap-3 rounded-full bg-cyber-green px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] cursor-pointer mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Chatting
          <HiArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-bg to-transparent pointer-events-none z-10" />
    </section>
  );
}
