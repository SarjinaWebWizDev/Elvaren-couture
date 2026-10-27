import { Link } from 'react-router-dom';
import { campaign } from '../data/campaign';
import { isOfferLive } from '../utils/pricing';

export default function AnnouncementBar() {
  const offer = campaign.offer;
  const live = isOfferLive(offer);
  return (
    <div className="on-dark bg-ink text-ivory">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-5 gap-y-0.5 py-2.5 text-center text-[0.64rem] font-medium uppercase leading-snug tracking-[0.14em] sm:text-[0.7rem] sm:tracking-[0.18em]">
        <span>{campaign.announcement}</span>
        {live && (
          <Link
            to="/shop?edit=festive"
            className="underline decoration-gold decoration-1 underline-offset-[5px] hover:decoration-ivory"
          >
            {offer.code} · {offer.shortLabel} selected styles
          </Link>
        )}
      </div>
    </div>
  );
}
