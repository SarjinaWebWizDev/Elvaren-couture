import { useRef } from 'react';
import { motion } from 'motion/react';
import useModalBehavior from '../hooks/useModalBehavior';

const EASE = [0.22, 0.61, 0.36, 1];

const SIDES = {
  right: {
    from: { x: '100%' },
    panel: 'absolute inset-y-0 right-0 flex h-dvh w-full max-w-[440px] flex-col bg-ivory shadow-[-24px_0_60px_-40px_rgba(48,36,31,0.5)]',
  },
  left: {
    from: { x: '-100%' },
    panel: 'absolute inset-y-0 left-0 flex h-dvh w-[min(88vw,380px)] flex-col bg-ivory shadow-[24px_0_60px_-40px_rgba(48,36,31,0.5)]',
  },
  top: {
    from: { y: '-100%' },
    panel: 'absolute inset-x-0 top-0 max-h-[92dvh] overflow-y-auto bg-ivory shadow-[0_24px_60px_-40px_rgba(48,36,31,0.5)]',
  },
  center: {
    from: { y: 28, opacity: 0 },
    panel: 'pointer-events-auto relative flex max-h-[94dvh] w-full max-w-[940px] flex-col overflow-y-auto bg-ivory shadow-[0_30px_80px_-40px_rgba(48,36,31,0.6)]',
  },
};

/**
 * Generic animated dialog. Render it inside <Portal><AnimatePresence> so the
 * exit animation plays when the parent stops rendering it.
 */
export default function SidePanel({ side = 'right', label, onClose, children, className = '' }) {
  const ref = useRef(null);
  useModalBehavior(ref, onClose);
  const cfg = SIDES[side];

  const backdrop = { hidden: { opacity: 0 }, show: { opacity: 1 } };
  const panel = { hidden: cfg.from, show: { x: 0, y: 0, opacity: 1 } };
  const t = { duration: 0.42, ease: EASE };

  const dialog = (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      variants={panel}
      transition={t}
      className={`${cfg.panel} ${className}`}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-[70]"
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      <motion.div
        variants={backdrop}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-espresso/45"
        onClick={onClose}
        aria-hidden="true"
      />
      {side === 'center' ? (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center sm:items-center sm:p-6">
          {dialog}
        </div>
      ) : (
        dialog
      )}
    </motion.div>
  );
}
