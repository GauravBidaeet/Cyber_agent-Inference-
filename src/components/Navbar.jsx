import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiShieldCheck, HiBars3, HiXMark } from "react-icons/hi2";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#documentation" },
  { label: "GitHub", href: "https://github.com", external: true },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSmoothScroll = useCallback((e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileOpen(false);
    }
  }, []);

  const handleLaunchChat = useCallback((e) => {
    e.preventDefault();
    const chatSection = document.querySelector("#chat-section");
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      style={{
        borderBottom: "1px solid transparent",
        borderImage:
          "linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent) 1",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 group"
            aria-label="CyberLM Home"
          >
            <HiShieldCheck className="text-2xl text-cyber-green drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] group-hover:drop-shadow-[0_0_14px_rgba(0,255,136,0.9)] transition-all duration-300" />
            <span
              className="text-xl font-display font-bold tracking-wide text-cyber-green drop-shadow-[0_0_10px_rgba(0,255,136,0.5)] group-hover:drop-shadow-[0_0_18px_rgba(0,255,136,0.8)] transition-all duration-300"
            >
              CyberLM
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative px-4 py-2 text-sm font-medium text-cyber-text-secondary hover:text-cyber-green transition-colors duration-300 rounded-lg hover:bg-white/[0.03] group"
              >
                {link.label}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyber-green rounded-full group-hover:w-6 transition-all duration-300 shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Launch Chat button */}
            <motion.button
              onClick={handleLaunchChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-cyber-green text-black font-semibold text-sm rounded-full hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-shadow duration-300 cursor-pointer"
            >
              Launch Chat
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-cyber-text-secondary hover:text-cyber-green hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiXMark className="text-xl" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiBars3 className="text-xl" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-white/[0.05]"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  className="block px-4 py-2.5 text-sm font-medium text-cyber-text-secondary hover:text-cyber-green hover:bg-white/[0.03] rounded-lg transition-colors duration-200"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                onClick={handleLaunchChat}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: NAV_LINKS.length * 0.06,
                  duration: 0.3,
                }}
                className="w-full mt-2 px-5 py-2.5 bg-cyber-green text-black font-semibold text-sm rounded-full hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-shadow duration-300 cursor-pointer sm:hidden"
              >
                Launch Chat
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
