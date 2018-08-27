const CFDI = require('./index').CFDI;
const debug = require('debug')('cfdi:parse');

const main = async () => {
  const e32 = await new CFDI('./cfd/wrong.32.xml');
  const e33 = await new CFDI('./cfd/wrong.33.xml');
  const good = await new CFDI('./cfd/signed.xml');
  const another = await new CFDI('./cfd/payment.xml');

  debug('= = = = = = WRONG 3.2 = = = = = = = =');
  // debug(e32.comprobante());
  debug(e32.relacionados());
  // debug(e32.crypto());
  // debug(e32.uuid());
  // debug(e32.emisor());
  // debug(e32.receptor());
  debug('= = = = = = WRONG 3.2 = = = = = = = =');

  debug('= = = = = = WRONG 3.3 = = = = = = = =');
  // debug(e33.comprobante());
  debug(e33.relacionados());
  // debug(e33.crypto());
  // debug(e33.uuid());
  // debug(e33.emisor());
  // debug(e33.receptor());
  debug('= = = = = = WRONG 3.3 = = = = = = = =');

  debug('= = = = = = RIGHT = = = = = = = =');
  // debug(good.comprobante());
  debug(good.relacionados());
  // debug(good.crypto());
  // debug(good.uuid());
  // debug(good.emisor());
  // debug(good.receptor());
  debug('= = = = = = RIGHT = = = = = = = =');

  debug('= = = = = = ANOTHER = = = = = = = =');
  // debug(another.comprobante());
  debug(another.relacionados());
  // debug(another.crypto());
  // debug(another.uuid());
  // debug(another.emisor());
  // debug(another.receptor());
  debug('= = = = = = ANOTHER = = = = = = = =');
};

main();
