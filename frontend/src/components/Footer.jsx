import { motion } from "framer-motion";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full glass"
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-5 text-center">

        {/* Links row */}
        <div className="flex items-center gap-2 text-xs text-cyber-text-secondary">
          {FOOTER_LINKS.map((link, index) => (
            <span key={link.label} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-white/10 select-none">·</span>
              )}
              <a
                href={link.href}
                className="hover:text-cyber-green transition-colors duration-200"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-cyber-text-secondary/60">
          © 2026 CyberLM. All rights reserved.
        </p>
      </div>

      {/* Subtle top glow accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,136,0.25), transparent)",
        }}
        aria-hidden="true"
      />
    </motion.footer>
  );
}
