# ÉLVARÉN — Contemporary Luxury Ethnic Wear

A complete React storefront: 25 products, five collections, product pages, wishlist, bag with
discount-code and shipping maths, checkout, confirmation and all content pages.

**Stack:** React 19 · Vite 6 · Tailwind CSS 4 · React Router 6 · Motion · Lucide React (JavaScript/JSX)

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

Extra checks (no install needed beyond Node 18+):

```bash
npm run check:images   # confirms all 25 product photos exist, with exact filenames
npm run test:logic     # 26 checks: catalogue, prices, discount, shipping, filters
```

## Where to change things

| What | File |
| --- | --- |
| Shipping fee, free-shipping threshold, returns window, payment options, contact details, social links, backend endpoints | `src/data/site.js` |
| Seasonal offer (code, %, eligible products, optional dates, terms) | `src/data/campaign.js` |
| Products (names, prices, sizes, colours, descriptions, image paths) | `src/data/products.js` |
| The five collections | `src/data/collections.js` |
| Colours / fonts | `src/index.css` (`@theme`) |

FAQs, policy pages, the announcement bar, product labels and the bag all read from those files,
so the site never advertises a discount or policy that is not actually applied.

## Product images

All 25 photographs live in `public/images/products/` with the exact filenames from the brief and
are referenced as `/images/products/<filename>`. If a file is ever missing, the card shows a
branded placeholder (no unrelated image is substituted) and the exact missing filename is logged
to the browser console.

## What is and is not connected — please read

Nothing here pretends to be more than it is:

- **No payment provider.** Checkout offers *cash on delivery*; online payment is shown as
  unavailable. No card details are collected.
- **No order backend.** Until you set `site.orders.endpoint` in `src/data/site.js`, an order is
  saved on the buyer's device only, and the confirmation page says plainly that it has *not* been
  sent to a store system. Point `endpoint` at your own API (it receives a JSON `POST`) to go live.
- **Contact form and newsletter** work the same way (`site.contact.endpoint`,
  `site.newsletter.endpoint`). Without an endpoint they tell the visitor honestly that nothing
  was sent.
- **Contact details and social links** are `null`/empty on purpose — the site does not invent a
  phone number, address or account. Fill them in `src/data/site.js`.
- **Privacy Policy, Terms, Shipping & Returns** are starting templates generated from your config.
  They show a "draft" notice until you review them and set `policyReviewed: true`. Add the legal
  business name/address to the Terms before launch.
- **Delivery estimates** are not published (`shipping.timelineText` is `null`), and the pincode
  checker only validates the format — it does not claim serviceability.

## Seasonal offer

`FESTIVE10` gives 10% off the six styles listed in `eligibleProductIds`, only while
`offer.enabled` is true (and inside `startsAt`/`endsAt` if you set them). The discount is a visible
line in the bag, is applied before the free-shipping check, and eligible products carry a label.
There are no countdowns or scarcity messages.

## Deploying

It is a single-page app, so unknown paths must serve `index.html`. Rewrites are included for
Vercel (`vercel.json`) and Netlify/Cloudflare Pages (`public/_redirects`).

## Notes

- The photograph supplied as `product-mustard-festive-gharara.jpg` shows a sage-green and rose
  set, not mustard. The product keeps its requested name and filename; its colour data follows the
  photograph. Replace the file (same filename) or rename the product in `src/data/products.js`.
- Cart and wishlist persist in `localStorage` (`elvaren.cart.v1`, `elvaren.wishlist.v1`).


## Editorial photography

`public/images/editorial/` holds 24 mood photographs (not catalogue products — no price or product page).
They are listed in `src/data/editorial.js` and used on the home hero, "mood of the season" arches, the
philosophy section, and the Our Story page. To swap one, replace the file (keep the name) or edit its entry.
To turn a photo into a sellable product, add it to `src/data/products.js` with a real name and price.
Supporting colours added: blush `#EAD7CD`, mist `#C8D5DD`, taupe `#8B7B6F`, ink `#211917`.
