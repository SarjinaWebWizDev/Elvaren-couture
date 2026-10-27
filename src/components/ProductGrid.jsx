import { motion } from 'motion/react';
import ProductCard from './ProductCard';

const EASE = [0.22, 0.61, 0.36, 1];

// Two columns on phones, three on tablets, four on desktops. Cards share one
// aspect ratio and a fixed-height title block so rows always align.
export default function ProductGrid({ products, columns = 4, eagerCount = 0 }) {
  const cols = columns === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
  return (
    <ul className={`grid gap-x-3 gap-y-9 sm:gap-x-5 xl:gap-x-6 ${cols}`}>
      {products.map((p, i) => (
        <motion.li
          key={p.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -6% 0px' }}
          transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.07 }}
          className="min-w-0"
        >
          <ProductCard product={p} priority={i < eagerCount} />
        </motion.li>
      ))}
    </ul>
  );
}
