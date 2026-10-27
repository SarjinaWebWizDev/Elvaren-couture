import PolicyPage from '../components/PolicyPage';
import { site } from '../data/site';
import { formatINR } from '../utils/currency';

export default function Terms() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="The terms that apply when you browse or buy from this website."
      sections={[
        {
          heading: 'Using this website',
          body: ['By using this website you agree to these terms. Please do not use the website if you do not agree.'],
        },
        {
          heading: 'Products and prices',
          body: [
            'Prices are shown in Indian rupees (INR). Colours may vary slightly from photographs because of screen settings and lighting.',
            'We may correct pricing or product errors, and will let you know before processing an order affected by one.',
          ],
        },
        {
          heading: 'Orders',
          body: [
            'Placing an order is an offer to buy. An order is confirmed only once the store accepts it.',
            'You are responsible for providing accurate delivery details.',
          ],
        },
        {
          heading: 'Promotional codes',
          body: [
            'Promotional codes apply only to the products and dates stated, cannot be exchanged for cash and may be withdrawn at any time. The discount is shown in your bag before you place an order.',
          ],
        },
        {
          heading: 'Shipping and returns',
          body: [
            `Shipping is ${formatINR(site.shipping.method.flatRate)}, free from ${formatINR(site.shipping.method.freeOver)}. Returns can be requested within ${site.returns.windowDays} days of delivery, as described on the Shipping & Returns page.`,
          ],
        },
        {
          heading: 'Intellectual property',
          body: ['The ÉLVARÉN name, logo, text and imagery on this website may not be copied or reused without permission.'],
        },
        {
          heading: 'Limitation of liability',
          body: ['To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of this website.'],
        },
        {
          heading: 'Governing law',
          body: ['These terms are governed by the laws of India. The seller’s registered business name and address should be added here before launch.'],
        },
      ]}
    />
  );
}
