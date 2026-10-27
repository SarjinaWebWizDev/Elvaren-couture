import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

// WAI-ARIA accordion: buttons toggle regions; Up/Down/Home/End move between headers.
export default function FAQAccordion({ items }) {
  const uid = useId();
  const [open, setOpen] = useState(0);
  const buttons = useRef([]);

  const onKeyDown = (e, i) => {
    const last = items.length - 1;
    let next = null;
    if (e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next !== null) {
      e.preventDefault();
      buttons.current[next]?.focus();
    }
  };

  return (
    <div className="border-t">
      {items.map((item, i) => {
        const isOpen = open === i;
        const bId = `${uid}-b${i}`;
        const pId = `${uid}-p${i}`;
        return (
          <div key={item.q} className="border-b">
            <h3>
              <button
                ref={(el) => (buttons.current[i] = el)}
                id={bId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={pId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.3rem] leading-snug transition-colors hover:text-burgundy sm:text-[1.5rem]"
              >
                <span>{item.q}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-gold">
                  <Plus size={22} aria-hidden="true" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={pId}
                  role="region"
                  aria-labelledby={bId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 text-[0.98rem] leading-relaxed text-espresso/80">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
