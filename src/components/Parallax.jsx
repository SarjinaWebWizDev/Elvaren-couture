import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

// Gentle vertical parallax for a framed image. The image is scaled slightly so
// the frame never shows an edge; disabled entirely for reduced-motion users.
export default function Parallax({ children, distance = 22, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const scale = 1 + (distance * 2.6) / 400; // ~1.14 at the default distance

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      <motion.div style={reduce ? undefined : { y, scale }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
