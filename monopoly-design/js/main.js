/* Boot. */
'use strict';

applyChrome();
render();
fitSearch();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitSearch(); });
