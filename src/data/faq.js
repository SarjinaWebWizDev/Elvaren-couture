// FAQ answers are generated from site/campaign config so they never promise
// anything the store has not configured.
import { site } from './site.js';
import { campaign } from './campaign.js';
import { formatINR } from '../utils/currency.js';

export function buildFaqs() {
  const m = site.shipping.method;
  const enabledPayments = site.payments.filter((p) => p.enabled).map((p) => p.label.toLowerCase());
  const offer = campaign.offer;
  const contactBits = [
    site.contact.email && `email ${site.contact.email}`,
    site.contact.phone && `call ${site.contact.phone}`,
  ].filter(Boolean);

  return [
    {
      q: 'How do I place an order?',
      a: 'Browse the collections, choose your size on the product page and add the piece to your bag. When you are ready, open your bag, review it and continue to checkout. Enter your delivery details, choose a payment option and place your order. You will see a confirmation page with your order reference.',
    },
    {
      q: 'How do I select the correct size?',
      a: 'Each piece is offered in sizes XS to XL. Choose the size that matches your usual fit for tailored ethnic wear and, if you are between sizes, consider sizing up for a more relaxed line. If you need help deciding, send us a message from the Contact page and mention the style you are considering.',
    },
    {
      q: 'How do I care for embroidered garments?',
      a: 'Dry cleaning is recommended for embroidered and embellished pieces. Store them folded in a breathable cotton cover, away from direct sunlight and moisture, and avoid wringing or twisting embellished areas. Each product page lists care guidance for that piece.',
    },
    {
      q: 'What are the available payment methods?',
      a: enabledPayments.length
        ? `Currently available at checkout: ${enabledPayments.join(', ')}. Other payment methods may be added in future; only the options shown at checkout can be used. This website does not collect card details.`
        : 'No payment methods are enabled yet.',
    },
    {
      q: 'How does shipping work?',
      a: `We ship within ${site.shipping.regionsServed.join(', ')}. ${m.label} costs ${formatINR(m.flatRate)}, and is free when your order total after discounts is ${formatINR(m.freeOver)} or more. ${
        site.shipping.timelineText ||
        'Estimated delivery timelines have not been published on this site yet.'
      }`,
    },
    {
      q: 'How do I track an order?',
      a: 'Online order tracking is not connected on this website yet. Please keep the order reference shown on your confirmation page and use the Contact page to ask about the status of an order.',
    },
    {
      q: 'What is the return and exchange policy?',
      a: `You may request a return within ${site.returns.windowDays} days of delivery. ${site.returns.conditions.join(' ')} ${
        site.returns.exchangeForSize ? 'Size exchanges are available, subject to stock.' : ''
      } See the Shipping & Returns page for details.`,
    },
    {
      q: 'How do I cancel an order?',
      a: 'To ask for a cancellation, use the Contact page, choose “Order enquiry” and include your order reference as soon as possible. Whether an order can be cancelled depends on how far it has progressed.',
    },
    {
      q: 'How do promotional codes work?',
      a: offer.enabled
        ? `${offer.headline} Enter ${offer.code} in your bag. It applies only to the selected styles marked on their product cards, and the discount is shown as a line in your bag before you check out.`
        : 'There is no promotional code active right now.',
    },
    {
      q: 'How can I contact customer care?',
      a: contactBits.length
        ? `You can ${contactBits.join(' or ')}, or send a message through the Contact page.`
        : 'Customer-care contact details have not been configured on this site yet. The Contact page form is available, but messages are only delivered once a contact service is connected.',
    },
  ];
}
