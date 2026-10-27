const fmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

// 2799 -> "₹2,799"  (single consistent formatter for the whole site)
export const formatINR = (amount) => fmt.format(Number(amount) || 0).replace(/\s/g, '');
