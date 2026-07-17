import React from 'react';
import { motion } from 'framer-motion';
import {
  HiBugAnt,
  HiMagnifyingGlass,
  HiCog6Tooth,
  HiCodeBracket,
  HiShieldExclamation,
  HiMap,
} from 'react-icons/hi2';

const features = [
  {
    title: 'Malware Analysis',
    description: 'Deep analysis of malware samples, behavior patterns, and IOC extraction',
    icon: HiBugAnt,
  },
  {
    title: 'Threat Hunting',
    description: 'Proactive threat detection and advanced persistent threat identification',
    icon: HiMagnifyingGlass,
  },
  {
    title: 'Reverse Engineering',
    description: 'Binary analysis, disassembly interpretation, and vulnerability discovery',
    icon: HiCog6Tooth,
  },
  {
    title: 'Secure Code Review',
    description: 'Automated security auditing with remediation recommendations',
    icon: HiCodeBracket,
  },
  {
    title: 'CVE Intelligence',
    description: 'Real-time vulnerability tracking, impact analysis, and patch guidance',
    icon: HiShieldExclamation,
  },
  {
    title: 'MITRE ATT&CK Mapping',
    description: 'Technique identification and tactical threat framework alignment',
    icon: HiMap,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function FeatureCards() {
  return (
    <section id="features" className="relative py-24 px-4 md:px-8 bg-cyber-bg">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl font-bold text-cyber-white mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          Capabilities
        </motion.h2>

        {/* Green underline accent */}
        <motion.div
          className="mx-auto h-1 w-16 rounded-full bg-cyber-green mb-5"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        <motion.p
          className="text-cyber-text-secondary text-base md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Powered by advanced cybersecurity intelligence
        </motion.p>
      </div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative rounded-2xl p-6 glass gradient-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] cursor-default"
            >
              {/* Green dot indicator — top right */}
              <div className="absolute top-4 right-4 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-cyber-green/60 group-hover:bg-cyber-green transition-colors duration-300" />
                <span className="absolute h-2 w-2 rounded-full bg-cyber-green/40 animate-ping" />
              </div>

              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-cyber-green/[0.08] p-3 transition-transform duration-300 group-hover:scale-110">
                <IconComponent className="h-10 w-10 text-cyber-green" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-cyber-white mb-2 tracking-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-cyber-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
