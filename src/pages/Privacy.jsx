import PolicyPage from '../components/PolicyPage';
import { site } from '../data/site';

export default function Privacy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="What information this website uses, and why."
      sections={[
        {
          heading: 'What this website stores on your device',
          body: [
            'To work as a shop, this website stores a small amount of information in your browser’s local storage:',
            [
              'Your shopping bag and any promotional code you applied.',
              'Your wishlist.',
              'Your most recent order details, if you place an order.',
              'An email address, if you use the newsletter form while sign-up delivery is not connected.',
            ],
            'This information stays on your device unless a service is connected, as described below. You can clear it at any time from your browser settings.',
          ],
        },
        {
          heading: 'Information you submit',
          body: [
            'When you place an order or send a message, you provide details such as your name, email, phone number and delivery address. We use these only to handle your order or reply to your message.',
            site.orders.endpoint || site.contact.endpoint || site.newsletter.endpoint
              ? 'Where a service is connected, the details you submit are sent to it so the store can process them.'
              : 'At the moment no order, contact or newsletter service is connected to this website, so submitted details are not transmitted anywhere.',
          ],
        },
        {
          heading: 'Payments',
          body: ['This website does not collect card, bank or UPI details.'],
        },
        {
          heading: 'Cookies and analytics',
          body: ['This website does not use advertising cookies or third-party analytics. Fonts are loaded from Google Fonts.'],
        },
        {
          heading: 'Your choices',
          body: [
            'You can ask us to correct or delete the information we hold about you by contacting customer care.',
            site.contact.email ? `Email: ${site.contact.email}` : 'Customer-care contact details have not been published on this site yet.',
          ],
        },
      ]}
    />
  );
}
