/* Global UI state of the list screen. */
'use strict';

// ---------- state ----------
const S = { tab: 'all', q: '', from: '', to: '', day: '', body: '', cap: '', vol: '', wt: '', types: {}, sort: 'default', vat: false, page: 1,
            saved: store.get('saved', {}), taken: {}, offers: {}, offerAt: {}, nav: window.matchMedia('(min-width:1920px)').matches, theme: store.get('theme', 'light'), offerId: null };

const vatK = () => (S.vat ? 1.22 : 1);
